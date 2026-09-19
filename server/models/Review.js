const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    review: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: [
        'overall',
        'weather',
        'trip-planner',
        'ai-assistant',
        'work-planner',
        'outdoor-activity',
        'ui'
      ],
      default: 'overall'
    },
    status: {
      type: String,
      enum: ['published', 'hidden'],
      default: 'published'
    }
  },
  {
    timestamps: true,
  }
);

// Ensure one user can only have one active review
reviewSchema.index({ user: 1 }, { unique: true });
// Optimize querying
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
