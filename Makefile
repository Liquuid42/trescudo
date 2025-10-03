.PHONY: all up down build restart logs clean certs help rolling-deploy-prod rolling-health-prod rolling-status-prod rolling-rollback-prod

# Default target - bring up the application
all: up

# Generate SSL certificates for development
certs:
	@echo "Generating SSL certificates..."
	@./generate-certs.sh

# Build and start containers
up:
	@echo "Starting Trescudo application..."
	@docker compose up -d
	@echo "Application is running at:"
	@echo "  HTTPS: https://localhost"
	@echo "  HTTP:  http://localhost (redirects to HTTPS)"

# Stop and remove containers
down:
	@echo "Stopping Trescudo application..."
	@docker compose down

# Build/rebuild containers
build:
	@echo "Building Docker images..."
	@docker compose build

# Restart containers
restart:
	@echo "Restarting Trescudo application..."
	@docker compose restart

# View logs
logs:
	@docker compose logs -f

# Clean up everything (containers, volumes, certificates)
clean: down
	@echo "Cleaning up..."
	@rm -rf certs/*.pem
	@docker compose down -v
	@echo "Cleanup complete"

# Development with hot reload (Eleventy on host, nginx in Docker)
dev:
	@echo "Starting development environment..."
	@if [ ! -d "src/node_modules" ]; then \
		echo "Installing dependencies..."; \
		cd src && npm ci; \
	fi
	@if [ ! -d "dist" ]; then \
		echo "Building initial dist/..."; \
		cd src && npm run build && cd ..; \
	fi
	@echo "Starting nginx in Docker..."
	@docker compose up -d
	@echo ""
	@echo "=========================================="
	@echo "Development environment running:"
	@echo "  Nginx:    https://localhost"
	@echo "            http://localhost"
	@echo "  Eleventy: http://localhost:8080"
	@echo "  Hot reload: Edit src/, auto-rebuilds"
	@echo "=========================================="
	@echo ""
	@echo "Starting Eleventy watch mode..."
	@cd src && npm run start

# Stop development environment
dev-stop:
	@echo "Stopping development environment..."
	@docker compose down
	@pkill -f "eleventy" || true
	@echo "Development environment stopped"

# Rebuild manually (if needed)
dev-rebuild:
	@echo "Rebuilding site..."
	@cd src && npm run build
	@echo "Rebuild complete. Refresh browser."

# Production rolling deployment
rolling-deploy-prod:
	@echo "Starting production rolling deployment..."
	@./scripts/rolling-deploy.sh deploy

rolling-health-prod:
	@echo "Checking production deployment health..."
	@./scripts/rolling-deploy.sh health

rolling-status-prod:
	@echo "Checking production deployment status..."
	@./scripts/rolling-deploy.sh status

rolling-rollback-prod:
	@echo "Rolling back production deployment..."
	@./scripts/rolling-deploy.sh rollback

# Show help
help:
	@echo "Trescudo Docker Makefile"
	@echo ""
	@echo "Development targets:"
	@echo "  make dev         - Start development with hot reload"
	@echo "  make dev-stop    - Stop development environment"
	@echo "  make dev-rebuild - Manually rebuild dist/"
	@echo "  make up          - Start nginx (serves dist/)"
	@echo "  make down        - Stop nginx"
	@echo "  make build       - Build Docker images"
	@echo "  make restart     - Restart the application"
	@echo "  make logs        - View application logs"
	@echo "  make certs       - Generate SSL certificates"
	@echo "  make clean       - Stop and clean up everything"
	@echo ""
	@echo "Production targets:"
	@echo "  make rolling-deploy-prod   - Deploy with zero downtime"
	@echo "  make rolling-health-prod   - Check production health"
	@echo "  make rolling-status-prod   - Check deployment status"
	@echo "  make rolling-rollback-prod - Rollback deployment"
	@echo ""
	@echo "  make help    - Show this help message"
