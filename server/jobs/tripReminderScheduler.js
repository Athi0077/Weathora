const cron = require('node-cron');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const { createNotification } = require('../services/notificationService');

const startTripReminderScheduler = () => {
  if (process.env.CRON_ENABLED === 'false') {
    return;
  }
  
  console.log('Trip reminder scheduler started (runs daily)');
  
  // Every day at 8:00 AM UTC
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('Running daily trip reminders...');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0,0,0,0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Find trips starting tomorrow
      const upcomingTrips = await Trip.find({
        startDate: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        status: 'upcoming'
      }).populate('user');

      for (const trip of upcomingTrips) {
        if (!trip.user || (trip.user.notificationPreferences && trip.user.notificationPreferences.tripReminders === false)) {
          continue;
        }

        // Deduplication
        const existingAlert = await Notification.findOne({
          user: trip.user._id,
          type: 'trip_reminder',
          'data.tripId': trip._id.toString()
        });

        if (!existingAlert) {
          await createNotification({
            user: trip.user._id,
            type: 'trip_reminder',
            title: 'Trip Reminder',
            message: `Your trip to ${trip.destination} starts tomorrow. Check the latest forecast before leaving.`,
            data: {
              tripId: trip._id.toString()
            }
          });
        }
      }
      
      console.log('Daily trip reminders completed');
    } catch (error) {
      console.error('Error in trip reminder scheduler:', error);
    }
  });
};

module.exports = {
  startTripReminderScheduler
};
