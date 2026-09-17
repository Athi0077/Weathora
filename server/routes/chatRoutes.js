const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// We use protect middleware to ensure only logged in users can chat
router.post('/', protect, chatController.handleChat);
router.get('/companion', protect, chatController.getCompanionMessages);

module.exports = router;
