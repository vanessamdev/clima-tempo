# 🌤️ Clima Tempo

Aplicação fullstack para consulta de clima e previsão do tempo, utilizando a [Open-Meteo API](https://open-meteo.com/).

## 📋 Descrição

Sistema completo com backend em Node.js e frontend responsivo que permite consultar condições climáticas atuais e previsão de 5 dias para qualquer cidade do mundo.

## ✨ Funcionalidades

- **Clima atual** - Temperatura, umidade e velocidade do vento
- **Previsão 5 dias** - Temperaturas máxima/mínima e condição climática
- **Múltiplas cidades** - Busca paralela de várias cidades
- **Cache inteligente** - Evita chamadas repetidas à API (10 minutos)
- **Interface responsiva** - Funciona em desktop e mobile
- **Tradução automática** - Condições climáticas em português

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **dotenv** - Variáveis de ambiente

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo com variáveis CSS
- **JavaScript** - Vanilla JS (sem frameworks)

### API
- **Open-Meteo** - Dados meteorológicos (gratuita, sem chave)

## 📁 Estrutura do Projeto

```
clima-tempo/
├── src/                          # Backend
│   ├── app.js                    # Servidor Express e rotas
│   ├── config/
│   │   └── index.js              # Configurações (dotenv)
│   ├── services/
│   │   ├── geocodingService.js   # Cidade → Coordenadas
│   │   └── weatherService.js     # Clima e previsão
│   ├── utils/
│   │   ├── cache.js              # Cache em memória
│   │   └── httpClient.js         # Cliente HTTP
│   └── examples/
│       └── buscarClima.js        # Exemplo didático
│
├── frontend/                     # Frontend
│   ├── index.html                # Página principal
│   ├── style.css                 # Estilos
│   ├── app.js                    # Lógica JavaScript
│   └── assets/
│       └── image-parque.png      # Imagem de fundo
│
├── .env                          # Variáveis de ambiente (não versionado)
├── .env.example                  # Modelo de configuração
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/vanessamdev/clima-tempo.git
cd clima-tempo

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

## ▶️ Como Executar

### 1. Iniciar o Backend
```bash
npm start
```
O servidor estará disponível em `http://localhost:3000`

### 2. Iniciar o Frontend

**Opção A - Abrir direto no navegador:**
```bash
# Windows
start frontend/index.html

# Mac/Linux
open frontend/index.html
```

**Opção B - Servidor local (recomendado):**
```bash
npx serve frontend -p 5500
# Acesse: http://localhost:5500
```

**Opção C - VS Code Live Server:**
- Clique direito em `frontend/index.html` → "Open with Live Server"

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Instruções de uso |
| GET | `/weather/:cidade` | Clima atual |
| GET | `/forecast/:cidade` | Previsão 5 dias |
| POST | `/weather/multiple` | Várias cidades |
| GET | `/cache/stats` | Estatísticas do cache |
| GET | `/health` | Health check |

## 📝 Exemplos de Uso

### Clima Atual
```
GET http://localhost:3000/weather/São Paulo
```
```json
{
  "location": { "name": "São Paulo", "country": "Brazil" },
  "weather": {
    "temperature": "22°C",
    "humidity": "65%",
    "windSpeed": "12 km/h",
    "weatherCode": 2
  }
}
```

### Previsão 5 Dias
```
GET http://localhost:3000/forecast/Rio de Janeiro
```
```json
{
  "location": { "name": "Rio de Janeiro", "country": "Brazil" },
  "previsao": [
    {
      "data": "2026-04-16",
      "diaSemana": "quinta-feira",
      "temperaturaMaxima": "32°C",
      "temperaturaMinima": "24°C",
      "condicao": "Parcialmente nublado"
    }
  ]
}
```

### Múltiplas Cidades
```bash
POST http://localhost:3000/weather/multiple
Content-Type: application/json

{ "cities": ["São Paulo", "Tokyo", "Lisboa"] }
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `CACHE_EXPIRATION_MINUTES` | Tempo de cache | 10 |

## 🎨 Design do Frontend

- **Cores quentes** - Tons de laranja e amarelo (sol/natureza)
- **Background** - Imagem de parque com overlay escuro
- **Card centralizado** - Bordas arredondadas e sombra suave
- **Responsivo** - Adapta para mobile

## 🔮 Melhorias Futuras

- [ ] Testes automatizados (Jest)
- [ ] Rate limiting
- [ ] Autenticação (JWT)
- [ ] Cache persistente (Redis)
- [ ] Documentação Swagger
- [ ] Docker
- [ ] Deploy em cloud

## 📄 Licença

MIT

## 🙏 Créditos

- [Open-Meteo](https://open-meteo.com/) - API de dados meteorológicos
