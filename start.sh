#!/bin/bash

# Start All Services Script
echo "======================================"
echo "Starting All Services with Docker Compose"
echo "======================================"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed!"
    echo "Please install docker-compose first."
    exit 1
fi

# Create .env file for backend if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check service status
echo ""
echo "======================================"
echo "Service Status:"
echo "======================================"
docker-compose ps


echo ""
echo "======================================"
echo "Services are starting up!"
echo "======================================"
echo ""
echo "Frontend: http://localhost:4200"
echo ""
echo "Backend Services:"
echo "  Auth Service: http://localhost:3000"
echo "  Property Management Service: http://localhost:3001"
echo "  Supply Chain Service: http://localhost:3002"
echo "  Services Management (Serbisyo24x7): http://localhost:3003"
echo ""
echo "Databases (PostgreSQL):"
echo "  Auth DB: localhost:5432 (logindb)"
echo "  Property DB: localhost:5433 (propertydb)"
echo "  Supply Chain DB: localhost:5434 (supplychaindb)"
echo "  Services DB: localhost:5435 (servicesdb)"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
