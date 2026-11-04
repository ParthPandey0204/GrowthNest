const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = require('./client');

async function main() {
  const adminEmail = 'admin@growthnest.com';
  const configuredPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!configuredPassword) throw new Error('SEED_ADMIN_PASSWORD must be set to seed the admin account');
  const adminPassword = await bcrypt.hash(configuredPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      isActive: true,
      isApproved: true,
    },
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      isApproved: true,
    },
  });

  console.log(`Admin user seeded: ${adminUser.email} (${adminUser.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
