// Helper para fazer requisições HTTP usando fetch nativo do Node.js 18+
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
