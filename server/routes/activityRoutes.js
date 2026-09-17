const express = require('express');
const router = express.Router();
const { analyzeActivity, getActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/')
  .get(getActivities);
router.post('/analyze', analyzeActivity);

module.exports = router;
