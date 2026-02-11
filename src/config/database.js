##############################################################################
# Database Configuration
##############################################################################

import mongoose from 'mongoose'
import { createLogger } from '../utils/logger.js'

const logger = createLogger()

export const connectDatabase = async () => {
  try {
    const options = {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api-starter', options)

    logger.info('MongoDB connected successfully')

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected')
    })

  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`)

    if (process.env.NODE_ENV !== 'test') {
      process.exit(1)
    }
  }
}

export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close()
    logger.info('MongoDB connection closed')
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error.message}`)
  }
}
