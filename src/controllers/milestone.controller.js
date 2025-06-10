const Milestone = require('../models/milestone.model');

exports.getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ userId: req.user._id });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching milestones', error: error.message });
  }
};

exports.getMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching milestone', error: error.message });
  }
};

exports.createMilestone = async (req, res) => {
  try {
    const milestone = new Milestone({
      ...req.body,
      userId: req.user._id
    });
    
    await milestone.save();
    res.status(201).json(milestone);
  } catch (error) {
    res.status(400).json({ message: 'Error creating milestone', error: error.message });
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    res.json(milestone);
  } catch (error) {
    res.status(400).json({ message: 'Error updating milestone', error: error.message });
  }
};

exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting milestone', error: error.message });
  }
}; 