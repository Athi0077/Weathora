const Notification = require('../models/Notification');

const createNotification = async ({ user, type, title, message, data = {} }) => {
  try {
    const notification = await Notification.create({
      user,
      type,
      title,
      message,
      data
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification', error);
    return null;
  }
};

module.exports = {
  createNotification
};
