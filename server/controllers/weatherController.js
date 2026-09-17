const weatherService = require('../services/weatherService');

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Private
const getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      res.status(400);
      throw new Error('Latitude and longitude are required');
    }
    const data = await weatherService.getCurrentWeather(lat, lon);
    res.json({ success: true, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      res.status(401);
      error.message = 'Weather service authentication error.';
    } else if (error.response && error.response.status === 404) {
      res.status(404);
      error.message = 'Weather data not found for this location.';
    } else if (error.response && error.response.status === 429) {
      res.status(429);
      error.message = 'Weather service rate limit reached. Please try again later.';
    }
    next(error);
  }
};

// @desc    Get weather forecast
// @route   GET /api/weather/forecast
// @access  Private
const getForecast = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      res.status(400);
      throw new Error('Latitude and longitude are required');
    }
    const data = await weatherService.getForecast(lat, lon);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Search locations
// @route   GET /api/weather/search
// @access  Private
const searchLocation = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      res.status(400);
      throw new Error('Search query is required');
    }
    const data = await weatherService.searchLocations(q);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Reverse geocode coordinates
// @route   GET /api/weather/reverse
// @access  Private
const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      res.status(400);
      throw new Error('Latitude and longitude are required');
    }
    const data = await weatherService.reverseGeocode(lat, lon);
    if (!data) {
      res.status(404);
      throw new Error('Location not found');
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete weather data
// @route   GET /api/weather
// @access  Private
const getWeather = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      res.status(400);
      throw new Error('Latitude and longitude are required');
    }
    const data = await weatherService.getCompleteWeatherData(lat, lon);
    res.json({ success: true, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      res.status(401);
      error.message = 'Weather service authentication error.';
    } else if (error.response && error.response.status === 404) {
      res.status(404);
      error.message = 'Weather data not found for this location.';
    } else if (error.response && error.response.status === 429) {
      res.status(429);
      error.message = 'Weather service rate limit reached. Please try again later.';
    }
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  searchLocation,
  reverseGeocode,
  getWeather,
};
