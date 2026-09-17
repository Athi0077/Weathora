require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const tripRoutes = require('./routes/tripRoutes');
const activityRoutes = require('./routes/activityRoutes');
const workRoutes = require('./routes/workRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiReportRoutes = require('./routes/aiReportRoutes');
const devRoutes = require('./routes/devRoutes');
const chatRoutes = require('./routes/chatRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const { startReportScheduler } = require('./jobs/reportScheduler');
const { startWeatherAlertScheduler } = require('./jobs/weatherAlertScheduler');
const { startTripReminderScheduler } = require('./jobs/tripReminderScheduler');

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render load balancer) for secure cookies


const dns = require("node:dns")
dns.setServers(['8.8.8.8', '8.8.4.4'])

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Automatically allow any vercel.app subdomain or localhost
    if (origin.endsWith('.vercel.app') || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Weathora API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      api: 'ok',
      database: 'connected'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/work', workRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai-reports', aiReportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dev', devRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Start schedulers
  startReportScheduler();
  startWeatherAlertScheduler();
  startTripReminderScheduler();
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
