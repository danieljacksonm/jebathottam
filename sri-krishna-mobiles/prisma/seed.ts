import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client.js";

const url = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat1 = await prisma.category.upsert({
    where: { slug: "screens" },
    update: {},
    create: { name: "Screens & Displays", slug: "screens" },
  });
  const cat2 = await prisma.category.upsert({
    where: { slug: "batteries" },
    update: {},
    create: { name: "Batteries", slug: "batteries" },
  });
  const cat3 = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: { name: "Accessories", slug: "accessories" },
  });

  const products = [
    { name: "OLED Display - Generic", slug: "oled-display-generic", description: "High-quality replacement OLED display. Compatible with multiple models.", price: 2499, categoryId: cat1.id },
    { name: "LCD Screen - Samsung A Series", slug: "lcd-samsung-a", description: "Original quality LCD for Samsung A series phones.", price: 1899, categoryId: cat1.id },
    { name: "Li-Po Battery 4000mAh", slug: "battery-4000mah", description: "Replacement battery 4000mAh. Check compatibility.", price: 699, categoryId: cat2.id },
    { name: "Back Cover - Matte Black", slug: "back-cover-matte", description: "Durable matte black back cover. Multiple models.", price: 299, categoryId: cat3.id },
    { name: "Charging Cable Type-C", slug: "cable-typec", description: "Fast charging Type-C cable, 1m.", price: 199, categoryId: cat3.id },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, imageUrl: null },
    });
  }
  console.log("Seed done.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
