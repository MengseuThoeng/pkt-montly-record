# PKT Monthly Record - Production Deployment Guide

## 🚀 Quick Deployment

1. **Make the deployment script executable:**
   ```bash
   chmod +x deploy.sh
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

3. **Access your application:**
   - Main app: http://localhost:3000
   - With Nginx: http://localhost

## 📋 Manual Deployment Steps

### 1. Prerequisites
- Docker and Docker Compose installed on your server
- At least 2GB RAM and 10GB storage

### 2. Environment Setup
```bash
# Copy the production environment file
cp .env.production .env

# Edit the environment variables
nano .env.production
```

**Important variables to update:**
- `NEXTAUTH_URL`: Change to your actual domain
- `NEXTAUTH_SECRET`: Use a secure random string
- Database password in `DATABASE_URL`

### 3. Build and Deploy
```bash
# Build the application
docker compose build

# Start the database
docker compose up -d postgres

# Wait for database to be ready (about 10 seconds)
sleep 10

# Run database migrations
docker compose run --rm app npx prisma migrate deploy

# Start all services
docker compose up -d
```

## 🌐 Production with Nginx & SSL

### 1. Enable Nginx
```bash
# Start with Nginx reverse proxy
docker compose --profile production up -d
```

### 2. SSL Certificate Setup
```bash
# Create SSL directory
mkdir -p ssl

# Copy your SSL certificates
cp your-certificate.pem ssl/fullchain.pem
cp your-private-key.pem ssl/privkey.pem

# Update nginx.conf with your domain
nano nginx.conf
```

### 3. Domain Configuration
Update `nginx.conf`:
- Replace `your-domain.com` with your actual domain
- Uncomment SSL configuration block
- Update `NEXTAUTH_URL` in `.env.production`

## 🔧 Management Commands

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
```

### Database Management
```bash
# Access database
docker compose exec postgres psql -U pkt_user -d monthly_records

# Backup database
docker compose exec postgres pg_dump -U pkt_user monthly_records > backup.sql

# Restore database
docker compose exec -T postgres psql -U pkt_user monthly_records < backup.sql
```

### Application Management
```bash
# Restart application
docker compose restart app

# Update application
git pull
docker compose build app
docker compose up -d app

# Reset database (⚠️ This will delete all data!)
docker compose run --rm app npx prisma migrate reset --force
```

## 🔐 Security Checklist

- [ ] Change `NEXTAUTH_SECRET` to a random string
- [ ] Update `NEXTAUTH_URL` to your domain
- [ ] Set up SSL certificates
- [ ] Change default login credentials (pkt/admin123)
- [ ] Configure firewall to only allow necessary ports
- [ ] Regular database backups
- [ ] Keep Docker images updated

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Resource Usage
```bash
docker stats
```

### System Status
```bash
docker compose ps
```

## 🛠️ Troubleshooting

### Application won't start
```bash
# Check logs
docker compose logs app

# Common fixes
docker compose restart app
docker compose down && docker compose up -d
```

### Database connection issues
```bash
# Check database logs
docker compose logs postgres

# Test connection
docker compose exec postgres pg_isready -U pkt_user
```

### Performance issues
```bash
# Check resource usage
docker stats

# Scale if needed (multiple app instances)
docker compose up -d --scale app=2
```

## 🔄 Updates

### Application Updates
```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose build app
docker compose up -d app
```

### Database Migrations
```bash
# Run new migrations
docker compose run --rm app npx prisma migrate deploy
```

## 📱 Default Login

- **Username:** pkt
- **Password:** admin123

**⚠️ Important:** Change these credentials after first login by modifying the authentication system.

## 🆘 Support

If you encounter issues:
1. Check the logs: `docker compose logs -f`
2. Verify environment variables in `.env.production`
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Nginx       │────│   Next.js App    │────│   PostgreSQL    │
│  (Port 80/443)  │    │   (Port 3000)    │    │   (Port 5432)   │
│  Load Balancer  │    │   Application    │    │    Database     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

The application is containerized with:
- **Next.js app**: Handles frontend and API
- **PostgreSQL**: Stores all record data
- **Nginx**: Reverse proxy with SSL termination (optional)
- **Docker volumes**: Persistent database storage
