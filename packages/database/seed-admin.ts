import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'samx889900@gmail.com';
  const password = '##sunny';
  const fullName = 'Super Admin';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log('SUPER_ADMIN already exists:', email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: 'SUPER_ADMIN',
      isActive: true,
      mustChangePassword: false,
    },
  });

  console.log('Created SUPER_ADMIN:', admin.email, '(id:', admin.id, ')');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
