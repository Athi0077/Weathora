const OutdoorPlan = require('../models/OutdoorPlan');
const weatherService = require('../services/weatherService');
const aiService = require('../services/aiService');

// @desc    Analyze outdoor activity conditions
// @route   POST /api/activity/analyze
// @access  Private
const analyzeActivity = async (req, res, next) => {
  try {
    const { location, activity, date, preferredTime } = req.body;

    if (!location || !activity || !date || !preferredTime) {
      res.status(400);
      throw new Error('Please provide location, activity, date, and preferred time');
    }

    // 1. Fetch weather data
    let weatherData;
    try {
      weatherData = await weatherService.getCompleteWeatherData(
        location.latitude,
        location.longitude
      );
    } catch (error) {
      throw new Error('Failed to retrieve weather data for analysis.');
    }

    const forecast = weatherData.forecast.slice(0, 40);
    const weatherContextStr = forecast.map(f => 
      `${f.dateText}: Temp ${f.temperature}°C, ${f.condition}, Rain Chance ${f.rainChance}%`
    ).join('; ');

    // 2. AI Analysis
    const aiAnalysis = await aiService.generateOutdoorActivityAnalysis(req.body, weatherContextStr);

    // 3. Save Plan (Optional persistence)
    const plan = await OutdoorPlan.create({
      user: req.user._id,
      location,
      activity,
      date,
      preferredTime,
      aiAnalysis
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Get outdoor plans
// @route   GET /api/activity
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const plans = await OutdoorPlan.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeActivity,
  getActivities
};
