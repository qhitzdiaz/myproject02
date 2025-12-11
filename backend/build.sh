#!/bin/bash

# Backend Build and Run Script
echo "======================================"
echo "Building Backend Application"
echo "======================================"

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please update the .env file with your configuration!"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build Docker image
echo "Building Docker image..."
docker build -t login-backend:latest .

echo "======================================"
echo "Backend build completed!"
echo "======================================"
echo ""
echo "To run the backend:"
echo "  docker run -p 3000:3000 --env-file .env login-backend:latest"
echo ""
echo "Or use docker-compose from the root directory"
