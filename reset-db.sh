#!/bin/bash

# PKT Monthly Record - Database Reset Script
# Use this when you have authentication issues

set -e

echo "🗑️  Cleaning up existing containers and volumes..."

# Stop all services
docker compose down

# Remove the postgres volume (this will delete all existing data!)
echo "⚠️  WARNING: This will delete all existing database data!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted."
    exit 1
fi

# Remove volumes
docker compose down -v

echo "🔄 Starting fresh deployment..."

# Start PostgreSQL first
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to initialize..."
sleep 15

# Check if postgres is ready
until docker compose exec postgres pg_isready -U pkt_user; do
    echo "⏳ Still waiting for PostgreSQL..."
    sleep 5
done

echo "✅ PostgreSQL is ready!"

# Run migrations
echo "🔄 Running Prisma migrations..."
docker compose run --rm app npx prisma migrate deploy

# Start the app
echo "🚀 Starting the application..."
docker compose up -d app

echo ""
echo "✅ Database reset completed successfully!"
echo "🌐 Your application is now running on: http://localhost:5000"
echo ""
echo "📋 Service Status:"
docker compose ps
