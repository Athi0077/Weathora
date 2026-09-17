export const getWeatherIconUrl = (iconCode) => {
  if (!iconCode) return null;
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getWeatherInsight = (weather) => {
  if (!weather) return '';
  
  const { condition, temperature, rainChance = 0, windSpeed } = weather;
  
  if (rainChance > 50) {
    return "High chance of rain today. Consider planning indoor activities or carrying an umbrella.";
  }
  if (rainChance > 20) {
    return "Slight chance of rain. Keep an eye on the sky if you're heading out.";
  }
  if (temperature > 35) {
    return "High temperature today. Carry water and avoid prolonged outdoor activity during peak afternoon hours.";
  }
  if (temperature < 10) {
    return "It's quite cold today. Dress warmly if you plan to be outdoors.";
  }
  if (windSpeed > 30) {
    return "Strong winds expected today. Not ideal for lightweight outdoor setups.";
  }
  if (condition === 'Clear' || condition === 'Clouds') {
    return "Good weather for outdoor activities today.";
  }
  
  return "Typical conditions for the area today.";
};

export const groupForecastByDay = (forecastList) => {
  if (!forecastList || forecastList.length === 0) return [];
  
  const grouped = {};
  
  forecastList.forEach(item => {
    // dt_txt format: "YYYY-MM-DD HH:MM:SS"
    const date = item.dateText.split(' ')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  
  const dailySummary = Object.keys(grouped).map(date => {
    const dayData = grouped[date];
    
    // Find min and max temp
    let minTemp = dayData[0].temperature;
    let maxTemp = dayData[0].temperature;
    
    // Find representative condition (middle of the day around 12:00 if possible, or just first)
    let repCondition = dayData[0].condition;
    let repIcon = dayData[0].icon;
    let maxRain = 0;
    
    dayData.forEach(item => {
      if (item.temperature < minTemp) minTemp = item.temperature;
      if (item.temperature > maxTemp) maxTemp = item.temperature;
      if (item.rainChance > maxRain) maxRain = item.rainChance;
      
      if (item.dateText.includes('12:00:00')) {
        repCondition = item.condition;
        repIcon = item.icon;
      }
    });
    
    // Convert to day name
    const dateObj = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    if (dateObj.toDateString() === today.toDateString()) {
      dayName = 'Today';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      dayName = 'Tomorrow';
    }
    
    return {
      date,
      dayName,
      minTemp,
      maxTemp,
      condition: repCondition,
      icon: repIcon,
      rainChance: maxRain,
      hourlyData: dayData
    };
  });
  
  return dailySummary.slice(0, 5); // Return up to 5 days
};

