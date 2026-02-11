##############################################################################
# Logout Controller
##############################################################################

export const logout = async (req, res, next) => {
  try {
    # In a stateless JWT setup, logout is handled client-side
    # by removing the token. If using refresh tokens or
    # token blacklisting, implement that logic here.

    res.json({
      success: true,
      message: 'Logout successful. Please remove the token from client storage.'
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      throw new AppError('No user found with that email', 404)
    }

    # Generate reset token (implement your own token generation)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000 # 10 minutes

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = resetTokenExpiry
    await user.save()

    # Send email (implement email service)
    # await sendEmail({
    #   to: user.email,
    #   subject: 'Password Reset Request',
    #   text: `Your password reset token: ${resetToken}`
    # })

    res.json({
      success: true,
      message: 'Password reset email sent (check console for token in dev)',
      data: { resetToken } # Remove in production
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body
    const { token } = req.params

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400)
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    const newToken = user.getSignedJwtToken()

    res.json({
      success: true,
      message: 'Password reset successful',
      data: { token: newToken }
    })
  } catch (error) {
    next(error)
  }
}
