const WorkPlan = require('../models/WorkPlan');
const weatherService = require('../services/weatherService');
const aiService = require('../services/aiService');

// @desc    Analyze work weather conditions
// @route   POST /api/work/analyze
// @access  Private
const analyzeWork = async (req, res, next) => {
  try {
    const { location, workType, date, startTime, endTime, workers, notes } = req.body;

    if (!location || !workType || !date || !startTime || !endTime) {
      res.status(400);
      throw new Error('Please provide location, workType, date, startTime, and endTime');
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
    const aiAnalysis = await aiService.generateWorkWeatherAnalysis(req.body, weatherContextStr);

    // 3. Save Plan (Optional persistence)
    const plan = await WorkPlan.create({
      user: req.user._id,
      location,
      workType,
      date,
      startTime,
      endTime,
      workers,
      notes,
      aiAnalysis
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Get work plans
// @route   GET /api/work
// @access  Private
const getWorkPlans = async (req, res, next) => {
  try {
    const plans = await WorkPlan.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeWork,
  getWorkPlans
};
