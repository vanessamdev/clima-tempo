const express = require('express');
const cors = require('cors');
const config = require('./config');
const geocodingService = require('./services/geocodingService');
const weatherService = require('./services/weatherService');
const cache = require('./utils/cache');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota principal - busca clima por cidade
app.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!city) {
      return res.status(400).json({ error: 'Nome da cidade é obrigatório' });
    }
    
    // 1. Busca coordenadas da cidade
    const location = await geocodingService.getCoordinates(city);
    
    // 2. Busca clima atual
    const weather = await weatherService.getCurrentWeather(
      location.latitude,
      location.longitude
    );
    
    // 3. Retorna dados combinados
    res.json({
      location: {
        name: location.name,
        country: location.country
      },
      weather: {
        temperature: `${weather.temperature}°C`,
        humidity: `${weather.humidity}%`,
        windSpeed: `${weather.windSpeed} km/h`,
        weatherCode: weather.weatherCode
      }
    });
    
  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rota para múltiplas cidades - busca em PARALELO
app.post('/weather/multiple', async (req, res) => {
  try {
    const { cities } = req.body;

    // Validação
    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ 
        error: 'Envie um array de cidades',
        exemplo: { cities: ['São Paulo', 'Rio de Janeiro', 'Tokyo'] }
      });
    }

    // Limite de 10 cidades por requisição
    if (cities.length > 10) {
      return res.status(400).json({ error: 'Máximo de 10 cidades por requisição' });
    }

    // Função auxiliar para buscar clima de uma cidade
    async function buscarClimaCidade(cityName) {
      try {
        const location = await geocodingService.getCoordinates(cityName);
        const weather = await weatherService.getCurrentWeather(
          location.latitude,
          location.longitude
        );
        return {
          sucesso: true,
          cidade: cityName,
          location: { name: location.name, country: location.country },
          weather: {
            temperature: `${weather.temperature}°C`,
            humidity: `${weather.humidity}%`,
            windSpeed: `${weather.windSpeed} km/h`,
            weatherCode: weather.weatherCode
          }
        };
      } catch (error) {
        return {
          sucesso: false,
          cidade: cityName,
          erro: error.message
        };
      }
    }

    // Promise.all executa TODAS as buscas ao mesmo tempo (paralelo)
    // Isso é muito mais rápido que buscar uma por uma (sequencial)
    const resultados = await Promise.all(
      cities.map(city => buscarClimaCidade(city))
    );

    res.json({
      total: resultados.length,
      sucessos: resultados.filter(r => r.sucesso).length,
      falhas: resultados.filter(r => !r.sucesso).length,
      resultados
    });

  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rota raiz - instruções de uso
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Clima - Open-Meteo',
    uso: {
      buscarClima: 'GET /weather/:cidade',
      buscarVarias: 'POST /weather/multiple',
      exemplo: 'GET /weather/São Paulo',
      healthCheck: 'GET /health',
      cacheStats: 'GET /cache/stats'
    }
  });
});

// Rota de estatísticas do cache
app.get('/cache/stats', (req, res) => {
  res.json(cache.estatisticas());
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Inicia o servidor
app.listen(config.PORT, () => {
  console.log(`🌤️  Servidor rodando em http://localhost:${config.PORT}`);
});
