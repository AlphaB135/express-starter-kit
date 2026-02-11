##############################################################################
# Authentication Middleware
##############################################################################

import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler.js'
import { User } from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    throw new AppError('Not authorized to access this route', 401)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      throw new AppError('User no longer exists', 401)
    }

    next()
  } catch (error) {
    throw new AppError('Not authorized to access this route', 401)
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      )
    }
    next()
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    }

    next()
  } catch (error) {
    next()
  }
}
