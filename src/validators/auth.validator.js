##############################################################################
# Authentication Validators
##############################################################################

import Joi from 'joi'
import { AppError } from '../middleware/errorHandler.js'

export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    ).messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
    }).required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  next()
}

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  next()
}

export const validateEmail = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  next()
}

export const validateResetPassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(8).pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    ).required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  next()
}

export const validateUpdatePassword = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    ).required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  next()
}
