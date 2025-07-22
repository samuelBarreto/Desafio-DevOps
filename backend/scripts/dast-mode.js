require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());
app.use(cors());

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando! (DAST Mode)',
    timestamp: new Date().toISOString(),
    environment: 'dast-test',
    database: 'disconnected',
  });
});

// Rotas da API (mock para DAST)
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    message: 'Users endpoint (DAST Mode)',
    data: [
      { id: 1, name: 'Test User', email: 'test@example.com' },
    ],
  });
});

app.get('/api/users/:id', (req, res) => {
  res.json({
    success: true,
    message: 'User by ID (DAST Mode)',
    data: { id: req.params.id, name: 'Test User', email: 'test@example.com' },
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bem-vindo à API REST do Desafio DevOps! (DAST Mode)',
    version: '1.0.0',
    mode: 'dast-test',
    endpoints: {
      health: '/health',
      users: '/api/users',
    },
    documentation: {
      users: {
        'GET /api/users': 'Listar todos os usuários (Mock)',
        'GET /api/users/:id': 'Buscar usuário por ID (Mock)',
        'POST /api/users': 'Criar novo usuário (Mock)',
        'PUT /api/users/:id': 'Atualizar usuário (Mock)',
        'DELETE /api/users/:id': 'Deletar usuário (Mock)',
      },
    },
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl,
  });
});

// Middleware para tratamento de erros
app.use((error, req, res, _next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 DAST Mode Server running on port ${PORT}`);
  console.log('📊 Environment: DAST Test Mode');
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app; 