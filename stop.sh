#!/bin/bash

# Stop All Services Script
echo "======================================"
echo "Stopping All Services"
echo "======================================"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Stop services
echo "Stopping services..."
docker-compose down

echo ""
echo "======================================"
echo "All services stopped!"
echo "======================================"
echo ""
echo "To remove volumes as well:"
echo "  docker-compose down -v"
