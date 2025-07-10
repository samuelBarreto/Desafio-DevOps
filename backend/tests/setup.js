const { prisma } = require('../src/database/connection');
const config = require('./config');

beforeAll(async () => {
  // Aguardar um pouco para garantir que o banco esteja pronto
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Limpar dados existentes
  await prisma.user.deleteMany({});

  console.log('🧪 Setup de testes concluído');
}, config.timeouts.database);

afterAll(async () => {
  await prisma.$disconnect();
  console.log('🧹 Limpeza de testes concluída');
});
