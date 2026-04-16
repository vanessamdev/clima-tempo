// Carrega as variáveis do arquivo .env para process.env
// IMPORTANTE: Esta linha deve vir ANTES de usar qualquer process.env
require('dotenv').config();

/**
 * CONFIGURAÇÕES DA APLICAÇÃO
 * 
 * Todas as configurações vêm de variáveis de ambiente.
 * Isso permite:
 * - Mudar configurações sem alterar código
 * - Ter configurações diferentes por ambiente (dev, prod)
 * - Manter dados sensíveis fora do repositório
 */
module.exports = {
  // Porta do servidor (padrão: 3000)
  PORT: process.env.PORT || 3000,

  // URLs das APIs
  GEOCODING_API_URL: process.env.GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search',
  WEATHER_API_URL: process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast',

  // Tempo de expiração do cache em minutos
  CACHE_EXPIRATION_MINUTES: parseInt(process.env.CACHE_EXPIRATION_MINUTES) || 10,

  // Exemplo: se tivesse uma API com chave
  // API_KEY: process.env.API_KEY
};
