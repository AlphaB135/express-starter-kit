##############################################################################
# Login Controller
##############################################################################

import { User } from '../../models/User.js'
import { AppError } from '../../middleware/errorHandler.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    # Check if email and password are provided
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400)
    }

    # Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    # Check if user is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 401)
    }

    # Compare password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      throw new AppError('Invalid credentials', 401)
    }

    # Update last login
    user.lastLogin = new Date()
    await user.save()

    # Generate token
    const token = user.getSignedJwtToken()

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    })
  } catch (error) {
    next(error)
  }
}
