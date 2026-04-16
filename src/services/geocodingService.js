const httpClient = require('../utils/httpClient');
const config = require('../config');

// Busca latitude e longitude de uma cidade
async function getCoordinates(cityName) {
  const url = `${config.GEOCODING_API_URL}?name=${encodeURIComponent(cityName)}&count=1&language=pt`;
  
  const data = await httpClient.get(url);
  
  if (!data.results || data.results.length === 0) {
    throw new Error('Cidade não encontrada');
  }
  
  const city = data.results[0];
  
  return {
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude
  };
}

module.exports = { getCoordinates };
