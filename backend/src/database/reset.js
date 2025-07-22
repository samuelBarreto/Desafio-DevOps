const { prisma } = require('./connection');

async function resetDatabase() {
  try {
    // Verificar ambiente
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '❌ ERRO: Reset de banco não permitido em ambiente de PRODUÇÃO!'
      );
      console.error(
        '🔒 Por segurança, este comando só pode ser executado em desenvolvimento.'
      );
      process.exit(1);
    }

    console.log('🗑️ Iniciando reset do banco de dados...');
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);

    // Deletar todos os dados da tabela users
    const deletedUsers = await prisma.user.deleteMany({});

    console.log(`✅ ${deletedUsers.count} usuários deletados com sucesso!`);
    console.log('🗄️ Banco de dados limpo e pronto para uso.');
  } catch (error) {
    console.error('❌ Erro durante o reset:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Função para resetar completamente o banco (migrações + dados)
async function resetComplete() {
  try {
    // Verificar ambiente
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '❌ ERRO: Reset completo não permitido em ambiente de PRODUÇÃO!'
      );
      console.error(
        '🔒 Por segurança, este comando só pode ser executado em desenvolvimento.'
      );
      process.exit(1);
    }

    console.log('🔄 Iniciando reset completo do banco de dados...');
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);

    // Deletar todos os dados
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✅ ${deletedUsers.count} usuários deletados`);

    // Resetar migrações (isso vai dropar e recriar o banco)
    console.log('🔄 Resetando migrações...');
    const { execSync } = require('child_process');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });

    console.log('✅ Reset completo realizado com sucesso!');
    console.log('🗄️ Banco de dados recriado e pronto para uso.');
  } catch (error) {
    console.error('❌ Erro durante o reset completo:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Função para mostrar estatísticas do banco
async function showStats() {
  try {
    console.log('📊 Estatísticas do banco de dados:');

    const userCount = await prisma.user.count();
    console.log(`👥 Total de usuários: ${userCount}`);

    const activeUsers = await prisma.user.count({
      where: { active: true },
    });
    console.log(`✅ Usuários ativos: ${activeUsers}`);

    const inactiveUsers = await prisma.user.count({
      where: { active: false },
    });
    console.log(`❌ Usuários inativos: ${inactiveUsers}`);
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar baseado no argumento passado
const command = process.argv[2];

switch (command) {
  case 'reset':
    resetDatabase();
    break;
  case 'reset-complete':
    resetComplete();
    break;
  case 'stats':
    showStats();
    break;
  case 'test-production':
    // Simular ambiente de produção para teste
    process.env.NODE_ENV = 'production';
    console.log('🧪 Testando proteção em ambiente de produção...');
    resetDatabase();
    break;
  default:
    console.log('📋 Comandos disponíveis:');
    console.log(
      '  npm run db:reset        - Deletar todos os dados da tabela (apenas dev)'
    );
    console.log('  npm run db:reset-complete - Reset completo (apenas dev)');
    console.log('  npm run db:stats        - Mostrar estatísticas do banco');
    console.log('  npm run db:test-prod    - Testar proteção em produção');
    break;
}

module.exports = { resetDatabase, resetComplete, showStats };
