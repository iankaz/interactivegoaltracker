const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/auth/test-config:
 *   get:
 *     summary: Test OAuth configuration
 *     description: Returns the current OAuth configuration (without sensitive data)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Configuration status
 */
router.get('/test-config', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasClientId: !!process.env.GITHUB_CLIENT_ID,
    hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
    hasJwtSecret: !!process.env.JWT_SECRET,
    callbackUrl: process.env.NODE_ENV === 'production'
      ? 'https://cse341-rlcp.onrender.com/api/auth/github/callback'
      : 'http://localhost:3000/api/auth/github/callback'
  });
});

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Authenticate with GitHub
 *     description: Redirects to GitHub OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to GitHub
 */
router.get('/github', authController.githubAuth);

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     description: Handles the callback from GitHub OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to client with token
 */
router.get('/github/callback', authController.githubCallback);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router; 