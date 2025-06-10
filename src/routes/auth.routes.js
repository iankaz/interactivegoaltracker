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
  const config = {
    nodeEnv: process.env.NODE_ENV,
    hasClientId: !!process.env.GITHUB_CLIENT_ID,
    hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
    hasJwtSecret: !!process.env.JWT_SECRET,
    callbackUrl: 'https://cse341-rlcp.onrender.com/api/auth/github/callback',
    clientId: process.env.GITHUB_CLIENT_ID
  };
  console.log('OAuth Configuration:', config);
  res.json(config);
});

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Start GitHub OAuth authentication
 *     description: Redirects to GitHub for authentication
 *     tags: [Authentication]
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
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code from GitHub
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     displayName:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */
router.get('/github/callback', authController.githubCallback);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the currently authenticated user's information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router; 