const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generatePeriodicAIReport } = require('../services/reportService');
const { checkWeatherAlerts } = require('../services/weatherAlertService');

// @desc    Manually trigger AI report generation
// @route   POST /api/dev/generate-report
// @access  Private
router.post('/generate-report', protect, async (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, message: 'Only available in development' });
  }

  try {
    const report = await generatePeriodicAIReport(req.user._id);
    if (!report) {
      return res.status(400).json({ success: false, message: 'Report generation skipped (no data or duplicate)' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

// @desc    Manually trigger weather alert check
// @route   POST /api/dev/generate-alerts
// @access  Private
router.post('/generate-alerts', protect, async (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, message: 'Only available in development' });
  }

  try {
    await checkWeatherAlerts(req.user._id);
    res.json({ success: true, message: 'Weather alert check completed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
