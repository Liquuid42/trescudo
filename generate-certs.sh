#!/bin/bash

# Generate self-signed SSL certificates for local development
# For production, use Let's Encrypt or your certificate authority

CERTS_DIR="./certs"
DOMAIN="localhost"

echo "Generating self-signed SSL certificates for development..."

# Create certs directory if it doesn't exist
mkdir -p "$CERTS_DIR"

# Generate private key and certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERTS_DIR/key.pem" \
    -out "$CERTS_DIR/cert.pem" \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Development/CN=$DOMAIN" \
    2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ SSL certificates generated successfully in $CERTS_DIR/"
    echo "  - Certificate: $CERTS_DIR/cert.pem"
    echo "  - Private Key: $CERTS_DIR/key.pem"
    echo ""
    echo "Note: These are self-signed certificates for development only."
    echo "For production, use Let's Encrypt or a trusted certificate authority."
else
    echo "✗ Failed to generate SSL certificates"
    exit 1
fi
