// Configurações da aplicação
module.exports = {
  PORT: process.env.PORT || 3000,
  
  // URLs da API Open-Meteo
  GEOCODING_API_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  WEATHER_API_URL: 'https://api.open-meteo.com/v1/forecast'
};
