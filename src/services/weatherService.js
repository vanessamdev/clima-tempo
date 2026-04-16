/**
 * @fileoverview Serviço de Clima
 * @description Busca dados meteorológicos atuais e previsão usando a API Open-Meteo
 * @module services/weatherService
 */

const httpClient = require('../utils/httpClient');
const config = require('../config');
const cache = require('../utils/cache');

/**
 * @typedef {Object} CurrentWeather
 * @property {number} temperature - Temperatura atual em Celsius
 * @property {number} humidity - Umidade relativa em porcentagem
 * @property {number} windSpeed - Velocidade do vento em km/h
 * @property {number} weatherCode - Código WMO da condição climática
 */

/**
 * @typedef {Object} DayForecast
 * @property {string} data - Data no formato YYYY-MM-DD
 * @property {string} diaSemana - Nome do dia da semana em português
 * @property {string} temperaturaMaxima - Temperatura máxima formatada (ex: "28°C")
 * @property {string} temperaturaMinima - Temperatura mínima formatada (ex: "18°C")
 * @property {string} condicao - Descrição da condição climática em português
 * @property {number} codigoClima - Código WMO da condição climática
 */

/**
 * Busca o clima atual baseado em coordenadas geográficas.
 * Implementa cache para evitar chamadas repetidas à API.
 * 
 * @async
 * @function getCurrentWeather
 * @param {number} latitude - Latitude em graus decimais (ex: -23.55)
 * @param {number} longitude - Longitude em graus decimais (ex: -46.63)
 * @returns {Promise<CurrentWeather>} Dados do clima atual
 * 
 * @throws {Error} "Não foi possível obter dados do clima" - Quando a API não retorna dados
 * @throws {Error} Erro de rede - Quando há falha na comunicação com a API
 * 
 * @example
 * const weather = await getCurrentWeather(-23.55, -46.63);
 * console.log(weather);
 * // {
 * //   temperature: 22.5,
 * //   humidity: 65,
 * //   windSpeed: 12.3,
 * //   weatherCode: 2
 * // }
 */
async function getCurrentWeather(latitude, longitude) {
  const chaveCache = `clima:${latitude.toFixed(2)},${longitude.toFixed(2)}`;

  // Tenta buscar do cache primeiro
  const dadosCache = cache.buscar(chaveCache);
  if (dadosCache) {
    return dadosCache;
  }

  // Busca na API
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

  // Salva no cache
  cache.salvar(chaveCache, resultado);

  return resultado;
}

/**
 * Traduz o código WMO de condição climática para descrição em português.
 * 
 * @function traduzirCodigoClima
 * @param {number} codigo - Código WMO (0-99) da condição climática
 * @returns {string} Descrição da condição em português
 * 
 * @example
 * traduzirCodigoClima(0);  // "Céu limpo"
 * traduzirCodigoClima(61); // "Chuva leve"
 * traduzirCodigoClima(95); // "Tempestade"
 * traduzirCodigoClima(999); // "Condição desconhecida"
 * 
 * @see {@link https://open-meteo.com/en/docs#weathervariables|WMO Weather Codes}
 */
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

/**
 * Busca a previsão do tempo para os próximos 5 dias.
 * Implementa cache para evitar chamadas repetidas à API.
 * 
 * @async
 * @function getForecast
 * @param {number} latitude - Latitude em graus decimais
 * @param {number} longitude - Longitude em graus decimais
 * @returns {Promise<DayForecast[]>} Array com previsão de 5 dias
 * 
 * @throws {Error} "Não foi possível obter previsão do tempo" - Quando a API não retorna dados
 * @throws {Error} Erro de rede - Quando há falha na comunicação com a API
 * 
 * @example
 * const forecast = await getForecast(-23.55, -46.63);
 * console.log(forecast[0]);
 * // {
 * //   data: "2026-04-16",
 * //   diaSemana: "quinta-feira",
 * //   temperaturaMaxima: "28°C",
 * //   temperaturaMinima: "19°C",
 * //   condicao: "Parcialmente nublado",
 * //   codigoClima: 2
 * // }
 */
async function getForecast(latitude, longitude) {
  const chaveCache = `previsao:${latitude.toFixed(2)},${longitude.toFixed(2)}`;

  // Tenta buscar do cache
  const dadosCache = cache.buscar(chaveCache);
  if (dadosCache) {
    return dadosCache;
  }

  // Busca na API
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
