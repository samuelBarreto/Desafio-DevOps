const request = require('supertest');
const app = require('../src/server');
const { prisma } = require('../src/database/connection');

// Como o server.js inicia o servidor, precisamos exportar o app do Express separadamente para testes.
// Ajuste em src/server.js pode ser necessário para exportar o app sem iniciar o listen.

describe('API /api/users', () => {
  let server;

  beforeAll(async () => {
    // Iniciar o servidor em modo teste
    process.env.NODE_ENV = 'test';
    server = app.listen(4000);
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
    server.close();
  });

  it('deve criar, listar e deletar um usuário', async () => {
    // Criar usuário
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'senha123',
      age: 22,
    };
    const resCreate = await request(server)
      .post('/api/users')
      .send(userData)
      .expect(201);
    expect(resCreate.body.success).toBe(true);
    expect(resCreate.body.data.email).toBe(userData.email);

    // Listar usuários
    const resList = await request(server).get('/api/users').expect(200);
    expect(resList.body.success).toBe(true);
    expect(resList.body.data.length).toBeGreaterThan(0);

    // Deletar usuário
    const userId = resCreate.body.data.id;
    const resDelete = await request(server)
      .delete(`/api/users/${userId}`)
      .expect(200);
    expect(resDelete.body.success).toBe(true);
  });
});
