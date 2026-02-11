##############################################################################
# Dockerfile
# Multi-stage build for production-ready Express API
##############################################################################

# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build stage (if needed for TypeScript)
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source files
COPY src ./src
COPY package*.json ./

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the application
CMD ["node", "src/index.js"]
