#!/bin/bash

# PKT Monthly Record - Production Server Configuration
# Use this to configure your server IP

set -e

echo "🌐 PKT Monthly Record - Production Server Setup"
echo "=============================================="

# Get current IP from user or use default
read -p "Enter your server IP address (default: 159.65.8.211): " SERVER_IP
SERVER_IP=${SERVER_IP:-159.65.8.211}

echo "📝 Updating configuration for server IP: $SERVER_IP"

# Update .env.production
sed -i "s|NEXTAUTH_URL=\"http://[^:]*:5000\"|NEXTAUTH_URL=\"http://${SERVER_IP}:5000\"|g" .env.production

# Update docker-compose.yml
sed -i "s|NEXTAUTH_URL: \"http://[^:]*:5000\"|NEXTAUTH_URL: \"http://${SERVER_IP}:5000\"|g" docker-compose.yml

# Update deploy.sh
sed -i "s|NEXTAUTH_URL=\"http://[^:]*:5000\"|NEXTAUTH_URL=\"http://${SERVER_IP}:5000\"|g" deploy.sh

# Update nginx.conf
sed -i "s|server_name [0-9.]*|server_name ${SERVER_IP}|g" nginx.conf

echo "✅ Configuration updated for server IP: $SERVER_IP"
echo ""
echo "🚀 Your application URLs will be:"
echo "   - Main app: http://${SERVER_IP}:5000"
echo "   - With Nginx: http://${SERVER_IP}:8080"
echo ""
echo "💡 Next steps:"
echo "   1. Run: ./deploy.sh"
echo "   2. Access your app at: http://${SERVER_IP}:5000"
echo ""
