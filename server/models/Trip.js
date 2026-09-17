const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  time: String,
  title: String,
  description: String,
  type: String,
  duration: Number,
  indoorOutdoor: String,
  weatherSuitability: String,
  latitude: Number,
  longitude: Number,
  reason: String
});

const itineraryDaySchema = new mongoose.Schema({
  date: String,
  dayTitle: String,
  weatherSummary: String,
  items: [itineraryItemSchema]
});


const dailyAnalysisSchema = new mongoose.Schema({
  date: String,
  weather: String,
  temperature: {
    min: Number,
    max: Number
  },
  rainRisk: String,
  outdoorSuitability: String,
  recommendation: String
}, { _id: false });

const aiAnalysisSchema = new mongoose.Schema({
  overallScore: Number,
  suitability: String,
  summary: String,
  weatherOverview: String,
  dailyAnalysis: [dailyAnalysisSchema],
  recommendedActivities: [String],
  avoidActivities: [String],
  risks: [String],
  packingSuggestions: [String],
  bestDays: [String],
  backupPlan: String,
  travelAdvice: String
}, { _id: false });

const locationSchema = new mongoose.Schema({
  name: String,
  state: String,
  country: String,
  latitude: Number,
  longitude: Number
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  location: locationSchema,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  tripType: {
    type: String,
    required: true,
    enum: ['Vacation', 'Family Trip', 'Business Trip', 'Adventure', 'Beach', 'Hiking', 'Road Trip', 'City Tour', 'Other']
  },
  travelers: {
    type: Number,
    required: true,
    min: 1
  },
  activities: [String],
  preferences: [String],
  notes: String,
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  aiAnalysis: aiAnalysisSchema,
  itinerary: [itineraryDaySchema]
}, {
  timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
