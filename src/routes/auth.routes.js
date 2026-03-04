const express = require("express");
const router = express.Router();
const authController = require("../modules/auth/auth.controller");
const { verifyToken } = require("../common/middleware/auth.middleware");

// Register Route
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Register success
 */
router.post("/register", authController.register);

// Verify Email Route
/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post("/verify-email", authController.verifyEmail);

// Login Route
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Return JWT token
 */
router.post("/login", authController.login);

// Forgot Pasword Route
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP to reset password
 *     tags: [Auth]
 */
router.post("/forgot-password", authController.forgotPassword);

// Reset Password Route
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 */
router.post("/reset-password", authController.resetPassword);

// Change Password Route
/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password (require login)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;
