import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const trip = await prisma.trip.findFirst({ where: { status: 'PUBLISHED' } });
  console.log('Admin:', admin ? 'Found' : 'Missing');
  console.log('Trip:', trip ? 'Found' : 'Missing');
}

main().catch(console.error).finally(() => prisma.$disconnect());
