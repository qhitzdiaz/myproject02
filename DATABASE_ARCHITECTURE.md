# Separated Database Architecture

This project uses a microservices architecture with separate PostgreSQL databases for each service.

## Database Separation

### Services Overview

| Service | Port | Database | DB Port | Purpose |
|---------|------|----------|---------|---------|
| Auth Service | 3000 | logindb | 5432 | User authentication & JWT tokens |
| Property Management | 3001 | propertydb | 5433 | Property, tenant, and maintenance management |
| Supply Chain | 3002 | supplychaindb | 5434 | Supplier and product management |
| Services Management (Serbisyo24x7) | 3003 | servicesdb | 5435 | Service marketplace, bookings, and providers |

### Database Details

#### Auth Database (logindb)
- **Port**: 5432
- **Container**: postgres
- **Tables**: users, sessions

#### Property Database (propertydb)
- **Port**: 5433
- **Container**: property-postgres
- **Tables**: properties, tenants, maintenance_requests, payments
- **Init Script**: `property-service/config/init-db.sql`

#### Supply Chain Database (supplychaindb)
- **Port**: 5434
- **Container**: supply-chain-postgres
- **Tables**: suppliers, products, inventory, orders
- **Init Script**: `supply-chain-service/config/init-db.sql`

#### Services Management Database (servicesdb)
- **Port**: 5435
- **Container**: services-management-postgres
- **Tables**: categories, providers, services, bookings, notifications
- **Init Script**: `services-management-service/config/init-db.sql`

## Running Services

### Using Docker Compose (Recommended)
```bash
./start.sh
```

This will start:
- PostgreSQL databases (4 instances)
- Auth Service
- Property Management Service
- Supply Chain Service
- Services Management Service
- Frontend Angular application

### Stopping Services
```bash
./stop.sh
```

## Service Communication

- **Frontend** → All services via REST API on separate ports
- **Services** → Do not communicate with each other (independent databases)
- **Authentication**: All services validate JWT tokens from Auth Service

## Environment Variables

Each service has its own `.env` file with database credentials:

- `backend/.env` - Auth Service
- `property-service/.env` - Property Service
- `supply-chain-service/.env` - Supply Chain Service
- `services-management-service/.env` - Services Management Service

## Scaling & Independence

Since each service has its own database:
- Services can be scaled independently
- Database failures are isolated to specific services
- Each service can be upgraded or redeployed without affecting others
- Data models can evolve independently

## Connecting to Databases

### From Local Machine
```bash
# Auth DB
psql -h localhost -p 5432 -U postgres -d logindb

# Property DB
psql -h localhost -p 5433 -U postgres -d propertydb

# Supply Chain DB
psql -h localhost -p 5434 -U postgres -d supplychaindb

# Services DB
psql -h localhost -p 5435 -U postgres -d servicesdb
```

### From Docker Container
```bash
docker exec -it property-postgres psql -U postgres -d propertydb
```

## Database Credentials

All databases use the same credentials for simplicity:
- **User**: postgres
- **Password**: postgres

In production, these should be unique and securely managed via environment variables and secrets management tools.
