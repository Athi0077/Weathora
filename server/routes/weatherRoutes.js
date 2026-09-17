const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getForecast,
  searchLocation,
  reverseGeocode,
  getWeather,
} = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (used during signup)
router.get('/search', searchLocation);
router.get('/reverse', reverseGeocode);

router.use(protect); // All weather routes below are protected

router.get('/', getWeather);
router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);

module.exports = router;
