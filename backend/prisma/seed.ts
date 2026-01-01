import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const passwordRaw = process.env.ADMIN_PASSWORD;

  if (!email || !passwordRaw) {
    console.error('Error: Debes definir ADMIN_EMAIL y ADMIN_PASSWORD para ejecutar el seed.');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(passwordRaw, salt);

  console.log(`🌱 Creando Super Admin: ${email}...`);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
    },
  });

  console.log(`Usuario creado correctamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });