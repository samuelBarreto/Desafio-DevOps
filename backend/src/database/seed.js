const { prisma } = require('./connection');

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Dados de exemplo
    const users = [
      {
        email: 'joao@example.com',
        name: 'João Silva',
        password: 'senha123',
        age: 25,
        active: true,
      },
      {
        email: 'maria@example.com',
        name: 'Maria Santos',
        password: 'senha456',
        age: 30,
        active: true,
      },
      {
        email: 'pedro@example.com',
        name: 'Pedro Oliveira',
        password: 'senha789',
        age: 28,
        active: false,
      },
      {
        email: 'ana@example.com',
        name: 'Ana Costa',
        password: 'senha101',
        age: 22,
        active: true,
      },
      {
        email: 'carlos@example.com',
        name: 'Carlos Ferreira',
        password: 'senha202',
        age: 35,
        active: true,
      },
    ];

    // // Limpar dados existentes
    // await prisma.user.deleteMany({});
    // console.log('🗑️ Dados existentes removidos');

    // Inserir novos dados
    for (const userData of users) {
      await prisma.user.create({
        data: userData,
      });
    }

    console.log(`✅ ${users.length} usuários criados com sucesso!`);

    // Listar usuários criados
    const createdUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        active: true,
      },
    });

    console.log('\n📋 Usuários criados:');
    createdUsers.forEach(user => {
      console.log(
        `- ${user.name} (${user.email}) - ${user.active ? 'Ativo' : 'Inativo'}`,
      );
    });
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed se o arquivo for chamado diretamente
if (require.main === module) {
  seed();
}

module.exports = { seed };
