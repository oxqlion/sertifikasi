const { PrismaClient } = require('@prisma/client');

console.log('PrismaClient:', PrismaClient);

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

console.log('Prisma instance created successfully!');

prisma.$connect()
  .then(() => {
    console.log('Connected to database!');
    return prisma.$disconnect();
  })
  .catch((error) => {
    console.error('Error:', error);
  });