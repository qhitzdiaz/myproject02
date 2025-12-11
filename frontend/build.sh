#!/bin/bash

# Frontend Build and Run Script
echo "======================================"
echo "Building Frontend Application"
echo "======================================"

# Navigate to frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build Docker image
echo "Building Docker image..."
docker build -t login-frontend:latest .

echo "======================================"
echo "Frontend build completed!"
echo "======================================"
echo ""
echo "To run the frontend:"
echo "  docker run -p 80:80 login-frontend:latest"
echo ""
echo "Or use docker-compose from the root directory"
