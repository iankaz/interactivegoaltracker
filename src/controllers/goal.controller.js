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
      userId: req.user._id
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error creating goal', error: error.message });
  }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
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
      userId: req.user._id
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
      { _id: req.params.id, userId: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error updating goal', error: error.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
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

exports.addMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goal.milestones.push(req.body);
    await goal.save();
    
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error adding milestone', error: error.message });
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const milestone = goal.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    Object.assign(milestone, req.body);
    await goal.save();
    
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error updating milestone', error: error.message });
  }
};

exports.deleteMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goal.milestones.pull(req.params.milestoneId);
    await goal.save();
    
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting milestone', error: error.message });
  }
}; 