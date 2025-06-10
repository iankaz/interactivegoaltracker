const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { validateGoal, validateMilestone } = require('../middleware/validation.middleware');
const goalController = require('../controllers/goal.controller');

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 */
router.get('/', authenticate, goalController.getGoals);

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a new goal
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
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
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
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.post('/', authenticate, validateGoal, goalController.createGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   get:
 *     summary: Get a specific goal
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
 */
router.get('/:id', authenticate, goalController.getGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   put:
 *     summary: Update a goal
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
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Goal updated successfully
 */
router.put('/:id', authenticate, validateGoal, goalController.updateGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   delete:
 *     summary: Delete a goal
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
 */
router.delete('/:id', authenticate, goalController.deleteGoal);

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
router.put('/:id/progress', authenticate, goalController.updateProgress);

/**
 * @swagger
 * /api/goals/{id}/milestones:
 *   post:
 *     summary: Add a milestone to a goal
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
 *               - title
 *               - description
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed, on_hold]
 *               dueDate:
 *                 type: string
 *                 format: date
 *               completedDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Milestone added successfully
 */
router.post('/:id/milestones', authenticate, validateMilestone, goalController.addMilestone);

/**
 * @swagger
 * /api/goals/{id}/milestones/{milestoneId}:
 *   put:
 *     summary: Update a milestone
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: milestoneId
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
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed, on_hold]
 *               dueDate:
 *                 type: string
 *                 format: date
 *               completedDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Milestone updated successfully
 */
router.put('/:id/milestones/:milestoneId', authenticate, validateMilestone, goalController.updateMilestone);

/**
 * @swagger
 * /api/goals/{id}/milestones/{milestoneId}:
 *   delete:
 *     summary: Delete a milestone
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Milestone deleted successfully
 */
router.delete('/:id/milestones/:milestoneId', authenticate, goalController.deleteMilestone);

module.exports = router; 