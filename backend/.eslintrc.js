module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // Regras de estilo - Desabilitadas para compatibilidade com Prettier
    'indent': 'off', // Prettier cuida da indentação
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['warn', 'always'], // Prettier cuida dos ponto e vírgula
    'comma-dangle': 'off', // Prettier cuida das vírgulas
    
    // Regras de qualidade
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'off', // Permitir console.log em scripts
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-process-exit': 'off', // Permitir process.exit em scripts
    
    // Regras de Node.js
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    'node/no-unpublished-require': 'off',
    'node/no-missing-require': 'off', // Desabilitar para Prisma
    
    // Regras de segurança
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Regras de consistência
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}; 