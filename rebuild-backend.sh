#!/bin/bash

echo "Rebuilding backend container..."
docker-compose up -d --build backend

echo ""
echo "Checking container status..."
docker-compose ps backend

echo ""
echo "Backend rebuild complete!"
echo "API available at: http://localhost:3000"
