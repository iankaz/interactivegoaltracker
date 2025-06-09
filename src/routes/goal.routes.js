const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateGoal } = require('../middleware/validation.middleware');

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a new goal
 *     description: Creates a new goal for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - targetDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [personal, professional, health, education, other]
 *               targetDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.post('/', protect, validateGoal, goalController.createGoal);

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals
 *     description: Returns all goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 *       401:
 *         description: Not authenticated
 */
router.get('/', protect, goalController.getGoals);

/**
 * @swagger
 * /api/goals/{id}:
 *   get:
 *     summary: Get a goal
 *     description: Returns a specific goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal details
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Goal not found
 */
router.get('/:id', protect, goalController.getGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   put:
 *     summary: Update a goal
 *     description: Updates a specific goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [personal, professional, health, education, other]
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed, on_hold]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               targetDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Goal not found
 */
router.put('/:id', protect, validateGoal, goalController.updateGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     description: Deletes a specific goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Goal not found
 */
router.delete('/:id', protect, goalController.deleteGoal);

/**
 * @swagger
 * /api/goals/{id}/progress:
 *   put:
 *     summary: Update goal progress
 *     description: Updates the progress of a specific goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - progress
 *             properties:
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Goal not found
 */
router.put('/:id/progress', protect, goalController.updateProgress);

module.exports = router; 