const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createReview,
  getReviews,
  getReviewSummary,
  getMyReview,
  updateReview,
  deleteReview,
  getAdminReviews,
  updateReviewStatus
} = require('../controllers/reviewController');

// Public routes
router.get('/', getReviews);
router.get('/summary', getReviewSummary);

// Protected routes (User)
router.post('/', protect, createReview);
router.get('/my-review', protect, getMyReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.get('/admin/all', protect, getAdminReviews);
router.put('/admin/:id/status', protect, updateReviewStatus);
// Admin delete uses the same delete method with an admin check inside

module.exports = router;
