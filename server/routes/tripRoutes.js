const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  analyzeTrip,
  generateItinerary
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createTrip)
  .get(getTrips);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

router.post('/:id/analyze', analyzeTrip);
router.post('/:id/itinerary', generateItinerary);
router.post('/:id/itinerary/regenerate', generateItinerary);

module.exports = router;
