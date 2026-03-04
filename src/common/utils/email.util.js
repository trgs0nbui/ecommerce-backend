const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

exports.sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Ecommerce System" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Verification Code",
    html: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>This code will expire in 5 minutes.</p>
    `
  })
}