# Trescudo Cybersecurity

This is a static website for Trescudo Cybersecurity, dockerized with Nginx for production deployment.

## Project Structure

```
.
├── src/                        # Static website files (volume mounted)
│   ├── index.html             # Homepage
│   ├── assets/                # CSS, JS, images, fonts
│   ├── robots.txt             # SEO configuration
│   ├── sitemap.xml            # SEO sitemap
│   └── *.html                 # Additional pages
├── conf/                       # Nginx configuration (volume mounted)
│   ├── nginx.conf             # Development nginx configuration
│   └── nginx.prod.conf        # Production nginx configuration
├── certs/                      # SSL certificates (volume mounted)
│   ├── cert.pem               # SSL certificate
│   └── key.pem                # SSL private key
├── scripts/                    # Deployment scripts
│   └── rolling-deploy.sh      # Rolling deployment script
├── .github/workflows/          # GitHub Actions
│   └── production.yml         # Production deployment workflow
├── docker-compose.yml          # Development Docker Compose
├── docker-compose.prod.yml    # Production Docker Compose
├── Dockerfile                  # Docker image definition
├── Makefile                    # Build and deployment commands
└── generate-certs.sh           # Certificate generation script
```

## Quick Start

### 1. Generate SSL Certificates (Development)

For local development, generate self-signed certificates:

```bash
./generate-certs.sh
```

**For production**: Replace the certificates in `certs/` with certificates from a trusted CA (e.g., Let's Encrypt).

### 2. Build and Run

```bash
docker-compose up -d
```

### 3. Access the Site

- **HTTPS**: https://localhost (recommended)
- **HTTP**: http://localhost (redirects to HTTPS)

### 4. Stop the Application

```bash
docker-compose down
```

## Configuration

### Nginx Features

The nginx configuration includes:

- **SSL/TLS**: HTTPS on port 443 with HTTP to HTTPS redirect
- **Gzip Compression**: Enabled for HTML, CSS, JS, JSON, SVG, fonts
- **Caching**: Aggressive caching for static assets (1 year)
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, CSP, etc.
- **SEO Optimization**: Proper MIME types, charset UTF-8, sitemap/robots.txt handling
- **Error Handling**: Custom error pages

### Volume Mounts

- `./src` → `/usr/share/nginx/html` (read-only)
- `./conf/nginx.conf` → `/etc/nginx/nginx.conf` (read-only)
- `./certs` → `/etc/nginx/certs` (read-only)

## Production Deployment

### Using Let's Encrypt (Recommended)

1. Install certbot on your server
2. Generate certificates:
   ```bash
   certbot certonly --standalone -d yourdomain.com
   ```
3. Copy certificates to `certs/` directory:
   ```bash
   cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem certs/cert.pem
   cp /etc/letsencrypt/live/yourdomain.com/privkey.pem certs/key.pem
   ```
4. Update `server_name` in `conf/nginx.conf` to your domain
5. Deploy with docker-compose

### Environment Variables

Set the timezone (optional):
```bash
export TZ=America/New_York
```

## Development

To make changes to the website:

1. Edit files in the `src/` directory
2. Changes are reflected immediately (no rebuild needed due to volume mount)
3. For nginx configuration changes, restart the container:
   ```bash
   docker-compose restart
   ```

## Monitoring

View logs:
```bash
docker-compose logs -f nginx
```

Check container health:
```bash
docker-compose ps
```

## Performance

The application includes several performance optimizations:

- Gzip compression (6x compression level)
- Static asset caching (1 year expiry)
- HTTP/2 support
- Sendfile and TCP optimizations
- Keep-alive connections

## Security

Security features implemented:

- TLS 1.2+ only (development with self-signed certs, production via external proxy)
- Security headers (X-Frame-Options, CSP, etc.)
- Server tokens disabled
- Hidden files access denied
- HTTPS enforcement (development only, production handled by external proxy)

---

## Production Deployment

The application supports **zero-downtime rolling deployments** to production using GitHub Actions and self-hosted runners.

### Prerequisites

1. **Self-hosted GitHub Runner** configured with the `production` label
2. **Docker** and **Docker Compose** installed on the production server
3. **Shared Docker Network** for proxy communication:
   ```bash
   docker network create shared_network
   ```
4. **External Nginx Proxy** handling SSL/TLS termination and forwarding to the Trescudo container
5. **GitHub Secrets** configured in repository settings:
   - `ACCESS_TOKEN` - GitHub personal access token with repo access
   - `USR_PW` - Sudo password for the deployment user (if required)

### Deployment Architecture

```
Internet → External Nginx Proxy (HTTPS) → shared_network → Trescudo Nginx (HTTP:8080)
```

The production setup uses:
- **External proxy**: Handles SSL certificates (Let's Encrypt auto-renewal) and HTTPS termination
- **Trescudo container**: Serves static content via HTTP on port 8080, accessible via `shared_network`
- **Rolling deployment**: Zero-downtime updates by scaling containers up/down

### Manual Production Deployment

Deploy manually using the Makefile:

```bash
# Deploy with zero downtime
make rolling-deploy-prod

# Check deployment health
make rolling-health-prod

# Check deployment status
make rolling-status-prod

# Rollback if needed
make rolling-rollback-prod
```

### Automatic GitHub Actions Deployment

The application automatically deploys to production when changes are pushed to the `main` branch.

**Deployment workflow:**
1. Push commits to `main` branch
2. GitHub Actions triggers on self-hosted runner
3. Renames old deployment directory (keeps 2 most recent for rollback)
4. Clones fresh repository
5. Executes rolling deployment (zero downtime)
6. Verifies health checks
7. On failure: automatic rollback to previous version
8. Cleans up old deployment backups

**View deployment logs:**
```bash
# On the production server
cd ~/trescudo
docker compose -p trescudo -f docker-compose.prod.yml logs -f
```

### External Nginx Proxy Configuration

Your external nginx proxy should forward requests to the Trescudo container on the `shared_network`:

```nginx
upstream trescudo_backend {
    server trescudo-nginx:80;  # Container accessible via shared_network
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://trescudo_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Self-Hosted Runner Setup

1. Go to repository **Settings → Actions → Runners → New self-hosted runner**
2. Follow the setup instructions for your OS
3. Add the `production` label to the runner
4. Configure the runner as a service for automatic startup

### Monitoring Production

Check running containers:
```bash
docker ps --filter "label=com.docker.compose.project=trescudo"
```

View resource usage:
```bash
docker stats trescudo-nginx
```

Check nginx access logs:
```bash
docker exec trescudo-nginx tail -f /var/log/nginx/access.log
```

### Troubleshooting

**Container not accessible via shared_network:**
```bash
# Ensure network exists
docker network inspect shared_network

# Restart both proxy and trescudo containers
docker restart proxy-proxy-1 trescudo-nginx
```

**Deployment fails on health check:**
```bash
# Check container logs
docker compose -p trescudo -f docker-compose.prod.yml logs

# Manual rollback
make rolling-rollback-prod
```

**Need to restore from backup:**
```bash
# List available backups
ls -lah ~/trescudo-old-*

# Restore manually
mv ~/trescudo ~/trescudo-failed
mv ~/trescudo-old-TIMESTAMP ~/trescudo
cd ~/trescudo && make rolling-deploy-prod
```