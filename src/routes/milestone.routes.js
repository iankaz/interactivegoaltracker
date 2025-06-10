const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { validateMilestone } = require('../middleware/validation.middleware');
const milestoneController = require('../controllers/milestone.controller');

/**
 * @swagger
 * /api/milestones:
 *   get:
 *     summary: Get all milestones for the authenticated user
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of milestones
 */
router.get('/', authenticate, milestoneController.getMilestones);

/**
 * @swagger
 * /api/milestones:
 *   post:
 *     summary: Create a new milestone
 *     tags: [Milestones]
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
 *               - dueDate
 *               - goalId
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
 *               goalId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Milestone created successfully
 */
router.post('/', authenticate, validateMilestone, milestoneController.createMilestone);

/**
 * @swagger
 * /api/milestones/{id}:
 *   get:
 *     summary: Get a specific milestone
 *     tags: [Milestones]
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
 *         description: Milestone details
 */
router.get('/:id', authenticate, milestoneController.getMilestone);

/**
 * @swagger
 * /api/milestones/{id}:
 *   put:
 *     summary: Update a milestone
 *     tags: [Milestones]
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
router.put('/:id', authenticate, validateMilestone, milestoneController.updateMilestone);

/**
 * @swagger
 * /api/milestones/{id}:
 *   delete:
 *     summary: Delete a milestone
 *     tags: [Milestones]
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
 *         description: Milestone deleted successfully
 */
router.delete('/:id', authenticate, milestoneController.deleteMilestone);

module.exports = router; 