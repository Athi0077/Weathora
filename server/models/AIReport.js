const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    required: true,
    default: 'weather_planning'
  },
  location: {
    name: String,
    latitude: Number,
    longitude: Number
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  periodStart: Date,
  periodEnd: Date,
  weatherSummary: String,
  planningSummary: String,
  alerts: [{
    severity: String,
    title: String,
    message: String
  }],
  recommendations: [{
    title: String,
    message: String
  }],
  tripInsights: [{
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    },
    message: String
  }],
  activityInsights: [{
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OutdoorPlan'
    },
    message: String
  }],
  workInsights: [{
    workPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkPlan'
    },
    message: String
  }],
  aiContent: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

aiReportSchema.index({ user: 1, createdAt: -1 });
aiReportSchema.index({ user: 1, reportType: 1 });

const AIReport = mongoose.model('AIReport', aiReportSchema);
module.exports = AIReport;
