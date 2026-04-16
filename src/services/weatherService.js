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

// Traduz código do clima para descrição em português
function traduzirCodigoClima(codigo) {
  const descricoes = {
    0: 'Céu limpo',
    1: 'Predominantemente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve forte',
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva fortes',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte'
  };
  return descricoes[codigo] || 'Condição desconhecida';
}

// Busca previsão de 5 dias
async function getForecast(latitude, longitude) {
  const chaveCache = `previsao:${latitude.toFixed(2)},${longitude.toFixed(2)}`;

  // Tenta buscar do cache
  const dadosCache = cache.buscar(chaveCache);
  if (dadosCache) {
    return dadosCache;
  }

  // Busca na API - daily retorna dados por dia
  const url = `${config.WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`;

  const data = await httpClient.get(url);

  if (!data.daily) {
    throw new Error('Não foi possível obter previsão do tempo');
  }

  // Monta array com previsão de cada dia
  const previsao = data.daily.time.map((date, index) => ({
    data: date,
    diaSemana: new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' }),
    temperaturaMaxima: `${data.daily.temperature_2m_max[index]}°C`,
    temperaturaMinima: `${data.daily.temperature_2m_min[index]}°C`,
    condicao: traduzirCodigoClima(data.daily.weather_code[index]),
    codigoClima: data.daily.weather_code[index]
  }));

  // Salva no cache
  cache.salvar(chaveCache, previsao);

  return previsao;
}

module.exports = { getCurrentWeather, getForecast, traduzirCodigoClima };
