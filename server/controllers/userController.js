const User = require('../models/User');

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
const updateUserLocation = async (req, res, next) => {
  try {
    const { name, state, country, latitude, longitude } = req.body;

    if (!latitude || !longitude || !name) {
      res.status(400);
      throw new Error('Please provide name, latitude, and longitude');
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.location = {
        name,
        state: state || '',
        country: country || '',
        latitude,
        longitude,
      };

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: updatedUser.location,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updateUserPreferences = async (req, res, next) => {
  try {
    const { notificationPreferences, timezone } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      if (notificationPreferences) {
        user.notificationPreferences = {
          ...user.notificationPreferences,
          ...notificationPreferences
        };
      }
      if (timezone) {
        user.timezone = timezone;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          notificationPreferences: updatedUser.notificationPreferences,
          timezone: updatedUser.timezone
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUserLocation,
  updateUserPreferences
};
