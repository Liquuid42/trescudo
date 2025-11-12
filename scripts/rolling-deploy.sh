#!/bin/bash

# Rolling Update Deployment Script for Trescudo Static Site
# Zero-downtime deployment using docker compose scaling
# Updated to handle both custom container names and scaling

set -e

# Parse command line arguments
ACTION="${1:-deploy}"

# Configuration
COMPOSE_FILE="./docker-compose.prod.yml"
PROJECT_NAME="trescudo"
SERVICE_NAME="nginx"
HEALTH_CHECK_TIMEOUT=120
HEALTH_CHECK_INTERVAL=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} [PROD] $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} [PROD] $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} [PROD] $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} [PROD] $1"
}

# Function to get all containers for the service
get_service_containers() {
    local service_name=$1
    docker ps --filter "label=com.docker.compose.service=$service_name" \
             --filter "label=com.docker.compose.project=$PROJECT_NAME" \
             --format "{{.Names}}" | sort
}

# Function to check if a service is healthy
check_service_health() {
    local service_name=$1
    local containers=$(get_service_containers $service_name)
    
    if [[ -z "$containers" ]]; then
        log_error "No containers found for service $service_name"
        return 1
    fi

    log_info "Checking health of $service_name containers..."
    
    local all_healthy=true
    for container in $containers; do
        log_info "Checking container: $container"
        
        # Check if container is running
        if ! docker ps --format "{{.Names}}" | grep -q "^$container$"; then
            log_error "Container $container not found or not running"
            all_healthy=false
            continue
        fi

        # Check health status
        local health_status=$(docker inspect $container --format='{{.State.Health.Status}}' 2>/dev/null || echo "none")

        if [[ "$health_status" == "healthy" ]]; then
            log_success "Container $container is healthy"
        elif [[ "$health_status" == "none" ]]; then
            # If no health check, verify container is running and responsive
            local container_status=$(docker inspect $container --format='{{.State.Status}}' 2>/dev/null || echo "unknown")
            if [[ "$container_status" == "running" ]]; then
                log_info "Container $container is running (no health check configured)"
            else
                log_warning "Container $container status: $container_status"
                all_healthy=false
            fi
        else
            log_warning "Container $container health status: $health_status"
            all_healthy=false
        fi
    done

    if [[ "$all_healthy" == "true" ]]; then
        log_success "All $service_name containers are healthy"
        return 0
    else
        log_error "Some $service_name containers are not healthy"
        return 1
    fi
}

# Function to wait for service to become healthy
wait_for_health() {
    local service_name=$1
    local timeout=$HEALTH_CHECK_TIMEOUT
    local elapsed=0

    log_info "Waiting for $service_name to become healthy (timeout: ${timeout}s)..."

    while [[ $elapsed -lt $timeout ]]; do
        if check_service_health $service_name; then
            log_success "$service_name is ready!"
            return 0
        fi

        sleep $HEALTH_CHECK_INTERVAL
        elapsed=$((elapsed + HEALTH_CHECK_INTERVAL))
        echo -n "."
    done

    echo ""
    log_error "$service_name failed to become healthy within ${timeout}s"
    return 1
}

# Function to get current running containers count
get_running_container_count() {
    local service_name=$1
    local containers=$(get_service_containers $service_name)
    echo "$containers" | grep -c . || echo 0
}

