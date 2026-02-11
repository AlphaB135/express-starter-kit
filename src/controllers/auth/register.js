##############################################################################
# Register Controller
##############################################################################

import { User } from '../../models/User.js'
import { AppError } from '../../middleware/errorHandler.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    # Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError('User already exists with this email', 400)
    }

    # Create user
    const user = await User.create({
      name,
      email,
      password
    })

    # Generate token
    const token = user.getSignedJwtToken()

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    })
  } catch (error) {
    next(error)
  }
}
