const cron = require('node-cron');
const User = require('../models/User');
const { generatePeriodicAIReport } = require('../services/reportService');

const startReportScheduler = () => {
  if (process.env.CRON_ENABLED === 'false') {
    return;
  }
  
  console.log('AI report scheduler started (runs every 6 hours)');
  
  // Every 6 hours: 0 */6 * * *
  cron.schedule('0 */6 * * *', async () => {
    try {
      console.log('Running periodic AI report generation...');
      
      const users = await User.find({ 'notificationPreferences.aiReports': { $ne: false } });
      
      for (const user of users) {
        await generatePeriodicAIReport(user._id);
      }
      
      console.log('Periodic AI report generation completed');
    } catch (error) {
      console.error('Error in report scheduler:', error);
    }
  });
};

module.exports = {
  startReportScheduler
};
