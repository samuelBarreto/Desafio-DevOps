require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./database/connection');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

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
    message: 'API está funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.VERSION || '0.0.1',
  });
});

// Rotas da API
app.use('/api/users', userRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bem-vindo à API REST do Desafio DevOps!',
    version: process.env.VERSION || '0.0.1',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    endpoints: {
      health: '/health',
      users: '/api/users',
    },
    documentation: {
      users: {
        'GET /api/users': 'Listar todos os usuários',
        'GET /api/users/:id': 'Buscar usuário por ID',
        'POST /api/users': 'Criar novo usuário',
        'PUT /api/users/:id': 'Atualizar usuário',
        'DELETE /api/users/:id': 'Deletar usuário',
      },
    },
  });
});

// Middleware para rotas não encontradas (deve vir antes do error handler)
app.use(notFoundHandler);

// Middleware para tratamento de erros (deve ser o último)
app.use(errorHandler);

// Função para iniciar o servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await connectDB();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`📚 Documentação: http://localhost:${PORT}/`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor apenas se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
