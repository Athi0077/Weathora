const express = require('express');
const router = express.Router();
const { getAIReports, getAIReport } = require('../controllers/aiReportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAIReports);

router.route('/:id')
  .get(getAIReport);

module.exports = router;
