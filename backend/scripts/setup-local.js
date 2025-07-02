#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Verificando pré-requisitos para o projeto...\n');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command, name, minVersion = null) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    log(`✅ ${name} encontrado`, 'green');
    
    if (minVersion) {
      const version = output.trim();
      log(`   Versão: ${version}`, 'blue');
    }
    
    return true;
  } catch (error) {
    log(`❌ ${name} não encontrado`, 'red');
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} encontrado`, 'green');
    return true;
  } else {
    log(`❌ ${description} não encontrado`, 'red');
    return false;
  }
}

function createEnvFile() {
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    try {
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ Arquivo .env criado a partir do env.example', 'green');
      log('⚠️  Lembre-se de configurar as variáveis no arquivo .env', 'yellow');
      return true;
    } catch (error) {
      log('❌ Erro ao criar arquivo .env', 'red');
      return false;
    }
  } else if (fs.existsSync(envPath)) {
    log('✅ Arquivo .env já existe', 'green');
    return true;
  } else {
    log('❌ Arquivo env.example não encontrado', 'red');
    return false;
  }
}

function installDependencies() {
  log('\n📦 Instalando dependências...', 'blue');
  try {
    execSync('npm install', { stdio: 'inherit' });
    log('✅ Dependências instaladas com sucesso', 'green');
    return true;
  } catch (error) {
    log('❌ Erro ao instalar dependências', 'red');
    return false;
  }
}

function generatePrismaClient() {
  log('\n🔧 Gerando cliente Prisma...', 'blue');
  try {
    execSync('npm run db:generate', { stdio: 'inherit' });
    log('✅ Cliente Prisma gerado com sucesso', 'green');
    return true;
  } catch (error) {
    log('❌ Erro ao gerar cliente Prisma', 'red');
    return false;
  }
}

function runDatabaseMigrations() {
  log('\n🗄️  Executando migrações do banco...', 'blue');
  try {
    execSync('npm run db:migrate', { stdio: 'inherit' });
    log('✅ Migrações executadas com sucesso', 'green');
    return true;
  } catch (error) {
    log('❌ Erro ao executar migrações', 'red');
    log('⚠️  Verifique se o PostgreSQL está rodando e acessível', 'yellow');
    return false;
  }
}

function runTests() {
  log('\n🧪 Executando testes...', 'blue');
  try {
    execSync('npm test', { stdio: 'inherit' });
    log('✅ Testes executados com sucesso', 'green');
    return true;
  } catch (error) {
    log('❌ Erros nos testes', 'red');
    return false;
  }
}

function runLinting() {
  log('\n📏 Verificando qualidade do código...', 'blue');
  try {
    execSync('npm run code:check', { stdio: 'inherit' });
    log('✅ Verificação de código concluída', 'green');
    return true;
  } catch (error) {
    log('❌ Problemas encontrados no código', 'red');
    log('💡 Execute: npm run code:fix para corrigir automaticamente', 'yellow');
    return false;
  }
}

// Verificações principais
log('🔍 Verificando pré-requisitos do sistema:', 'bold');

const checks = {
  node: checkCommand('node --version', 'Node.js', true),
  npm: checkCommand('npm --version', 'npm', true),
  git: checkCommand('git --version', 'Git', true),
  docker: checkCommand('docker --version', 'Docker (opcional)', true),
};

log('\n📁 Verificando arquivos do projeto:', 'bold');

const fileChecks = {
  packageJson: checkFile('package.json', 'package.json'),
  envExample: checkFile('env.example', 'env.example'),
  prismaSchema: checkFile('prisma/schema.prisma', 'Schema do Prisma'),
  dockerfile: checkFile('Dockerfile', 'Dockerfile'),
};

log('\n⚙️  Configurando ambiente:', 'bold');

const setupSteps = {
  envFile: createEnvFile(),
  dependencies: installDependencies(),
  prismaClient: generatePrismaClient(),
  migrations: runDatabaseMigrations(),
};

log('\n🧪 Verificando qualidade:', 'bold');

const qualityChecks = {
  tests: runTests(),
  linting: runLinting(),
};

// Resumo final
log('\n📊 Resumo da verificação:', 'bold');

const allChecks = { ...checks, ...fileChecks, ...setupSteps, ...qualityChecks };
const passed = Object.values(allChecks).filter(Boolean).length;
const total = Object.keys(allChecks).length;

log(`\n✅ ${passed}/${total} verificações passaram`, passed === total ? 'green' : 'yellow');

if (passed === total) {
  log('\n🎉 Projeto configurado com sucesso!', 'green');
  log('\n🚀 Para iniciar o servidor:', 'blue');
  log('   npm run dev    # Modo desenvolvimento', 'blue');
  log('   npm start      # Modo produção', 'blue');
  
  log('\n📚 Comandos úteis:', 'blue');
  log('   npm run db:studio    # Interface visual do banco', 'blue');
  log('   npm run db:seed      # Popular banco com dados', 'blue');
  log('   npm test             # Executar testes', 'blue');
  log('   npm run code:fix     # Corrigir problemas de código', 'blue');
} else {
  log('\n⚠️  Algumas verificações falharam. Verifique os erros acima.', 'yellow');
  log('\n💡 Dicas para resolver problemas:', 'blue');
  log('   - Instale Node.js 16+ se não estiver instalado', 'blue');
  log('   - Configure o PostgreSQL e verifique a conexão', 'blue');
  log('   - Execute: npm run code:fix para corrigir problemas de código', 'blue');
}

console.log('\n'); 