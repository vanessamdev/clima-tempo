const config = require('../config');

/**
 * SISTEMA DE CACHE SIMPLES
 * 
 * O que é cache?
 * É como uma "memória temporária" que guarda resultados de operações
 * para não precisar repetir a mesma busca várias vezes.
 */

const cache = new Map();

// Tempo de expiração vem da configuração (variável de ambiente)
const TEMPO_EXPIRACAO_MS = config.CACHE_EXPIRATION_MINUTES * 60 * 1000;

/**
 * Busca um item no cache
 * @param {string} chave - Identificador único (ex: "clima:São Paulo")
 * @returns {any|null} - Dados do cache ou null se não existir/expirado
 */
function buscar(chave) {
  // Verifica se a chave existe no cache
  if (!cache.has(chave)) {
    console.log(`[CACHE] ❌ Miss - "${chave}" não encontrado`);
    return null;
  }

  // Pega o item armazenado
  const item = cache.get(chave);

  // Verifica se expirou
  const agora = Date.now();
  const tempoDecorrido = agora - item.timestamp;

  if (tempoDecorrido > TEMPO_EXPIRACAO_MS) {
    // Expirou! Remove do cache e retorna null
    cache.delete(chave);
    console.log(`[CACHE] ⏰ Expirado - "${chave}" removido (${Math.round(tempoDecorrido / 1000)}s)`);
    return null;
  }

  // Cache válido! Retorna os dados
  const tempoRestante = Math.round((TEMPO_EXPIRACAO_MS - tempoDecorrido) / 1000);
  console.log(`[CACHE] ✅ Hit - "${chave}" encontrado (expira em ${tempoRestante}s)`);
  return item.dados;
}

/**
 * Salva um item no cache
 * @param {string} chave - Identificador único
 * @param {any} dados - Dados a serem armazenados
 */
function salvar(chave, dados) {
  cache.set(chave, {
    dados: dados,           // Os dados que queremos guardar
    timestamp: Date.now()   // Momento em que foi salvo
  });
  console.log(`[CACHE] 💾 Salvo - "${chave}"`);
}

/**
 * Remove um item específico do cache
 * @param {string} chave - Identificador do item
 */
function remover(chave) {
  cache.delete(chave);
  console.log(`[CACHE] 🗑️ Removido - "${chave}"`);
}

/**
 * Limpa todo o cache
 */
function limpar() {
  cache.clear();
  console.log('[CACHE] 🧹 Cache limpo completamente');
}

/**
 * Retorna estatísticas do cache
 * @returns {object} - Informações sobre o cache
 */
function estatisticas() {
  return {
    totalItens: cache.size,
    chaves: Array.from(cache.keys()),
    tempoExpiracaoMinutos: TEMPO_EXPIRACAO_MS / 60000
  };
}

// Exporta as funções para uso em outros arquivos
module.exports = {
  buscar,
  salvar,
  remover,
  limpar,
  estatisticas
};
