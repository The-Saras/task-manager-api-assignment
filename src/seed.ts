import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Virat', email: 'virat@example.com',password:"password" },
      { name: 'Rohit', email: 'rohit@example.com', password:"password" },
    ],
  });
  console.log('Database has been successfully seeded with users!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
