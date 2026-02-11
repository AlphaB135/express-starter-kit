##############################################################################
# Health Check Routes
##############################################################################

import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

router.get('/db', async (req, res, next) => {
  try {
    # Check database connection (assuming mongoose)
    const mongoose = await import('mongoose')
    const state = mongoose.connection.readyState

    const status = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    res.json({
      success: true,
      database: status[state] || 'unknown',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      database: 'error',
      message: error.message
    })
  }
})

export { router as healthRoutes }
