# Login Application

Full-stack login application with Angular PWA frontend, Node.js backend, and PostgreSQL database.

## Features

- 🔐 User authentication (Login/Register)
- 📱 Progressive Web App (PWA) support
- 🔒 JWT-based authentication
- 🐘 PostgreSQL database
- 🐳 Docker containerization
- 🚀 Production-ready setup

## Project Structure

```
myproject02/
├── backend/                 # Node.js Express API
│   ├── config/             # Database and configuration files
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes
│   ├── server.js           # Express server
│   ├── Dockerfile          # Production Dockerfile
│   └── build.sh            # Build script
├── frontend/               # Angular PWA application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Angular components
│   │   │   ├── guards/     # Route guards
│   │   │   ├── interceptors/ # HTTP interceptors
│   │   │   └── services/   # Angular services
│   │   └── environments/   # Environment configurations
│   ├── Dockerfile          # Production Dockerfile
│   ├── nginx.conf          # Nginx configuration
│   └── build.sh            # Build script
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile.postgres     # PostgreSQL Dockerfile
├── build-all.sh            # Build all services
├── start.sh                # Start all services
└── stop.sh                 # Stop all services
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start

### Using Docker Compose

1. **Make scripts executable**
   ```bash
   chmod +x *.sh backend/*.sh frontend/*.sh
   ```

2. **Build all services**
   ```bash
   ./build-all.sh
   ```

3. **Start all services**
   ```bash
   ./start.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

5. **Stop all services**
   ```bash
   ./stop.sh
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/profile` - Get user profile (requires authentication)

### Health Check

- `GET /health` - API health status

## Environment Variables

### Backend (.env)

```env
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=logindb
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### Frontend

Development: `src/environments/environment.ts`
```typescript
apiUrl: 'http://localhost:3000/api'
```

Production: `src/environments/environment.prod.ts`
```typescript
apiUrl: 'http://backend:3000/api'
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only security headers with Helmet
- CORS configuration
- Input validation with express-validator
- Route guards for protected routes

## PWA Features

- Offline capability
- Service Worker for caching
- Web App Manifest
- Install prompt
- App-like experience

## Scripts

### Root Directory

- `build-all.sh` - Build all Docker images
- `start.sh` - Start all services with Docker Compose
- `stop.sh` - Stop all services

### Backend

- `build.sh` - Build backend Docker image
- `dev.sh` - Start backend in development mode

### Backend

- `build.sh` - Build backend Docker image

### Frontend

- `build.sh` - Build frontend Docker image
docker-compose logs -f
```

**View specific service logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Rebuild services:**
```bash
docker-compose build
```

**Stop and remove volumes:**
```bash
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues

If the backend can't connect to PostgreSQL:
1. Check if PostgreSQL container is running: `docker-compose ps`
2. Check PostgreSQL logs: `docker-compose logs postgres`
3. Verify environment variables in backend

### Frontend Can't Connect to Backend

1. Check backend is running: `curl http://localhost:3000/health`
2. Verify CORS configuration in backend
3. Check frontend environment configuration

### Port Already in Use

If ports are already in use:
```bash
# Find process using port
lsof -i :3000  # Backend
lsof -i :4200  # Frontend
lsof -i :5432  # PostgreSQL

# Kill process
kill -9 <PID>
```

## Production Deployment

1. Update environment variables for production
2. Change JWT_SECRET to a strong random key
3. Update database credentials
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Use environment-specific docker-compose files

## License

MIT