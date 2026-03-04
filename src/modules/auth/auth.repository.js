const pool = require('../../database/connection')

class AuthRepository {

  /* ================= USER ================= */

  async findUserByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  }

  async findUserById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  }

  async createUser(data) {
    const { email, password, role, full_name, phone } = data

    const [result] = await pool.query(
      `INSERT INTO users 
      (email, password, role, full_name, phone) 
      VALUES (?, ?, ?, ?, ?)`,
      [email, password, role, full_name, phone]
    )

    return result.insertId
  }

  async updateUserVerification(email) {
    await pool.query(
      'UPDATE users SET is_verified = TRUE WHERE email = ?',
      [email]
    )
  }

  async updatePasswordByEmail(email, hashedPassword) {
    await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    )
  }

  async updatePasswordById(id, hashedPassword) {
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    )
  }

  /* ================= OTP ================= */

  async createOTP(data) {
    const { email, otp_hash, type, expires_at } = data

    await pool.query(
      `INSERT INTO email_otps (email, otp_hash, type, expires_at)
       VALUES (?, ?, ?, ?)`,
      [email, otp_hash, type, expires_at]
    )
  }

  async getLatestOTP(email, type) {
    const [rows] = await pool.query(
      `SELECT * FROM email_otps
       WHERE email = ?
       AND type = ?
       AND is_used = FALSE
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, type]
    )

    return rows[0]
  }

  async markOTPUsed(id) {
    await pool.query(
      'UPDATE email_otps SET is_used = TRUE WHERE id = ?',
      [id]
    )
  }

}

module.exports = new AuthRepository()