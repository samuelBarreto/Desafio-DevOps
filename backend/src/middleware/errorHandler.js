// Middleware para tratamento de erros
function errorHandler(err, req, res, _next) {
  console.error('Erro não tratado:', err);

  // Se o erro já tem status, usar ele
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Erro padrão do servidor
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

// Middleware para rotas não encontradas
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
