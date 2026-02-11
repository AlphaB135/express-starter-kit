##############################################################################
# User Controllers
##############################################################################

import { User } from '../../models/User.js'
import { AppError } from '../../middleware/errorHandler.js'

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments()

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id || req.user.id).select('-password')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body

    const user = await User.findById(req.user.id)

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new AppError('Email already in use', 400)
      }
      user.email = email
      user.emailVerified = false
    }

    if (name) user.name = name
    if (avatar) user.avatar = avatar

    await user.save()

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    await user.deleteOne()

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401)
    }

    user.password = newPassword
    await user.save()

    const token = user.getSignedJwtToken()

    res.json({
      success: true,
      message: 'Password updated successfully',
      data: { token }
    })
  } catch (error) {
    next(error)
  }
}
