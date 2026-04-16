/**
 * @fileoverview Serviço de Geocodificação
 * @description Converte nomes de cidades em coordenadas geográficas (latitude/longitude)
 * @module services/geocodingService
 */

const httpClient = require('../utils/httpClient');
const config = require('../config');

/**
 * @typedef {Object} LocationData
 * @property {string} name - Nome da cidade encontrada
 * @property {string} country - País onde a cidade está localizada
 * @property {number} latitude - Latitude em graus decimais
 * @property {number} longitude - Longitude em graus decimais
 */

/**
 * Busca as coordenadas geográficas de uma cidade pelo nome.
 * Utiliza a API de geocodificação da Open-Meteo.
 * 
 * @async
 * @function getCoordinates
 * @param {string} cityName - Nome da cidade a ser buscada (ex: "São Paulo", "Tokyo")
 * @returns {Promise<LocationData>} Objeto contendo nome, país e coordenadas da cidade
 * 
 * @throws {Error} "Cidade não encontrada" - Quando a API não retorna resultados
 * @throws {Error} Erro de rede - Quando há falha na comunicação com a API
 * 
 * @example
 * // Busca coordenadas de São Paulo
 * const location = await getCoordinates('São Paulo');
 * console.log(location);
 * // {
 * //   name: 'São Paulo',
 * //   country: 'Brazil',
 * //   latitude: -23.5475,
 * //   longitude: -46.6361
 * // }
 * 
 * @example
 * // Tratando erro de cidade não encontrada
 * try {
 *   const location = await getCoordinates('CidadeInexistente');
 * } catch (error) {
 *   console.log(error.message); // "Cidade não encontrada"
 * }
 */
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
