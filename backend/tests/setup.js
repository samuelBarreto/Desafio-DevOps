const { prisma } = require('../src/database/connection');

beforeAll(async () => {
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
}); 