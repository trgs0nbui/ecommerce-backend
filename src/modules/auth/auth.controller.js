const authService = require('./auth.service')
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} = require('./auth.validation')

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const result = await authService.register(req.body)

    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

/* ================= VERIFY EMAIL ================= */

exports.verifyEmail = async (req, res) => {
  try {
    const { error } = verifyEmailSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const { email, otp } = req.body

    const result = await authService.verifyEmail(email, otp)

    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const result = await authService.login(
      req.body.email,
      req.body.password
    )

    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

/* ================= FORGOT PASSWORD ================= */

exports.forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const result = await authService.forgotPassword(req.body.email)

    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

/* ================= RESET PASSWORD ================= */

exports.resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const { email, otp, newPassword } = req.body

    const result = await authService.resetPassword(
      email,
      otp,
      newPassword
    )

    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

/* ================= CHANGE PASSWORD ================= */

exports.changePassword = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const result = await authService.changePassword(
      req.user.id,
      req.body.oldPassword,
      req.body.newPassword
    )

    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}