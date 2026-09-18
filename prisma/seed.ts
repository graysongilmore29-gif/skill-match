import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { STARTING_BALANCE_CENTS } from "../src/lib/money";

const prisma = new PrismaClient();

async function upsertDemo(email: string, displayName: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { displayName, passwordHash, isBot: false },
    create: {
      email,
      displayName,
      passwordHash,
      wallet: { create: { balanceCents: STARTING_BALANCE_CENTS } },
    },
  });
  await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, balanceCents: STARTING_BALANCE_CENTS },
  });
}

async function main() {
  await upsertDemo("alex@demo.local", "Alex", "demo1234");
  await upsertDemo("jordan@demo.local", "Jordan", "demo1234");
  console.log("Seeded demo players: alex@demo.local and jordan@demo.local (demo1234)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
