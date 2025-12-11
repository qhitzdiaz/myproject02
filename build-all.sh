#!/bin/bash

# Complete Build Script for All Services
echo "======================================"
echo "Building All Services"
echo "======================================"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Build backend
echo ""
echo "Building Backend..."
cd "$SCRIPT_DIR/backend"
chmod +x build.sh
./build.sh

# Build frontend
echo ""
echo "Building Frontend..."
cd "$SCRIPT_DIR/frontend"
chmod +x build.sh
./build.sh

# Build database
echo ""
echo "Building Database..."
cd "$SCRIPT_DIR"
docker build -f Dockerfile.postgres -t login-postgres:latest .

echo ""
echo "======================================"
echo "All services built successfully!"
echo "======================================"
echo ""
echo "To start all services:"
echo "  ./start.sh"
echo ""
echo "Or use docker-compose:"
echo "  docker-compose up -d"
