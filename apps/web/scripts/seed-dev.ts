import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dev environment...');

  // 1. Create or ensure Admin exists
  const adminEmail = 'admin@toursbu.local';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        emailVerified: true,
        role: 'ADMIN',
      },
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  // 2. Create or ensure a published trip exists
  const tripSlug = 'test-trip-2026';
  let trip = await prisma.trip.findUnique({ where: { slug: tripSlug } });

  if (!trip) {
    trip = await prisma.trip.create({
      data: {
        title: 'Manali Adventure 2026',
        slug: tripSlug,
        shortDesc: 'A thrilling adventure to the mountains of Manali.',
        description: 'Join us for a 5-day adventure filled with trekking, camping, and breathtaking views.',
        location: 'Manali, Himachal Pradesh',
        status: 'PUBLISHED',
        price: 999900, // 9999.00 INR
        advanceAmount: 200000, // 2000.00 INR
        capacity: 50,
        startDate: new Date('2026-08-15'),
        endDate: new Date('2026-08-20'),
      },
    });
    console.log(`Created published trip: ${trip.title}`);
  } else {
    console.log(`Trip already exists: ${trip.title}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
