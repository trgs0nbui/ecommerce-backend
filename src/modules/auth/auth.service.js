const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../../database/connection')
const { generateOTP } = require('../../common/utils/otp.util')
const { sendOTPEmail } = require('../../common/utils/email.util')

class AuthService {

  /* ================= REGISTER ================= */

  async register(data) {
    const { email, password } = data

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )

    if (existing.length > 0) {
      throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    )

    const otp = generateOTP()
    const otpHash = await bcrypt.hash(otp, 10)

    const expireTime = new Date(Date.now() + 5 * 60 * 1000)

    await pool.query(
      `INSERT INTO email_otps (email, otp_hash, type, expires_at)
       VALUES (?, ?, 'VERIFY', ?)`,
      [email, otpHash, expireTime]
    )

    await sendOTPEmail(email, otp)

    return { message: "Register successful. Please verify email." }
  }

  /* ================= VERIFY EMAIL ================= */

  async verifyEmail(email, otp) {

    const [rows] = await pool.query(
      `SELECT * FROM email_otps
       WHERE email = ?
       AND type = 'VERIFY'
       AND is_used = FALSE
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    )

    if (rows.length === 0) {
      throw new Error("OTP not found")
    }

    const record = rows[0]

    if (new Date() > new Date(record.expires_at)) {
      throw new Error("OTP expired")
    }

    const isMatch = await bcrypt.compare(otp, record.otp_hash)
    if (!isMatch) {
      throw new Error("Invalid OTP")
    }

    await pool.query(
      "UPDATE email_otps SET is_used = TRUE WHERE id = ?",
      [record.id]
    )

    await pool.query(
      "UPDATE users SET is_verified = TRUE WHERE email = ?",
      [email]
    )

    return { message: "Email verified successfully" }
  }

  /* ================= LOGIN ================= */

  async login(email, password) {

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      throw new Error("User not found")
    }

    const user = rows[0]

    if (!user.is_verified) {
      throw new Error("Email not verified")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error("Wrong password")
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    return { token }
  }

  /* ================= FORGOT PASSWORD ================= */

  async forgotPassword(email) {

    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      throw new Error("Email not found")
    }

    const otp = generateOTP()
    const otpHash = await bcrypt.hash(otp, 10)
    const expireTime = new Date(Date.now() + 5 * 60 * 1000)

    await pool.query(
      `INSERT INTO email_otps (email, otp_hash, type, expires_at)
       VALUES (?, ?, 'RESET_PASSWORD', ?)`,
      [email, otpHash, expireTime]
    )

    await sendOTPEmail(email, otp)

    return { message: "OTP sent to email" }
  }

  /* ================= RESET PASSWORD ================= */

  async resetPassword(email, otp, newPassword) {

    const [rows] = await pool.query(
      `SELECT * FROM email_otps
       WHERE email = ?
       AND type = 'RESET_PASSWORD'
       AND is_used = FALSE
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    )

    if (rows.length === 0) {
      throw new Error("OTP not found")
    }

    const record = rows[0]

    if (new Date() > new Date(record.expires_at)) {
      throw new Error("OTP expired")
    }

    const isMatch = await bcrypt.compare(otp, record.otp_hash)
    if (!isMatch) {
      throw new Error("Invalid OTP")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await pool.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    )

    await pool.query(
      "UPDATE email_otps SET is_used = TRUE WHERE id = ?",
      [record.id]
    )

    return { message: "Password reset successfully" }
  }

  /* ================= CHANGE PASSWORD ================= */

  async changePassword(userId, oldPassword, newPassword) {

    const [rows] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    )

    const user = rows[0]

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      throw new Error("Old password incorrect")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    )

    return { message: "Password changed successfully" }
  }
}

module.exports = new AuthService()