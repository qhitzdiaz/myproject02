#!/bin/bash

echo "Rebuilding frontend container..."
docker-compose up -d --build frontend

echo ""
echo "Checking container status..."
docker-compose ps frontend

echo ""
echo "Frontend rebuild complete!"
echo "Access the application at: http://localhost:4200"
