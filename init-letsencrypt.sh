#!/bin/bash

# =============================================================================
# Let's Encrypt SSL Certificate Init Script
# Run this ONCE on first deploy: sudo bash init-letsencrypt.sh
# =============================================================================

set -e

# ---- CONFIGURE THESE ----
DOMAIN="your-domain.com"        # <-- Replace with your domain
EMAIL="your-email@example.com"  # <-- Replace with your email (for cert expiry notices)
STAGING=0                       # Set to 1 for testing (avoids Let's Encrypt rate limits)
# --------------------------

CERT_NAME="app"
DATA_PATH="./certbot"
COMPOSE="docker compose"

echo "### Checking for existing certificates..."
if [ -d "$DATA_PATH/conf/live/$CERT_NAME" ]; then
  read -p "Existing certificates found. Replace them? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

echo "### Creating dummy certificate for $DOMAIN..."
mkdir -p "$DATA_PATH/conf/live/$CERT_NAME"
$COMPOSE run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$CERT_NAME/privkey.pem \
    -out /etc/letsencrypt/live/$CERT_NAME/fullchain.pem \
    -subj '/CN=localhost'" certbot

echo "### Starting nginx with dummy certificate..."
$COMPOSE up -d frontend

echo "### Removing dummy certificate..."
$COMPOSE run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$CERT_NAME && \
  rm -rf /etc/letsencrypt/archive/$CERT_NAME && \
  rm -rf /etc/letsencrypt/renewal/$CERT_NAME.conf" certbot

echo "### Requesting real certificate from Let's Encrypt..."

# Use staging server if STAGING=1
if [ $STAGING != "0" ]; then
  STAGING_ARG="--staging"
else
  STAGING_ARG=""
fi

$COMPOSE run --rm --entrypoint "\
  certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --cert-name $CERT_NAME \
    $STAGING_ARG \
    --email $EMAIL \
    --domain $DOMAIN \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

echo "### Reloading nginx with real certificate..."
$COMPOSE exec frontend nginx -s reload

echo ""
echo "=== SSL setup complete! ==="
echo "Your site is now available at https://$DOMAIN"
echo ""
echo "Certificates will auto-renew via the certbot container."
echo "To start the full stack: $COMPOSE up -d"
