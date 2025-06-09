const { validationResult } = require('express-validator');
const Goal = require('../models/goal.model');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = new Goal({
      ...req.body,
      userId: req.user.id
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error: error.message });
  }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};

// Get a single goal
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error: error.message });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error: error.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
};

// Update goal progress
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        $set: { 
          progress,
          status: progress === 100 ? 'completed' : 'in_progress'
        }
      },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
}; 