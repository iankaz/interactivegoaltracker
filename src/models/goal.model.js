const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['personal', 'professional', 'health', 'education', 'other']
  },
  status: {
    type: String,
    required: true,
    enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
    default: 'not_started'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: String,
    description: String,
    completed: Boolean,
    dueDate: Date
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
goalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Goal', goalSchema); 