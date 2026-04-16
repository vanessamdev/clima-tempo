const express = require('express');
const cors = require('cors');
const config = require('./config');
const geocodingService = require('./services/geocodingService');
const weatherService = require('./services/weatherService');

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

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Inicia o servidor
app.listen(config.PORT, () => {
  console.log(`🌤️  Servidor rodando em http://localhost:${config.PORT}`);
});
