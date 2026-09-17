const mongoose = require('mongoose');

const outdoorPlanSchema = new mongoose.Schema({
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
  activity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  aiAnalysis: {
    suitability: String,
    bestTime: String,
    weatherSummary: String,
    weatherRisks: [String],
    tips: [String],
    alternativeTime: String
  }
}, {
  timestamps: true
});

const OutdoorPlan = mongoose.model('OutdoorPlan', outdoorPlanSchema);
module.exports = OutdoorPlan;
