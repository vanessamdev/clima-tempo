const httpClient = require('../utils/httpClient');
const config = require('../config');

// Busca o clima atual baseado em latitude e longitude
async function getCurrentWeather(latitude, longitude) {
  const url = `${config.WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
  
  const data = await httpClient.get(url);
  
  if (!data.current) {
    throw new Error('Não foi possível obter dados do clima');
  }
  
  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code
  };
}

module.exports = { getCurrentWeather };
