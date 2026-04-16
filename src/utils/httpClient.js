/**
 * @fileoverview Cliente HTTP
 * @description Wrapper para requisições HTTP usando fetch nativo do Node.js 18+
 * @module utils/httpClient
 */

/**
 * Realiza uma requisição HTTP GET e retorna os dados em JSON.
 * 
 * @async
 * @function get
 * @param {string} url - URL completa para a requisição (incluindo query params)
 * @returns {Promise<Object>} Dados da resposta convertidos de JSON para objeto
 * 
 * @throws {Error} "Erro na requisição: {status}" - Quando o servidor retorna status de erro (4xx, 5xx)
 * @throws {Error} Erro de rede - Quando não é possível conectar ao servidor
 * @throws {Error} Erro de parsing - Quando a resposta não é um JSON válido
 * 
 * @example
 * // Requisição simples
 * const data = await get('https://api.example.com/users');
 * console.log(data); // { users: [...] }
 * 
 * @example
 * // Com query parameters
 * const data = await get('https://api.example.com/search?q=teste&limit=10');
 * 
 * @example
 * // Tratando erros
 * try {
 *   const data = await get('https://api.example.com/not-found');
 * } catch (error) {
 *   console.log(error.message); // "Erro na requisição: 404"
 * }
 */
async function get(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro no httpClient:', error.message);
    throw error;
  }
}

module.exports = { get };
