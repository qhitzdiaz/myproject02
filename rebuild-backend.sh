#!/bin/bash

echo "======================================"
echo "Rebuilding Backend Services"
echo "======================================"
echo ""

# Rebuild Auth Service
echo "Building Auth Service..."
docker-compose up -d --build backend

echo ""
echo "Building Property Management Service..."
docker-compose up -d --build property-service

echo ""
echo "Building Supply Chain Service..."
docker-compose up -d --build supply-chain-service

echo ""
echo "Building Services Management (Serbisyo24x7)..."
docker-compose up -d --build services-management-service

echo ""
echo "======================================"
echo "Checking Container Status..."
echo "======================================"
docker-compose ps | grep -E "backend|property-service|supply-chain-service|services-management-service"

echo ""
echo "======================================"
echo "Backend Services Rebuilt!"
echo "======================================"
echo ""
echo "Service Endpoints:"
echo "  Auth Service: http://localhost:3000"
echo "  Property Management: http://localhost:3001"
echo "  Supply Chain: http://localhost:3002"
echo "  Services Management: http://localhost:3003"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f backend"
echo "  docker-compose logs -f property-service"
echo "  docker-compose logs -f supply-chain-service"
echo "  docker-compose logs -f services-management-service"
echo ""