const cron = require('node-cron');
const User = require('../models/User');
const { checkWeatherAlerts } = require('../services/weatherAlertService');

const startWeatherAlertScheduler = () => {
  if (process.env.CRON_ENABLED === 'false') {
    return;
  }
  
  console.log('Weather alert scheduler started (runs every 3 hours)');
  
  // Every 3 hours
  cron.schedule('0 */3 * * *', async () => {
    try {
      console.log('Running periodic weather alert check...');
      
      const users = await User.find({ 'notificationPreferences.weatherAlerts': { $ne: false } });
      
      for (const user of users) {
        await checkWeatherAlerts(user._id);
      }
      
      console.log('Periodic weather alert check completed');
    } catch (error) {
      console.error('Error in weather alert scheduler:', error);
    }
  });
};

module.exports = {
  startWeatherAlertScheduler
};
