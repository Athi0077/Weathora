const express = require('express');
const router = express.Router();
const { analyzeWork, getWorkPlans } = require('../controllers/workController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/')
  .get(getWorkPlans);
router.post('/analyze', analyzeWork);

module.exports = router;
