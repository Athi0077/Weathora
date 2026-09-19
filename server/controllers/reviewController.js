const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, review, category } = req.body;

    // Check if user already submitted a review
    const existingReview = await Review.findOne({ user: req.user._id });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review. You can edit your existing review.',
      });
    }

    const newReview = await Review.create({
      user: req.user._id,
      rating,
      review,
      category: category || 'overall',
      status: 'published'
    });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ success: false, message: 'You have already submitted a review.' });
    }
    next(error);
  }
};

// @desc    Get published reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const sortBy = req.query.sort || 'recent';

    let sortOption = { createdAt: -1 };
    if (sortBy === 'highest') sortOption = { rating: -1, createdAt: -1 };
    if (sortBy === 'lowest') sortOption = { rating: 1, createdAt: -1 };

    const query = { status: 'published' };

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('user', 'name')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get review summary (average rating, distribution)
// @route   GET /api/reviews/summary
// @access  Public
const getReviewSummary = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'published' }).select('rating');
    
    const totalReviews = reviews.length;
    let averageRating = 0;
    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    if (totalReviews > 0) {
      let sum = 0;
      reviews.forEach(r => {
        sum += r.rating;
        distribution[r.rating]++;
      });
      averageRating = (sum / totalReviews).toFixed(1);
    }

    // Calculate percentages
    const distributionPercent = {};
    for (let i = 1; i <= 5; i++) {
      distributionPercent[i] = totalReviews > 0 ? Math.round((distribution[i] / totalReviews) * 100) : 0;
    }

    res.status(200).json({
      success: true,
      data: {
        averageRating: Number(averageRating),
        totalReviews,
        distribution: distributionPercent,
        rawDistribution: distribution
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's review
// @route   GET /api/reviews/my-review
// @access  Private
const getMyReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ user: req.user._id });

    if (!review) {
      return res.status(200).json({
        success: true,
        data: null, // Return null if no review found
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const { rating, review, category } = req.body;
    let existingReview = await Review.findById(req.params.id);

    if (!existingReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ensure user owns the review
    if (existingReview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    existingReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, review, category: category || existingReview.category },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: existingReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const existingReview = await Review.findById(req.params.id);

    if (!existingReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ensure user owns the review or is admin
    if (existingReview.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await existingReview.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN OPERATIONS
// ==========================================

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
const getAdminReviews = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized as admin' });
    }

    const reviews = await Review.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments();
    const published = await Review.countDocuments({ status: 'published' });
    const hidden = total - published;

    res.status(200).json({
      success: true,
      data: reviews,
      stats: { total, published, hidden }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change review status (Admin)
// @route   PUT /api/reviews/admin/:id/status
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized as admin' });
    }

    const { status } = req.body;
    if (!['published', 'hidden'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewSummary,
  getMyReview,
  updateReview,
  deleteReview,
  getAdminReviews,
  updateReviewStatus
};
