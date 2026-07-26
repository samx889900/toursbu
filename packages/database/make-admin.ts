import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address');
    return;
  }
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found:', email);
    return;
  }
  
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });
  
  console.log('Successfully updated user to ADMIN:', updatedUser.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
