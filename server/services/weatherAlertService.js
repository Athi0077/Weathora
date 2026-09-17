const User = require('../models/User');
const weatherService = require('./weatherService');
const { createNotification } = require('./notificationService');
const Notification = require('../models/Notification');

// Deduplication window: 12 hours for same alert type at same location
const DEDUPLICATION_MS = 12 * 60 * 60 * 1000;

const checkWeatherAlerts = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.location || !user.location.latitude || !user.location.longitude) {
      return;
    }

    if (user.notificationPreferences && user.notificationPreferences.weatherAlerts === false) {
      return;
    }

    const weatherData = await weatherService.getCompleteWeatherData(
      user.location.latitude,
      user.location.longitude
    );

    if (!weatherData || !weatherData.forecast || weatherData.forecast.length === 0) {
      return;
    }

    // Check next 24 hours (roughly 8 * 3-hour slots)
    const next24Hours = weatherData.forecast.slice(0, 8);
    let alertType = null;
    let alertMessage = null;
    let alertSeverity = null;

    // Thresholds
    for (const f of next24Hours) {
      if (f.rainChance > 80) {
        alertType = 'heavy_rain';
        alertSeverity = 'high';
        alertMessage = `Heavy rain (${f.rainChance}%) is expected in your area around ${f.dateText}.`;
        break; // Priority alert
      } else if (f.windSpeed > 40) {
        alertType = 'strong_wind';
        alertSeverity = 'high';
        alertMessage = `Strong winds (${f.windSpeed} km/h) are expected in your area around ${f.dateText}.`;
        break;
      } else if (f.temperature > 40) {
        alertType = 'extreme_heat';
        alertSeverity = 'high';
        alertMessage = `Extreme heat (${f.temperature}°C) expected around ${f.dateText}.`;
        break;
      } else if (f.rainChance > 50) {
        alertType = 'rain';
        alertSeverity = 'medium';
        alertMessage = `Rain is expected in your area around ${f.dateText}.`;
        break;
      }
    }

    if (alertType) {
      // Deduplication check
      const twelveHoursAgo = new Date(Date.now() - DEDUPLICATION_MS);
      const recentAlert = await Notification.findOne({
        user: user._id,
        type: 'weather_alert',
        'data.alertType': alertType,
        createdAt: { $gte: twelveHoursAgo }
      });

      if (!recentAlert) {
        await createNotification({
          user: user._id,
          type: 'weather_alert',
          title: 'Weather Alert',
          message: alertMessage,
          data: {
            location: user.location.name,
            alertType,
            severity: alertSeverity
          }
        });
      }
    }

  } catch (error) {
    console.error(`Error checking weather alerts for user ${userId}:`, error);
  }
};

module.exports = {
  checkWeatherAlerts
};
