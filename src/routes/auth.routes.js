const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

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