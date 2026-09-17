const Trip = require('../models/Trip');
const weatherService = require('../services/weatherService');
const aiService = require('../services/aiService');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res, next) => {
  try {
    const { destination, location, startDate, endDate, tripType, travelers, activities, preferences, notes } = req.body;

    if (!destination || !location || !startDate || !endDate || !tripType || !travelers) {
      res.status(400);
      throw new Error('Please provide all required trip fields');
    }
    
    // Basic date validation
    if (new Date(endDate) < new Date(startDate)) {
      res.status(400);
      throw new Error('End date cannot be before start date');
    }

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      location,
      startDate,
      endDate,
      tripType,
      travelers,
      activities: activities || [],
      preferences: preferences || [],
      notes: notes || '',
      status: 'upcoming'
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's trips
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ startDate: 1 });
    
    // Update status based on current date dynamically
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let needsSave = false;
    for (let trip of trips) {
      if (trip.status !== 'cancelled') {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        
        let newStatus = 'upcoming';
        if (today > end) {
          newStatus = 'completed';
        } else if (today >= start && today <= end) {
          newStatus = 'ongoing';
        }
        
        if (trip.status !== newStatus) {
          trip.status = newStatus;
          await trip.save();
        }
      }
    }

    res.json({ success: true, data: trips });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    // Ensure user owns trip
    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this trip');
    }

    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this trip');
    }
    
    if (req.body.endDate && req.body.startDate && new Date(req.body.endDate) < new Date(req.body.startDate)) {
      res.status(400);
      throw new Error('End date cannot be before start date');
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedTrip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this trip');
    }

    await trip.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI analysis for a trip
// @route   POST /api/trips/:id/analyze
// @access  Private
const analyzeTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this trip');
    }

    // 1. Fetch weather data for the destination
    let weatherData;
    try {
      weatherData = await weatherService.getCompleteWeatherData(
        trip.location.latitude,
        trip.location.longitude
      );
    } catch (weatherError) {
      throw new Error('Failed to retrieve weather data for analysis.');
    }

    // Prepare forecast string summary to feed AI
    const forecast = weatherData.forecast.slice(0, 40); // 5 days
    const weatherContextStr = forecast.map(f => 
      `${f.dateText}: Temp ${f.temperature}°C, ${f.condition}, Rain Chance ${f.rainChance}%`
    ).join('; ');

    // 2. Prepare Prompt
    const systemInstruction = `You are a Weather-aware travel planning assistant.
Analyze the trip details and the provided weather forecast.
Provide your response strictly in the following JSON format matching this schema without any markdown wrapping (just raw JSON):
{
  "overallScore": <number 0-100 based on weather suitability>,
  "suitability": "<string (e.g., 'Good', 'Fair', 'Poor')>",
  "summary": "<short string summarizing weather and trip>",
  "weatherOverview": "<string overview of weather>",
  "dailyAnalysis": [
    {
      "date": "<YYYY-MM-DD>",
      "weather": "<string>",
      "temperature": { "min": <number>, "max": <number> },
      "rainRisk": "<'Low', 'Medium', 'High'>",
      "outdoorSuitability": "<'Good', 'Fair', 'Poor'>",
      "recommendation": "<string>"
    }
  ],
  "recommendedActivities": ["<string>"],
  "avoidActivities": ["<string>"],
  "risks": ["<string weather risks>"],
  "packingSuggestions": ["<string item>"],
  "bestDays": ["<YYYY-MM-DD>"],
  "backupPlan": "<string backup alternatives>",
  "travelAdvice": "<string concise advice>"
}

Critical Instructions:
- Do NOT invent weather data. Use only the provided forecast.
- If the trip dates fall outside the provided forecast window (typically next 5 days), explicitly state in the 'summary' that "Detailed forecast data is currently available only for the near-term forecast window. Recommendations for later dates are based on available information and are tentative."
- Do not claim certainty about future weather.
- Separate weather observations from recommendations.
- 'dailyAnalysis' should only cover the requested trip dates. If trip is longer than forecast, provide analysis for known days and tentative general advice for the rest.`;

    const prompt = `
Trip Details:
Destination: ${trip.destination}
Start Date: ${trip.startDate.toISOString().split('T')[0]}
End Date: ${trip.endDate.toISOString().split('T')[0]}
Trip Type: ${trip.tripType}
Travelers: ${trip.travelers}
Activities: ${trip.activities.join(', ')}
Preferences: ${trip.preferences.join(', ')}
Notes: ${trip.notes || 'None'}

Available Weather Forecast Data:
${weatherContextStr}
`;

    // 3. Call AI
    const aiAnalysis = await aiService.generateAIResponse(prompt, systemInstruction);

    // 4. Validate and Save
    if (aiAnalysis && typeof aiAnalysis === 'object' && aiAnalysis.overallScore !== undefined) {
      trip.aiAnalysis = aiAnalysis;
      await trip.save();
      res.json({ success: true, data: trip });
    } else {
      throw new Error('AI returned invalid data format');
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Generate Smart Itinerary for a trip
// @route   POST /api/trips/:id/itinerary and /api/trips/:id/itinerary/regenerate
// @access  Private
const generateItinerary = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this trip');
    }

    // 1. Fetch weather data for the destination
    let weatherData;
    try {
      weatherData = await weatherService.getCompleteWeatherData(
        trip.location.latitude,
        trip.location.longitude
      );
    } catch (weatherError) {
      throw new Error('Failed to retrieve weather data for itinerary generation.');
    }

    // Prepare forecast summary for the AI
    const forecast = weatherData.forecast.slice(0, 40); // roughly 5 days
    const weatherContextStr = forecast.map(f => 
      `${f.dateText}: Temp ${f.temperature}°C, ${f.condition}, Rain Chance ${f.rainChance}%`
    ).join('; ');

    // 2. Call AI Itinerary Service
    const aiItinerary = await aiService.generateTripItinerary(trip, weatherContextStr);

    // 3. Validate and Save
    if (aiItinerary && aiItinerary.days && Array.isArray(aiItinerary.days)) {
      const updatedTrip = await Trip.findByIdAndUpdate(
        req.params.id,
        { $set: { itinerary: aiItinerary.days } },
        { new: true, runValidators: true }
      );
      res.json({ success: true, data: updatedTrip });
    } else {
      throw new Error('AI returned invalid itinerary data format');
    }

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  analyzeTrip,
  generateItinerary
};
