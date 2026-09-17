const AIReport = require('../models/AIReport');

// @desc    Get user's AI reports
// @route   GET /api/ai-reports
// @access  Private
const getAIReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reports = await AIReport.find({ user: req.user._id })
      .sort({ generatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AIReport.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: reports,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single AI report
// @route   GET /api/ai-reports/:id
// @access  Private
const getAIReport = async (req, res, next) => {
  try {
    const report = await AIReport.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAIReports,
  getAIReport
};
