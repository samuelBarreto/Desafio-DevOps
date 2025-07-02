// Configuração para testes
module.exports = {
  // Configurações do banco de teste
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:password@localhost:5432/desafio_devops_test_db',
  },

  // Configurações da aplicação
  app: {
    port: process.env.PORT || 4000,
    env: 'test',
  },

  // Timeouts para testes
  timeouts: {
    database: 10000, // 10 segundos
    request: 5000, // 5 segundos
  },
};