# Function to perform rolling update with zero downtime
perform_rolling_update() {
    log_info "Starting rolling update deployment for Trescudo..."

    # Note: Static site build is handled by Docker multi-stage build (no npm required on host)

    # Ensure shared network exists
    if ! docker network inspect shared_network >/dev/null 2>&1; then
        log_info "Creating shared_network..."
        docker network create shared_network
    fi

    # Get current running containers
    local current_count=$(get_running_container_count $SERVICE_NAME)

    if [[ $current_count -eq 0 ]]; then
        log_warning "No running containers found, performing fresh deployment"
        docker compose -p $PROJECT_NAME -f $COMPOSE_FILE up -d --build --force-recreate $SERVICE_NAME
        wait_for_health $SERVICE_NAME
        log_success "Fresh deployment completed successfully!"
        return 0
    fi

    log_info "Found $current_count running container(s)"

    # For rolling updates, we need to temporarily remove container_name to allow scaling
    # Create a temporary compose file without container_name
    local temp_compose_file="./docker-compose.prod.rolling.yml"
    
    log_info "Creating temporary compose file for rolling update..."
    sed '/container_name:/d' $COMPOSE_FILE > $temp_compose_file

    # Step 1: Build new image
    log_info "Building new image (without cache for fresh build)..."
    docker compose -p $PROJECT_NAME -f $temp_compose_file build --no-cache $SERVICE_NAME

    # Step 2: Scale up with new version (keeping old containers running)
    local new_scale=$((current_count + 1))
    log_info "Scaling $SERVICE_NAME to $new_scale containers for zero-downtime update..."
    
    docker compose -p $PROJECT_NAME -f $temp_compose_file up -d --scale $SERVICE_NAME=$new_scale --no-recreate $SERVICE_NAME

    # Step 3: Wait for new container to be healthy
    sleep 10  # Give container time to start
    if ! wait_for_health $SERVICE_NAME; then
        log_error "New $SERVICE_NAME container failed health checks, rolling back..."
        docker compose -p $PROJECT_NAME -f $temp_compose_file up -d --scale $SERVICE_NAME=$current_count --no-recreate $SERVICE_NAME
        rm -f $temp_compose_file
        return 1
    fi

    # Step 4: Scale down to 1 container (removes old containers, keeps new one)
    log_info "New $SERVICE_NAME container is healthy, scaling down old containers..."
    sleep 5  # Brief pause to ensure traffic has shifted

    docker compose -p $PROJECT_NAME -f $temp_compose_file up -d --scale $SERVICE_NAME=1 --no-recreate $SERVICE_NAME

    # Step 5: Switch back to original compose file with container_name for management
    log_info "Switching back to managed container configuration..."
    docker compose -p $PROJECT_NAME -f $COMPOSE_FILE up -d --force-recreate $SERVICE_NAME

    # Clean up temporary file
    rm -f $temp_compose_file

    # Step 6: Final health check
    if ! wait_for_health $SERVICE_NAME; then
        log_error "Final health check failed for $SERVICE_NAME"
        return 1
    fi

    # Reload nginx proxy to refresh upstream IPs
    log_info "Reloading external nginx proxy..."
    docker exec proxy-proxy-1 nginx -s reload 2>/dev/null || log_warning "Could not reload external proxy (may not be running)"

    # Clean up old images
    log_info "Cleaning up old images..."
    docker image prune -f --filter "until=24h" || true

    log_success "Rolling update deployment completed successfully!"
}

# Function to rollback to previous version
rollback() {
    log_warning "Performing rollback..."

    log_info "Restarting $SERVICE_NAME to previous state..."
    docker compose -p $PROJECT_NAME -f $COMPOSE_FILE restart $SERVICE_NAME

    if ! wait_for_health $SERVICE_NAME; then
        log_error "Rollback failed for $SERVICE_NAME"
        return 1
    fi

    # Reload nginx after rollback
    log_info "Reloading external nginx proxy after rollback..."
    docker exec proxy-proxy-1 nginx -s reload 2>/dev/null || log_warning "Could not reload external proxy"

    log_success "Rollback completed successfully"
}

# Function to show current deployment status
show_status() {
    log_info "Current deployment status:"
    echo ""
    docker ps --filter "label=com.docker.compose.project=$PROJECT_NAME" \
             --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""

    log_info "Service health status:"
    check_service_health $SERVICE_NAME || true
}

# Function to check health
check_health() {
    log_info "Checking health status..."
    if check_service_health $SERVICE_NAME; then
        log_success "All services are healthy"
        exit 0
    else
        log_error "Service health check failed"
        exit 1
    fi
}

# Main script logic
case "$ACTION" in
    "deploy")
        perform_rolling_update
        ;;
    "rollback")
        rollback
        ;;
    "status")
        show_status
        ;;
    "health")
        check_health
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|status|health}"
        echo "Actions:"
        echo "  deploy   - Perform rolling update deployment (default)"
        echo "  rollback - Rollback to previous version"
        echo "  status   - Show current deployment status"
        echo "  health   - Check health of service"
        exit 1
        ;;
esac
