##############################################################################
# Authentication Routes
##############################################################################

import express from 'express'
import { register } from '../controllers/auth/register.js'
import { login } from '../controllers/auth/login.js'
import { logout } from '../controllers/auth/logout.js'
import { getMe } from '../controllers/auth/getMe.js'
import { forgotPassword } from '../controllers/auth/forgotPassword.js'
import { resetPassword } from '../controllers/auth/resetPassword.js'
import { protect } from '../middleware/auth.js'
import { authRateLimiter } from '../middleware/rateLimiter.js'
import { validateRegistration, validateLogin } from '../validators/auth.validator.js'

const router = express.Router()

# Public routes
router.post('/register', authRateLimiter, validateRegistration, register)
router.post('/login', authRateLimiter, validateLogin, login)
router.post('/forgot-password', authRateLimiter, forgotPassword)
router.post('/reset-password/:token', resetPassword)

# Protected routes
router.get('/me', protect, getMe)
router.post('/logout', protect, logout)

export { router as authRoutes }
