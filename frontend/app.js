/**
 * CLIMA TEMPO - Frontend
 * 
 * Este arquivo controla toda a lógica do frontend:
 * - Captura o envio do formulário
 * - Faz requisições para a API backend
 * - Atualiza a interface com os dados recebidos
 */

// ==========================================
// CONFIGURAÇÃO
// ==========================================

// URL base da API (backend rodando localmente)
const API_BASE_URL = 'http://localhost:3000';

// ==========================================
// ELEMENTOS DO DOM
// ==========================================

// Formulário e input
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');

// Áreas de estado (loading, erro, resultado)
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const weatherResult = document.getElementById('weather-result');
const forecastEl = document.getElementById('forecast');

// Elementos de dados do clima
const cityName = document.getElementById('city-name');
const country = document.getElementById('country');
const tempValue = document.getElementById('temp-value');
const weatherCondition = document.getElementById('weather-condition');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecastList = document.getElementById('forecast-list');

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Mostra um elemento removendo a classe 'hidden'
 * @param {HTMLElement} element - Elemento a ser mostrado
 */
function show(element) {
  element.classList.remove('hidden');
}

/**
 * Esconde um elemento adicionando a classe 'hidden'
 * @param {HTMLElement} element - Elemento a ser escondido
 */
function hide(element) {
  element.classList.add('hidden');
}

/**
 * Esconde todas as áreas de estado (loading, erro, resultado)
 */
function hideAllStates() {
  hide(loadingEl);
  hide(errorEl);
  hide(weatherResult);
  hide(forecastEl);
}

/**
 * Mostra mensagem de erro na interface
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
  hideAllStates();
  errorMessage.textContent = message;
  show(errorEl);
}

/**
 * Traduz código do clima para descrição em português
 * @param {number} code - Código WMO do clima
 * @returns {string} Descrição em português
 */
function translateWeatherCode(code) {
  const descriptions = {
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
    80: 'Pancadas de chuva',
    81: 'Pancadas moderadas',
    82: 'Pancadas fortes',
    95: 'Tempestade',
    96: 'Tempestade com granizo',
    99: 'Tempestade severa'
  };
  return descriptions[code] || 'Condição desconhecida';
}

/**
 * Formata o dia da semana a partir de uma data
 * @param {string} dateStr - Data no formato YYYY-MM-DD
 * @returns {string} Dia da semana abreviado
 */
function formatDayOfWeek(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Se for hoje
  if (date.getTime() === today.getTime()) {
    return 'Hoje';
  }
  
  // Se for amanhã
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.getTime() === tomorrow.getTime()) {
    return 'Amanhã';
  }
  
  // Outros dias
  return date.toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '')
    .replace(/^\w/, c => c.toUpperCase());
}

// ==========================================
// FUNÇÕES DE API
// ==========================================

/**
 * Busca o clima atual de uma cidade
 * @param {string} city - Nome da cidade
 * @returns {Promise<Object>} Dados do clima
 */
async function fetchWeather(city) {
  const response = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(city)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar clima');
  }
  
  return response.json();
}

/**
 * Busca a previsão de 5 dias de uma cidade
 * @param {string} city - Nome da cidade
 * @returns {Promise<Object>} Dados da previsão
 */
async function fetchForecast(city) {
  const response = await fetch(`${API_BASE_URL}/forecast/${encodeURIComponent(city)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar previsão');
  }
  
  return response.json();
}

// ==========================================
// FUNÇÕES DE RENDERIZAÇÃO
// ==========================================

/**
 * Atualiza a interface com os dados do clima atual
 * @param {Object} data - Dados retornados pela API
 */
function renderWeather(data) {
  // Extrai temperatura (remove o °C se vier da API)
  const temp = data.weather.temperature.toString().replace('°C', '');
  
  // Atualiza os elementos
  cityName.textContent = data.location.name;
  country.textContent = data.location.country;
  tempValue.textContent = Math.round(parseFloat(temp));
  weatherCondition.textContent = translateWeatherCode(data.weather.weatherCode);
  humidity.textContent = data.weather.humidity;
  wind.textContent = data.weather.windSpeed;
  
  // Mostra o resultado
  show(weatherResult);
}

/**
 * Atualiza a interface com a previsão de 5 dias
 * @param {Object} data - Dados retornados pela API
 */
function renderForecast(data) {
  // Limpa a lista atual
  forecastList.innerHTML = '';
  
  // Cria um item para cada dia
  data.previsao.forEach(day => {
    const item = document.createElement('div');
    item.className = 'forecast-item';
    
    item.innerHTML = `
      <span class="forecast-day">${formatDayOfWeek(day.data)}</span>
      <span class="forecast-condition">${day.condicao}</span>
      <div class="forecast-temps">
        <span class="temp-max">${day.temperaturaMaxima}</span>
        <span class="temp-min">${day.temperaturaMinima}</span>
      </div>
    `;
    
    forecastList.appendChild(item);
  });
  
  // Mostra a previsão
  show(forecastEl);
}

// ==========================================
// EVENTO PRINCIPAL - BUSCA
// ==========================================

/**
 * Manipula o envio do formulário de busca
 * @param {Event} event - Evento de submit
 */
async function handleSearch(event) {
  // Previne o reload da página
  event.preventDefault();
  
  // Pega o valor do input e remove espaços extras
  const city = cityInput.value.trim();
  
  // Validação básica
  if (!city) {
    showError('Por favor, digite o nome de uma cidade');
    return;
  }
  
  // Mostra loading
  hideAllStates();
  show(loadingEl);
  
  try {
    // Busca clima atual e previsão em paralelo
    const [weatherData, forecastData] = await Promise.all([
      fetchWeather(city),
      fetchForecast(city)
    ]);
    
    // Esconde loading
    hide(loadingEl);
    
    // Renderiza os dados
    renderWeather(weatherData);
    renderForecast(forecastData);
    
  } catch (error) {
    // Mostra erro
    console.error('Erro:', error);
    showError(error.message || 'Não foi possível buscar o clima. Tente novamente.');
  }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Adiciona o evento de submit ao formulário
searchForm.addEventListener('submit', handleSearch);

// Foca no input ao carregar a página
cityInput.focus();

// Log para confirmar que o script carregou
console.log('🌤️ Clima Tempo - Frontend carregado!');
