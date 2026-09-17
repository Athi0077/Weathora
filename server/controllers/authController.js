const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate token and set cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  const options = {
    httpOnly: true,
    secure: !isDev, // true for production/render, false for local dev
    sameSite: !isDev ? 'none' : 'lax', // 'none' required for cross-origin (Vercel -> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('jwt', token, options);
  return token;
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    if (!location || !location.name || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      res.status(400);
      throw new Error('Please provide a valid location with name, latitude, and longitude');
    }

    if (location.latitude < -90 || location.latitude > 90 || location.longitude < -180 || location.longitude > 180) {
      res.status(400);
      throw new Error('Invalid coordinates provided');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409); // Conflict
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location: {
        name: location.name,
        state: location.state || '',
        country: location.country || '',
        latitude: location.latitude,
        longitude: location.longitude,
      }
    });

    if (user) {
      generateTokenAndSetCookie(res, user._id);
      
      res.status(201).json({
        success: true,
        message: 'Signup successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          location: user.location,
          timezone: user.timezone,
          notificationPreferences: user.notificationPreferences
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        timezone: user.timezone,
        notificationPreferences: user.notificationPreferences
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // req.user is set in the authMiddleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        location: req.user.location,
        timezone: req.user.timezone,
        notificationPreferences: req.user.notificationPreferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res, next) => {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: !isDev,
      sameSite: !isDev ? 'none' : 'lax',
      expires: new Date(0),
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
};
