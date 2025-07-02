const { execSync } = require('child_process');

async function setupTestDatabase() {
  try {
    console.log('🗄️ Configurando banco de dados de teste...');
    
    // Resetar o banco de teste
    console.log('🔄 Resetando banco de dados...');
    execSync('npx prisma migrate reset --force', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });
    
    // Criar migração inicial se não existir
    console.log('📝 Criando migração inicial...');
    execSync('npx prisma migrate dev --name init --create-only', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });
    
    // Aplicar migrações
    console.log('🚀 Aplicando migrações...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });
    
    // Gerar cliente Prisma
    console.log('🔧 Gerando cliente Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('✅ Banco de dados de teste configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de teste:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupTestDatabase();
}

module.exports = { setupTestDatabase }; 