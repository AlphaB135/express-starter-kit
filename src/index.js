##############################################################################
# Express API Starter Kit
# Author: αB (https://github.com/AlphaB135)
# Version: 1.0.0
# A production-ready REST API template with authentication, validation, and best practices
##############################################################################

import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import { createLogger } from './utils/logger.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { connectDatabase } from './config/database.js'
import { authRoutes } from './routes/auth.routes.js'
import { userRoutes } from './routes/user.routes.js'
import { healthRoutes } from './routes/health.routes.js'

##############################################################################
# CONFIGURATION
##############################################################################

dotenv.config()

const app = express()
const logger = createLogger()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

##############################################################################
# DATABASE CONNECTION
##############################################################################

await connectDatabase()

##############################################################################
# MIDDLEWARE
##############################################################################

# Security headers
app.use(helmet())

# CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))

# Compression
app.use(compression())

# Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

# Request logging
if (NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }))
}

# Rate limiting
app.use('/api', rateLimiter)

##############################################################################
# ROUTES
##############################################################################

app.get('/', (req, res) => {
  res.json({
    name: 'Express API Starter Kit',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  })
})

# Health check
app.use('/health', healthRoutes)

# API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

##############################################################################
# ERROR HANDLING
##############################################################################

app.use(notFoundHandler)
app.use(errorHandler)

##############################################################################
# SERVER START
##############################################################################

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`)
    logger.info(`Environment: ${NODE_ENV}`)
    logger.info(`API Base URL: http://localhost:${PORT}`)
  })
}

export default app
