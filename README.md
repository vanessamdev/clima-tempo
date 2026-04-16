# 🌤️ Clima Tempo API

API REST para consulta de clima e previsão do tempo, utilizando a [Open-Meteo API](https://open-meteo.com/) como fonte de dados.

## 📋 Descrição

Backend em Node.js que permite consultar condições climáticas atuais e previsão de 5 dias para qualquer cidade do mundo. A aplicação converte automaticamente o nome da cidade em coordenadas geográficas e retorna dados meteorológicos formatados em português.

## ✨ Funcionalidades

- **Clima atual** - Temperatura, umidade e velocidade do vento
- **Previsão 5 dias** - Temperaturas máxima/mínima e condição climática
- **Múltiplas cidades** - Busca paralela de várias cidades em uma requisição
- **Cache inteligente** - Evita chamadas repetidas à API (10 minutos)
- **Tradução automática** - Códigos climáticos traduzidos para português

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Open-Meteo API** - Dados meteorológicos (gratuita, sem chave)
- **dotenv** - Variáveis de ambiente

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/clima-tempo.git
cd clima-tempo

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🚀 Como Usar

### Endpoints Disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Instruções de uso |
| GET | `/weather/:cidade` | Clima atual |
| GET | `/forecast/:cidade` | Previsão 5 dias |
| POST | `/weather/multiple` | Várias cidades |
| GET | `/cache/stats` | Estatísticas do cache |
| GET | `/health` | Health check |

## 📝 Exemplos

### Clima Atual

**Requisição:**
```
GET /weather/São Paulo
```

**Resposta:**
```json
{
  "location": {
    "name": "São Paulo",
    "country": "Brazil"
  },
  "weather": {
    "temperature": "22°C",
    "humidity": "65%",
    "windSpeed": "12 km/h",
    "weatherCode": 2
  }
}
```

### Previsão 5 Dias

**Requisição:**
```
GET /forecast/Rio de Janeiro
```

**Resposta:**
```json
{
  "location": {
    "name": "Rio de Janeiro",
    "country": "Brazil"
  },
  "previsao": [
    {
      "data": "2026-04-16",
      "diaSemana": "quinta-feira",
      "temperaturaMaxima": "32°C",
      "temperaturaMinima": "24°C",
      "condicao": "Parcialmente nublado",
      "codigoClima": 2
    },
    {
      "data": "2026-04-17",
      "diaSemana": "sexta-feira",
      "temperaturaMaxima": "30°C",
      "temperaturaMinima": "23°C",
      "condicao": "Chuva leve",
      "codigoClima": 61
    }
  ]
}
```

### Múltiplas Cidades

**Requisição:**
```bash
POST /weather/multiple
Content-Type: application/json

{
  "cities": ["São Paulo", "Tokyo", "Lisboa"]
}
```

**Resposta:**
```json
{
  "total": 3,
  "sucessos": 3,
  "falhas": 0,
  "resultados": [
    {
      "sucesso": true,
      "cidade": "São Paulo",
      "location": { "name": "São Paulo", "country": "Brazil" },
      "weather": { "temperature": "22°C", "humidity": "65%" }
    },
    {
      "sucesso": true,
      "cidade": "Tokyo",
      "location": { "name": "Tokyo", "country": "Japan" },
      "weather": { "temperature": "18°C", "humidity": "70%" }
    },
    {
      "sucesso": true,
      "cidade": "Lisboa",
      "location": { "name": "Lisbon", "country": "Portugal" },
      "weather": { "temperature": "20°C", "humidity": "55%" }
    }
  ]
}
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `CACHE_EXPIRATION_MINUTES` | Tempo de cache | 10 |
| `GEOCODING_API_URL` | URL da API de geocoding | Open-Meteo |
| `WEATHER_API_URL` | URL da API de clima | Open-Meteo |

## 📁 Estrutura do Projeto

```
src/
├── app.js                 # Servidor Express e rotas
├── config/
│   └── index.js           # Configurações (dotenv)
├── services/
│   ├── geocodingService.js  # Conversão cidade → coordenadas
│   └── weatherService.js    # Busca de clima e previsão
├── utils/
│   ├── cache.js           # Sistema de cache em memória
│   └── httpClient.js      # Cliente HTTP (fetch)
└── examples/
    └── buscarClima.js     # Exemplo didático standalone
```

## 🔮 Melhorias Futuras

- [ ] Adicionar testes automatizados (Jest)
- [ ] Implementar rate limiting
- [ ] Adicionar autenticação (JWT)
- [ ] Cache persistente (Redis)
- [ ] Documentação Swagger/OpenAPI
- [ ] Containerização (Docker)
- [ ] Deploy em cloud (AWS/Heroku)
- [ ] Alertas meteorológicos
- [ ] Histórico de consultas

## 📄 Licença

Este projeto está sob a licença MIT.

## 🙏 Créditos

- [Open-Meteo](https://open-meteo.com/) - API de dados meteorológicos gratuita
