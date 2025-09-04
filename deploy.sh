#!/bin/bash

# PKT Monthly Record - Docker Deployment Script
# This script helps you deploy the application on your server

set -e

echo "🚀 PKT Monthly Record - Docker Deployment"
echo "=========================================="

# Check if Docker and Docker Compose are installed
# if ! command -v docker &> /dev/null; then
#     echo "❌ Docker is not installed. Please install Docker first."
#     exit 1
# fi

# if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
#     echo "❌ Docker Compose is not installed or not available. Please install Docker with Compose plugin."
#     echo "   You can install it from: https://docs.docker.com/compose/install/"
#     exit 1
# fi

# Function to generate random password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production file..."
    
    # Generate secure passwords
    DB_PASSWORD=$(generate_password)
    NEXTAUTH_SECRET=$(generate_password)$(generate_password)
    
    cat > .env.production << EOF
# Database Configuration
DATABASE_URL="postgresql://pkt_user:${DB_PASSWORD}@postgres:5432/monthly_records"

# NextAuth Configuration  
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="http://localhost:5000"

# Node Environment
NODE_ENV="production"

# Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1
EOF

    # Update docker-compose.yml with the same password
    sed -i "s/pkt_secure_password_2024/${DB_PASSWORD}/g" docker-compose.yml

    echo "✅ Generated .env.production with secure passwords"
    echo "⚠️  IMPORTANT: Update NEXTAUTH_URL in .env.production with your domain!"
else
    echo "✅ .env.production already exists"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ssl

# Check if we should run in production mode with Nginx
read -p "🤔 Do you want to run with Nginx reverse proxy? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    COMPOSE_PROFILES="production"
    echo "🌐 Will start with Nginx reverse proxy"
    echo "⚠️  Make sure to configure SSL certificates in ./ssl/ directory"
else
    COMPOSE_PROFILES=""
    echo "🔧 Will start in development mode (no Nginx)"
fi

# Build and start the application
echo "🔨 Building Docker images..."
docker compose build

echo "🗄️  Starting PostgreSQL and running database migrations..."
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 15

# Check if postgres is ready and credentials work
echo "🔍 Testing database connection..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker compose exec postgres pg_isready -U pkt_user -d monthly_records; then
        echo "✅ PostgreSQL is ready!"
        break
    else
        echo "⏳ Attempt $attempt/$max_attempts - PostgreSQL not ready yet..."
        sleep 5
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ PostgreSQL failed to start properly. Trying to reset..."
    echo "🔄 Stopping containers and cleaning volumes..."
    docker compose down -v
    echo "🚀 Starting PostgreSQL again..."
    docker compose up -d postgres
    sleep 20
fi

# Run database migrations
echo "🔄 Running Prisma migrations..."
docker compose run --rm app npx prisma migrate deploy

echo "🌱 Seeding database (if needed)..."
docker compose run --rm app npx prisma db seed || echo "No seed script found, skipping..."

# Start all services
echo "🚀 Starting all services..."
if [[ -n "$COMPOSE_PROFILES" ]]; then
    docker compose --profile $COMPOSE_PROFILES up -d
else
    docker compose up -d
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Service Status:"
docker compose ps

echo ""
echo "🌐 Your application is now running:"
if [[ $COMPOSE_PROFILES == *"production"* ]]; then
    echo "   - Main app: http://localhost (via Nginx)"
    echo "   - Direct app: http://localhost:5000"
else
    echo "   - Main app: http://localhost:5000"
fi
echo "   - Database: postgresql://localhost:5432"
echo ""
echo "📊 To view logs:"
echo "   docker compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker compose down"
echo ""
echo "🔄 To restart the application:"
echo "   docker compose restart"
echo ""
echo "🗑️  To completely remove (including data):"
echo "   docker compose down -v"

# Show login credentials
echo ""
echo "🔐 Login Credentials:"
echo "   Username: pkt"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "   1. Change NEXTAUTH_URL in .env.production to your domain"
echo "   2. Set up SSL certificates for production"
echo "   3. Consider changing default login credentials"
echo "   4. Review and customize nginx.conf for your domain"
echo ""
