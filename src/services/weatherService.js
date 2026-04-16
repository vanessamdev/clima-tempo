const httpClient = require('../utils/httpClient');
const config = require('../config');
const cache = require('../utils/cache');

// Busca o clima atual baseado em latitude e longitude
// Agora com CACHE para evitar chamadas repetidas à API
async function getCurrentWeather(latitude, longitude) {
  // Cria uma chave única para o cache baseada nas coordenadas
  // Arredondamos para 2 casas decimais para agrupar locais próximos
  const chaveCache = `clima:${latitude.toFixed(2)},${longitude.toFixed(2)}`;

  // 1. Tenta buscar do cache primeiro
  const dadosCache = cache.buscar(chaveCache);
  if (dadosCache) {
    return dadosCache; // Retorna do cache (rápido!)
  }

  // 2. Não está no cache, busca na API
  const url = `${config.WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
  
  const data = await httpClient.get(url);
  
  if (!data.current) {
    throw new Error('Não foi possível obter dados do clima');
  }
  
  const resultado = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code
  };

  // 3. Salva no cache para próximas requisições
  cache.salvar(chaveCache, resultado);

  return resultado;
}

module.exports = { getCurrentWeather };
