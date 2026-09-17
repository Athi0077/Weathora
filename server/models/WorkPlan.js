const mongoose = require('mongoose');

const workPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    name: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  workType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  workers: Number,
  notes: String,
  aiAnalysis: {
    weatherSummary: String,
    recommendedWindow: String,
    weatherConcerns: [String],
    suggestedBreaks: [String],
    backupWindow: String,
    practicalPreparation: [String]
  }
}, {
  timestamps: true
});

const WorkPlan = mongoose.model('WorkPlan', workPlanSchema);
module.exports = WorkPlan;
