# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trescudo is a static cybersecurity marketing website built with Eleventy (11ty) and deployed via Docker/Nginx. The site uses Nunjucks templating and is optimized for SEO and performance.

## Build System & Development

### Core Technologies
- **Static Site Generator**: Eleventy 2.x (11ty)
- **Templating**: Nunjucks (.njk files)
- **CSS**: Standard CSS with PurgeCSS for optimization
- **Deployment**: Docker + Nginx with rolling deployments

### Project Structure
```
src/                      # Source files (Eleventy input)
├── _layouts/base.njk     # Base HTML template
├── _includes/            # Reusable components (header, footer, etc.)
├── pages/                # Page templates (.njk files)
├── index.njk             # Homepage
├── assets/               # CSS, JS, images, fonts
└── .eleventy.js          # Eleventy configuration

dist/                     # Build output (Eleventy generates this)
conf/                     # Nginx configurations
scripts/                  # Build and deployment utilities
```

### Key Commands

**Development (with hot reload)**:
```bash
make dev                 # Starts Eleventy watch + Nginx in Docker
make dev-stop            # Stops development environment
make dev-rebuild         # Manually rebuild dist/ if needed
```

**Build**:
```bash
cd src && npm run build              # Basic Eleventy build → dist/
cd src && npm run build:css          # PurgeCSS + minify CSS
cd src && npm run build:fontawesome  # Subset Font Awesome icons
cd src && npm run build:images       # Optimize images with Sharp
cd src && npm run build:prod         # Full production build (all above)
```

**Docker/Nginx**:
```bash
make up                  # Start nginx serving dist/
make down                # Stop containers
make restart             # Restart nginx (e.g., after config changes)
make logs                # View container logs
```

**Production Deployment**:
```bash
make rolling-deploy-prod    # Zero-downtime rolling deployment
make rolling-health-prod    # Check deployment health
make rolling-status-prod    # View deployment status
make rolling-rollback-prod  # Rollback to previous version
```

### Development Workflow

1. **Making content changes**: Edit `.njk` files in `src/` or `src/pages/`
2. **Hot reload**: `make dev` watches for changes and auto-rebuilds
3. **Eleventy builds to**: `dist/` directory (served by Nginx)
4. **Nginx config changes**: Require `make restart` to apply

### Eleventy Architecture

**Template Hierarchy**:
- `_layouts/base.njk` - Base HTML structure with head/body/scripts
- `_includes/*.njk` - Reusable components (header, footer, analytics, etc.)
- `pages/*.njk` - Individual pages (output to `/pagename/index.html`)
- `index.njk` - Homepage (output to `/index.html`)

**Key Eleventy Features**:
- Pages in `src/pages/` are automatically flattened (e.g., `pages/about.njk` → `/about/index.html`)
- Custom shortcodes: `{% image %}` and `{% bgImage %}` for WebP/lazy loading
- Passthrough copy for assets (CSS, JS, images, fonts, PDFs)
- Output: `../dist` relative to `src/`

**Front Matter Variables**:
All `.njk` pages require front matter with:
- `layout`: Template to use (typically `base.njk`)
- `title`, `description`, `keywords`: SEO metadata
- `slug`: URL path for canonical links
- `ogImage`, `ogTitle`: Open Graph metadata

### CSS Optimization

**PurgeCSS Configuration** (`src/purgecss.config.js`):
- Scans `dist/**/*.html` for used classes
- Outputs optimized CSS to `assets/css/`
- Safelists dynamic classes (Swiper, ScrollCue, animations)
- Run via: `cd src && npm run build:css`

### Scripts and Utilities

**Build Scripts** (`src/scripts/`):
- `subset-fontawesome.js` - Extracts only used FA icons
- `optimize-images.js` - Converts images to WebP with Sharp
- `download-fonts.sh` - Downloads web fonts

**Deployment Scripts** (`scripts/`):
- `rolling-deploy.sh` - Zero-downtime production deployment
- `add-trailing-slashes.sh` - Utility for URL normalization
- `add-lazy-loading.sh` - Adds lazy loading to images
- `generate-certs.sh` - Generates self-signed SSL certs for dev

### Deployment Architecture

**Development**:
- Local Docker container with self-signed SSL
- Volume mounts `dist/` for immediate updates
- Accessible at `https://localhost`

**Production**:
- External Nginx proxy handles SSL (Let's Encrypt)
- Trescudo container runs on `shared_network` Docker network
- GitHub Actions auto-deploys on `main` branch push
- Rolling deployment scales containers up/down for zero downtime
- Keeps 2 previous deployments for instant rollback

**GitHub Actions Workflow** (`.github/workflows/production.yml`):
- Runs on self-hosted runner with `production` label
- Clones fresh repo, executes rolling deployment
- Verifies health checks, auto-rollback on failure

### Important Files

**Configuration**:
- `.eleventy.js` - Eleventy config (output dir, shortcodes, permalinks)
- `purgecss.config.js` - CSS purging rules
- `conf/nginx.conf` - Development nginx config
- `conf/nginx.prod.conf` - Production nginx config
- `docker-compose.yml` - Development compose
- `docker-compose.prod.yml` - Production compose

**Build**:
- `package.json` - Node scripts and dependencies
- `Dockerfile` - Nginx image definition
- `Makefile` - All build/deploy commands

### Common Tasks

**Adding a new page**:
1. Create `src/pages/pagename.njk` with front matter
2. Page automatically outputs to `/pagename/index.html`
3. Eleventy watch rebuilds automatically if `make dev` is running

**Updating navigation**:
- Edit `src/_includes/header.njk` for desktop nav
- Edit `src/_includes/mobile-menu.njk` for mobile nav

**Modifying footer**:
- Edit `src/_includes/footer.njk`

**CSS changes**:
- Edit files in `src/assets/css/`
- Run `cd src && npm run build:css` to purge/minify
- Nginx serves from `dist/assets/css/`

**Testing before deployment**:
```bash
cd src && npm run build:prod    # Full production build
make up                         # Test locally with Nginx
```

### Performance Optimizations

The site includes:
- Gzip compression (Nginx)
- Aggressive caching for static assets (1 year)
- WebP images with fallbacks
- Lazy loading for images
- PurgeCSS for minimal CSS bundle
- Font subsetting for Font Awesome
- HTTP/2 support

### Security Features

- TLS 1.2+ only
- Security headers (CSP, X-Frame-Options, etc.)
- Server tokens disabled
- Hidden files access denied (.git, .env)
- HTTPS enforcement (production via external proxy)
