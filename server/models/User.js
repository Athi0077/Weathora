const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      name: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notificationPreferences: {
      weatherAlerts: { type: Boolean, default: true },
      tripReminders: { type: Boolean, default: true },
      activityAlerts: { type: Boolean, default: true },
      workAlerts: { type: Boolean, default: true },
      aiReports: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
