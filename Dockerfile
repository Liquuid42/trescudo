# Stage 1: Build static site with Eleventy
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY src/package*.json ./

# Install dependencies
RUN npm ci --production=false

# Copy source files
COPY src/ ./

# Build the site with CSS optimization
RUN npm run build:prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install openssl for certificate generation
RUN apk add --no-cache openssl

# Remove default nginx configuration
RUN rm /etc/nginx/nginx.conf

# Copy custom nginx configuration
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/certs

# Copy built site from builder stage
# Note: Eleventy outputs to ../dist (parent of /build), which resolves to /dist
COPY --from=builder /dist /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
