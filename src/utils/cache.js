/**
 * @fileoverview Sistema de Cache em Memória
 * @description Cache simples com expiração automática para evitar chamadas repetidas à API
 * @module utils/cache
 */

const config = require('../config');

/**
 * @typedef {Object} CacheItem
 * @property {any} dados - Dados armazenados no cache
 * @property {number} timestamp - Momento em que o item foi salvo (ms desde epoch)
 */

/**
 * @typedef {Object} CacheStats
 * @property {number} totalItens - Quantidade de itens no cache
 * @property {string[]} chaves - Lista de todas as chaves armazenadas
 * @property {number} tempoExpiracaoMinutos - Tempo de expiração configurado
 */

/** @type {Map<string, CacheItem>} */
const cache = new Map();

/** Tempo de expiração em milissegundos (configurável via .env) */
const TEMPO_EXPIRACAO_MS = config.CACHE_EXPIRATION_MINUTES * 60 * 1000;

/**
 * Busca um item no cache verificando se ainda é válido.
 * Itens expirados são automaticamente removidos.
 * 
 * @function buscar
 * @param {string} chave - Identificador único do item (ex: "clima:-23.55,-46.63")
 * @returns {any|null} Dados armazenados ou null se não existir/expirado
 * 
 * @example
 * // Item existe e é válido
 * const dados = buscar('clima:São Paulo');
 * if (dados) {
 *   console.log('Cache hit!', dados);
 * }
 * 
 * @example
 * // Item não existe ou expirou
 * const dados = buscar('clima:CidadeNova');
 * if (!dados) {
 *   console.log('Cache miss, buscar na API...');
 * }
 */
function buscar(chave) {
  if (!cache.has(chave)) {
    console.log(`[CACHE] ❌ Miss - "${chave}" não encontrado`);
    return null;
  }

  const item = cache.get(chave);
  const agora = Date.now();
  const tempoDecorrido = agora - item.timestamp;

  if (tempoDecorrido > TEMPO_EXPIRACAO_MS) {
    cache.delete(chave);
    console.log(`[CACHE] ⏰ Expirado - "${chave}" removido (${Math.round(tempoDecorrido / 1000)}s)`);
    return null;
  }

  const tempoRestante = Math.round((TEMPO_EXPIRACAO_MS - tempoDecorrido) / 1000);
  console.log(`[CACHE] ✅ Hit - "${chave}" encontrado (expira em ${tempoRestante}s)`);
  return item.dados;
}

/**
 * Salva um item no cache com timestamp atual.
 * Se a chave já existir, o valor é sobrescrito.
 * 
 * @function salvar
 * @param {string} chave - Identificador único do item
 * @param {any} dados - Dados a serem armazenados (qualquer tipo serializável)
 * @returns {void}
 * 
 * @example
 * // Salvando dados de clima
 * salvar('clima:-23.55,-46.63', {
 *   temperature: 22,
 *   humidity: 65
 * });
 * 
 * @example
 * // Salvando array de previsão
 * salvar('previsao:-23.55,-46.63', [
 *   { data: '2026-04-16', temp: 28 },
 *   { data: '2026-04-17', temp: 26 }
 * ]);
 */
function salvar(chave, dados) {
  cache.set(chave, {
    dados: dados,
    timestamp: Date.now()
  });
  console.log(`[CACHE] 💾 Salvo - "${chave}"`);
}

/**
 * Remove um item específico do cache.
 * 
 * @function remover
 * @param {string} chave - Identificador do item a ser removido
 * @returns {void}
 * 
 * @example
 * remover('clima:-23.55,-46.63');
 */
function remover(chave) {
  cache.delete(chave);
  console.log(`[CACHE] 🗑️ Removido - "${chave}"`);
}

/**
 * Remove todos os itens do cache.
 * Útil para forçar atualização de todos os dados.
 * 
 * @function limpar
 * @returns {void}
 * 
 * @example
 * limpar(); // Remove tudo do cache
 */
function limpar() {
  cache.clear();
  console.log('[CACHE] 🧹 Cache limpo completamente');
}

/**
 * Retorna estatísticas sobre o estado atual do cache.
 * 
 * @function estatisticas
 * @returns {CacheStats} Objeto com informações do cache
 * 
 * @example
 * const stats = estatisticas();
 * console.log(stats);
 * // {
 * //   totalItens: 5,
 * //   chaves: ['clima:-23.55,-46.63', 'previsao:-23.55,-46.63'],
 * //   tempoExpiracaoMinutos: 10
 * // }
 */
function estatisticas() {
  return {
    totalItens: cache.size,
    chaves: Array.from(cache.keys()),
    tempoExpiracaoMinutos: TEMPO_EXPIRACAO_MS / 60000
  };
}

module.exports = {
  buscar,
  salvar,
  remover,
  limpar,
  estatisticas
};
