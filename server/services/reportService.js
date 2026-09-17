const User = require('../models/User');
const Trip = require('../models/Trip');
const OutdoorPlan = require('../models/OutdoorPlan');
const WorkPlan = require('../models/WorkPlan');
const AIReport = require('../models/AIReport');
const weatherService = require('./weatherService');
const aiService = require('./aiService');
const { createNotification } = require('./notificationService');

const generatePeriodicAIReport = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.location || !user.location.latitude || !user.location.longitude) {
      console.log(`Skipping report for user ${userId}: No valid location`);
      return null;
    }

    if (user.notificationPreferences && user.notificationPreferences.aiReports === false) {
      console.log(`Skipping report for user ${userId}: aiReports disabled`);
      return null;
    }

    // 1. Check duplicate
    // Let's assume period runs every 6 hours (00:00, 06:00, 12:00, 18:00)
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const existingReport = await AIReport.findOne({
      user: user._id,
      generatedAt: { $gte: sixHoursAgo }
    });

    if (existingReport) {
      console.log(`Skipping report for user ${userId}: Already generated within last 6 hours`);
      return null;
    }

    // 2. Fetch Data
    const weatherData = await weatherService.getCompleteWeatherData(
      user.location.latitude,
      user.location.longitude
    );
    
    if (!weatherData || !weatherData.forecast) {
      console.log(`Skipping report for user ${userId}: Failed to get weather data`);
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTrips = await Trip.find({ 
      user: user._id, 
      status: { $in: ['upcoming', 'ongoing'] } 
    }).sort({ startDate: 1 }).limit(3);

    const upcomingActivities = await OutdoorPlan.find({
      user: user._id,
      date: { $gte: today }
    }).sort({ date: 1 }).limit(3);

    const upcomingWork = await WorkPlan.find({
      user: user._id,
      date: { $gte: today }
    }).sort({ date: 1 }).limit(3);

    // 3. Prepare Prompt
    const forecastSummary = weatherData.forecast.slice(0, 24).map(f => 
      `${f.dateText}: Temp ${f.temperature}°C, ${f.condition}, Rain Chance ${f.rainChance}%`
    ).join('; ');

    const systemInstruction = `You are the Weathora Personal Weather & Planning Assistant.
Analyze the provided user context and provide a personalized, comprehensive report.
Respond strictly in JSON format matching this schema:
{
  "weatherSummary": "Overview of upcoming weather",
  "planningSummary": "Summary of planning insights",
  "alerts": [
    { "severity": "high/medium/low", "title": "Alert title", "message": "Alert detail" }
  ],
  "recommendations": [
    { "title": "Rec title", "message": "Rec detail" }
  ],
  "tripInsights": [
    { "tripId": "id string", "message": "Insight for trip" }
  ],
  "activityInsights": [
    { "activityId": "id string", "message": "Insight for activity" }
  ],
  "workInsights": [
    { "workPlanId": "id string", "message": "Insight for work plan" }
  ]
}

CRITICAL: 
- Return RAW JSON ONLY. No markdown wrappers. 
- Distinguish between observed weather and AI recommendations.
- Do not invent exact forecast data.`;

    const prompt = `
Location: ${user.location.name}
Upcoming Forecast (Next 3 days): ${forecastSummary}

Upcoming Trips:
${upcomingTrips.length ? upcomingTrips.map(t => `- ID: ${t._id}, Destination: ${t.destination}, Dates: ${new Date(t.startDate).toDateString()} to ${new Date(t.endDate).toDateString()}`).join('\n') : 'None'}

Upcoming Outdoor Activities:
${upcomingActivities.length ? upcomingActivities.map(a => `- ID: ${a._id}, Activity: ${a.activityType}, Date: ${new Date(a.date).toDateString()}`).join('\n') : 'None'}

Upcoming Work Plans:
${upcomingWork.length ? upcomingWork.map(w => `- ID: ${w._id}, Work: ${w.workType}, Date: ${new Date(w.date).toDateString()}`).join('\n') : 'None'}

Generate the AI planning report JSON based on the weather conditions.`;

    // 4. Generate AI Response
    const aiAnalysis = await aiService.generateAIResponse(prompt, systemInstruction);

    if (!aiAnalysis || typeof aiAnalysis !== 'object' || !aiAnalysis.weatherSummary) {
      console.error(`AI returned invalid data format for user ${userId}`);
      return null;
    }

    // 5. Save Report
    const report = await AIReport.create({
      user: user._id,
      reportType: 'weather_planning',
      location: {
        name: user.location.name,
        latitude: user.location.latitude,
        longitude: user.location.longitude
      },
      generatedAt: now,
      periodStart: now,
      periodEnd: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      weatherSummary: aiAnalysis.weatherSummary,
      planningSummary: aiAnalysis.planningSummary,
      alerts: aiAnalysis.alerts || [],
      recommendations: aiAnalysis.recommendations || [],
      tripInsights: aiAnalysis.tripInsights || [],
      activityInsights: aiAnalysis.activityInsights || [],
      workInsights: aiAnalysis.workInsights || [],
      aiContent: aiAnalysis
    });

    // 6. Create Notification
    await createNotification({
      user: user._id,
      type: 'ai_report',
      title: 'Your AI Weather Report is ready',
      message: `Your latest weather and planning report for ${user.location.name} is ready to review.`,
      data: {
        reportId: report._id.toString(),
        location: user.location.name
      }
    });

    return report;
  } catch (error) {
    console.error(`Error generating report for user ${userId}:`, error);
    return null;
  }
};

module.exports = {
  generatePeriodicAIReport
};
