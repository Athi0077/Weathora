const aiService = require('../services/aiService');
const weatherService = require('../services/weatherService');
const Trip = require('../models/Trip');
const OutdoorPlan = require('../models/OutdoorPlan');
const WorkPlan = require('../models/WorkPlan');
const AIReport = require('../models/AIReport');

exports.handleChat = async (req, res) => {
  try {
    const { messages, weatherContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch user data
    const [trips, outdoorPlans, workPlans, recentReports] = await Promise.all([
      Trip.find({ user: req.user.id, endDate: { $gte: today } }).select('-__v -createdAt -updatedAt -user').lean(),
      OutdoorPlan.find({ user: req.user.id, date: { $gte: today } }).select('-__v -createdAt -updatedAt -user').lean(),
      WorkPlan.find({ user: req.user.id, date: { $gte: today } }).select('-__v -createdAt -updatedAt -user').lean(),
      AIReport.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(2).select('type data summary createdAt').lean()
    ]);

    // Intent Extraction
    const intent = await aiService.extractChatIntent(messages, trips);
    let targetForecast = null;

    // Fetch target weather if necessary
    if (intent.targetLocation) {
      try {
        const locations = await weatherService.searchLocations(intent.targetLocation);
        if (locations && locations.length > 0) {
          const { latitude, longitude } = locations[0];
          const completeWeather = await weatherService.getCompleteWeatherData(latitude, longitude);
          targetForecast = {
            location: completeWeather.location,
            currentWeather: completeWeather.current,
            forecast: completeWeather.forecast.slice(0, 8) // Next 24 hours approximately
          };
        }
      } catch (weatherErr) {
        console.error('Target weather fetch failed:', weatherErr);
      }
    }

    // Build Structured Context
    const structuredContext = {
      user: {
        name: req.user.name,
        email: req.user.email,
        defaultLocation: req.user.defaultLocation
      },
      currentLocationWeather: weatherContext,
      targetLocationWeather: targetForecast,
      trips,
      outdoorPlans,
      workPlans,
      recentReports
    };

    const aiResponse = await aiService.generateChatResponse(messages, structuredContext);
    
    if (!aiResponse || !aiResponse.reply) {
      throw new Error('Invalid AI response format');
    }

    res.json({ reply: aiResponse.reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate chat response' });
  }
};
exports.getCompanionMessages = async (req, res) => {
  try {
    const { weatherContext } = req.query;
    let parsedWeatherContext = null;
    if (weatherContext) {
      try {
        parsedWeatherContext = JSON.parse(weatherContext);
      } catch (e) {
        console.warn('Could not parse weatherContext query param');
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [trips, outdoorPlans, workPlans, recentReports] = await Promise.all([
      Trip.find({ user: req.user.id, endDate: { $gte: today } }).select('-__v -createdAt -updatedAt -user').lean(),
      OutdoorPlan.find({ user: req.user.id, date: { $gte: today } }).select('-__v -createdAt -updatedAt -user').lean(),
      WorkPlan.find({ user: req.user.id, date: { $gte: today } }).select('-__v -createdAt -updatedAt -user').lean(),
      AIReport.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(1).select('type data summary createdAt').lean()
    ]);

    const structuredContext = {
      user: {
        name: req.user.name,
        defaultLocation: req.user.location?.name
      },
      currentWeather: parsedWeatherContext,
      trips,
      outdoorPlans,
      workPlans,
      recentReports
    };

    const messages = await aiService.generateCompanionMessages(structuredContext);
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Companion messages error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate companion messages' });
  }
};
