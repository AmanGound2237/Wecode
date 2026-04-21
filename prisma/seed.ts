import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "krishmannadal@gmail.com";
  const rawPassword = "C#@ngethatineedtobe";

  console.log(`[Seed] Commencing security injection for: ${adminEmail}...`);

  // 1. Hash the production password securely
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  // 2. Upsert the Admin User to prevent duplicates
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: passwordHash,
    },
    create: {
      email: adminEmail,
      name: "Lead Admin",
      passwordHash: passwordHash,
    },
  });

  console.log(`[Seed] SUCCESS: Admin account created/updated with ID: ${admin.id}`);
  console.log(`[Seed] You can now log in at /sign-in with your admin credentials.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
