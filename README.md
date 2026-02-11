# Express API Starter Kit

A production-ready REST API template built with Express.js, featuring authentication, validation, error handling, and best practices.

## Features

- **Authentication** - JWT-based auth with register, login, logout
- **Authorization** - Role-based access control (user, admin, moderator)
- **Validation** - Request validation with Joi
- **Error Handling** - Centralized error handling with detailed responses
- **Security** - Helmet.js, CORS, rate limiting, password hashing
- **Database** - MongoDB with Mongoose ODM
- **Logging** - Winston logger with file and console transports
- **Docker** - Multi-stage Dockerfile for production deployment
- **Testing** - Jest configuration ready (add your tests)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 5+

### Installation

```bash
# Clone the repository
git clone https://github.com/AlphaB135/express-starter-kit.git
cd express-starter-kit

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/api-starter

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| GET | `/api/users/me` | Get current user | User |
| PATCH | `/api/users/me` | Update profile | User |
| PATCH | `/api/users/me/password` | Update password | User |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/health/db` | Database status |

## Usage Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123@"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123@"
  }'
```

### Protected Request

```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Docker Deployment

### Build and Run

```bash
# Build image
docker build -t express-api .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/api-starter \
  -e JWT_SECRET=your-secret \
  express-api
```

### Docker Compose

```bash
docker-compose up -d
```

## Project Structure

```
express-starter-kit/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── auth/                # Auth controllers
│   │   └── user/                # User controllers
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js       # Error handling
│   │   ├── notFoundHandler.js    # 404 handler
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/
│   │   └── User.js              # User model
│   ├── routes/
│   │   ├── auth.routes.js       # Auth routes
│   │   ├── user.routes.js       # User routes
│   │   └── health.routes.js     # Health check routes
│   ├── utils/
│   │   └── logger.js            # Winston logger
│   ├── validators/
│   │   └── auth.validator.js   # Request validators
│   └── index.js                 # App entry point
├── logs/                         # Log files
├── .env.example                  # Environment template
├── Dockerfile                    # Docker config
└── package.json                  # Dependencies
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - DDoS protection
- **Password Hashing** - bcrypt with salt rounds
- **JWT** - Secure token-based authentication
- **Input Validation** - Joi schema validation
- **SQL Injection Protection** - Mongoose sanitization

## License

MIT

## Author

αB - [GitHub](https://github.com/AlphaB135)

## Support

For issues and questions, please open a GitHub issue.
