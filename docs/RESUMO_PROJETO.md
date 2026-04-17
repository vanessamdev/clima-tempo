# Resumo do Projeto do Aplicativo Clima Tempo

---

## O que meu app faz:

Meu Aplicativo **Clima Tempo** permite que os usuários verifiquem o clima atual e a previsão de 5 dias de qualquer cidade que eles digitarem. Quando o usuário digita o nome da cidade e clica no botão "Buscar", o app usa a API de Geocodificação da Open-Meteo para encontrar as coordenadas da localização dessa cidade. Em seguida, ele envia essas coordenadas para a API de Previsão do Tempo da Open-Meteo para obter os dados atuais do clima. O app exibe a temperatura, umidade, velocidade do vento e uma descrição das condições climáticas em português, em um formato claro e amigável.

---

## Funcionalidades do App (com Capturas de Tela):

Meu Aplicativo Clima Tempo inclui as seguintes funcionalidades:

- Uma barra de busca para digitar o nome da cidade
- Um botão para buscar as informações do clima
- Uma área de exibição mostrando:
  - Temperatura em Celsius
  - Umidade relativa do ar
  - Velocidade do vento
  - Um resumo curto em texto, como "Parcialmente nublado" ou "Céu limpo"
- Previsão para os próximos 5 dias com temperaturas máxima e mínima
- Suporte para visualizar o clima em várias cidades simultaneamente
- Sistema de cache que evita chamadas repetidas à API
- Mensagem automática exibida quando a cidade não pode ser encontrada ou os dados não podem ser recuperados

**Captura de Tela 1:** Cidade digitada – "São Paulo"

**Captura de Tela 2:** Exibição – "Temperatura: 22°C | Umidade: 65% | Vento: 12 km/h | Clima: Parcialmente nublado"

**Captura de Tela 3:** Previsão 5 dias – Lista com dia da semana, temperatura máxima/mínima e condição

---

## Como Usei IA:

Usei IA para apoiar meu processo de codificação. Ela me ajudou a entender como organizar as etapas do meu app, como primeiro obter a localização e depois buscar os dados do clima. A IA também me ajudou a:

- Estruturar o projeto em camadas (services, utils, config)
- Implementar um sistema de cache em memória
- Escrever funções mais simples e reutilizáveis
- Criar documentação JSDoc completa
- Desenvolver um frontend responsivo com CSS moderno
- Configurar variáveis de ambiente para segurança

Certifiquei-me de ler e entender todas as sugestões e usei apenas o código que compreendi totalmente.

---

## O que Aprendi e o que Foi Desafiador:

Aprendi como trabalhar com APIs e como escrever código JavaScript que responde às ações do usuário. Foi um desafio:

- Gerenciar múltiplas etapas na ordem correta (geocoding → weather)
- Mostrar os resultados somente quando ambas as APIs tinham retornado os dados
- Implementar cache para otimizar performance
- Fazer requisições paralelas com Promise.all para múltiplas cidades
- Criar um design responsivo que funciona em desktop e mobile

Também aprendi a testar diferentes partes do app para garantir que funcionasse corretamente e como tratar erros de forma elegante.

---

## Uma Coisa da Qual Tenho Orgulho:

Tenho orgulho que o app funcione de forma fluida desde a entrada até a saída. Também implementei:

- Um sistema de cache inteligente que evita chamadas desnecessárias à API
- Previsão de 5 dias com tradução automática das condições climáticas para português
- Uma funcionalidade onde os usuários podem verificar o clima para mais de uma cidade simultaneamente
- Um design visual atraente com cores quentes que remetem ao sol e à natureza

---

## Uma Coisa que Eu Melhoraria:

Se eu tivesse mais tempo, melhoraria:

- Adicionar ícones animados para diferentes condições climáticas
- Implementar armazenamento de buscas recentes (histórico)
- Adicionar testes automatizados com Jest
- Implementar autenticação de usuários
- Fazer deploy em cloud (AWS, Heroku ou Vercel)
- Adicionar gráficos de temperatura para a previsão
- Implementar geolocalização automática do usuário

---

## Tecnologias Utilizadas:

| Tecnologia | Uso |
|------------|-----|
| Node.js | Runtime do backend |
| Express | Framework web |
| HTML5 | Estrutura do frontend |
| CSS3 | Estilização responsiva |
| JavaScript | Lógica frontend e backend |
| Open-Meteo API | Dados meteorológicos |
| dotenv | Variáveis de ambiente |

---

## Links do Projeto:

- **Repositório GitHub:** https://github.com/vanessamdev/clima-tempo
- **API utilizada:** https://open-meteo.com/

---

*Documento criado como parte do projeto Clima Tempo*
