const express = require('express');
const router = express.Router();
const { updateUserLocation, updateUserPreferences } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/location', protect, updateUserLocation);
router.put('/preferences', protect, updateUserPreferences);

module.exports = router;
