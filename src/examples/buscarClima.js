/**
 * FUNÇÃO PARA BUSCAR CLIMA DE UMA CIDADE
 * 
 * Este arquivo demonstra como:
 * 1. Converter nome de cidade em coordenadas (geocoding)
 * 2. Usar essas coordenadas para buscar o clima atual
 * 
 * APIs utilizadas (gratuitas, sem necessidade de chave):
 * - Geocoding: https://geocoding-api.open-meteo.com
 * - Weather: https://api.open-meteo.com
 */

// ============================================
// FUNÇÃO PRINCIPAL - BUSCAR CLIMA POR CIDADE
// ============================================

async function buscarClimaPorCidade(nomeCidade) {
  // Validação: verifica se o nome da cidade foi informado
  if (!nomeCidade || nomeCidade.trim() === '') {
    throw new Error('O nome da cidade é obrigatório');
  }

  try {
    // PASSO 1: Converter cidade em coordenadas
    // Precisamos de latitude e longitude para buscar o clima
    const coordenadas = await buscarCoordenadas(nomeCidade);

    // PASSO 2: Buscar clima usando as coordenadas
    const clima = await buscarClimaAtual(
      coordenadas.latitude,
      coordenadas.longitude
    );

    // PASSO 3: Montar e retornar o objeto final
    return {
      sucesso: true,
      cidade: {
        nome: coordenadas.nome,
        pais: coordenadas.pais,
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude
      },
      clima: {
        temperatura: clima.temperatura,
        umidade: clima.umidade,
        ventoVelocidade: clima.ventoVelocidade,
        descricao: clima.descricao
      },
      atualizadoEm: new Date().toLocaleString('pt-BR')
    };

  } catch (erro) {
    // Retorna objeto de erro padronizado
    return {
      sucesso: false,
      erro: erro.message
    };
  }
}

// ============================================
// FUNÇÃO AUXILIAR 1 - BUSCAR COORDENADAS
// ============================================

async function buscarCoordenadas(nomeCidade) {
  // Monta a URL da API de geocoding
  // encodeURIComponent: converte caracteres especiais (ex: "São Paulo" → "S%C3%A3o%20Paulo")
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt`;

  // Faz a requisição HTTP
  const resposta = await fetch(url);

  // Verifica se a requisição foi bem sucedida (status 200-299)
  if (!resposta.ok) {
    throw new Error(`Erro na API de geocoding: ${resposta.status}`);
  }

  // Converte a resposta para JSON
  const dados = await resposta.json();

  // Verifica se encontrou algum resultado
  // A API retorna { results: [...] } quando encontra
  // ou { } (objeto vazio) quando não encontra
  if (!dados.results || dados.results.length === 0) {
    throw new Error(`Cidade "${nomeCidade}" não encontrada`);
  }

  // Pega o primeiro resultado (mais relevante)
  const cidade = dados.results[0];

  // Retorna apenas os dados que precisamos
  return {
    nome: cidade.name,
    pais: cidade.country,
    latitude: cidade.latitude,
    longitude: cidade.longitude
  };
}

// ============================================
// FUNÇÃO AUXILIAR 2 - BUSCAR CLIMA ATUAL
// ============================================

async function buscarClimaAtual(latitude, longitude) {
  // Monta a URL da API de clima
  // current= define quais dados queremos receber
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

  // Faz a requisição HTTP
  const resposta = await fetch(url);

  // Verifica se a requisição foi bem sucedida
  if (!resposta.ok) {
    throw new Error(`Erro na API de clima: ${resposta.status}`);
  }

  // Converte a resposta para JSON
  const dados = await resposta.json();

  // Verifica se os dados de clima estão presentes
  if (!dados.current) {
    throw new Error('Dados de clima não disponíveis');
  }

  // Retorna os dados formatados
  return {
    temperatura: `${dados.current.temperature_2m}°C`,
    umidade: `${dados.current.relative_humidity_2m}%`,
    ventoVelocidade: `${dados.current.wind_speed_10m} km/h`,
    descricao: traduzirCodigoClima(dados.current.weather_code)
  };
}

// ============================================
// FUNÇÃO AUXILIAR 3 - TRADUZIR CÓDIGO DO CLIMA
// ============================================

function traduzirCodigoClima(codigo) {
  // A API retorna um código numérico (WMO Weather Code)
  // Esta função traduz para texto legível em português
  const descricoes = {
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
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva fortes',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte'
  };

  // Retorna a descrição ou "Desconhecido" se o código não existir
  return descricoes[codigo] || 'Condição desconhecida';
}

// ============================================
// EXEMPLOS DE USO
// ============================================

// Exemplo 1: Busca simples
async function exemplo1() {
  console.log('--- Exemplo 1: Busca simples ---');
  const resultado = await buscarClimaPorCidade('São Paulo');
  console.log(resultado);
}

// Exemplo 2: Tratando cidade não encontrada
async function exemplo2() {
  console.log('\n--- Exemplo 2: Cidade inexistente ---');
  const resultado = await buscarClimaPorCidade('CidadeQueNaoExiste123');
  console.log(resultado);
}

// Exemplo 3: Múltiplas cidades
async function exemplo3() {
  console.log('\n--- Exemplo 3: Múltiplas cidades ---');
  const cidades = ['Rio de Janeiro', 'Lisboa', 'Tokyo'];
  
  for (const cidade of cidades) {
    const resultado = await buscarClimaPorCidade(cidade);
    if (resultado.sucesso) {
      console.log(`${resultado.cidade.nome}: ${resultado.clima.temperatura} - ${resultado.clima.descricao}`);
    }
  }
}

// Executa os exemplos
async function executarExemplos() {
  await exemplo1();
  await exemplo2();
  await exemplo3();
}

// Descomente a linha abaixo para executar:
// executarExemplos();

// Exporta a função principal para uso em outros arquivos
module.exports = { buscarClimaPorCidade };
