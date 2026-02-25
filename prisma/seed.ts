import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const userPasswordHash = await bcrypt.hash("User123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@webshop.local" },
    update: { passwordHash: adminPasswordHash, role: Role.ADMIN, name: "Store Admin" },
    create: {
      email: "admin@webshop.local",
      name: "Store Admin",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@webshop.local" },
    update: { passwordHash: userPasswordHash, role: Role.USER, name: "Test User" },
    create: {
      email: "user@webshop.local",
      name: "Test User",
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });

  const products = [
    {
      name: "Minimal Leather Wallet",
      description: "Slim full-grain leather wallet with RFID protection.",
      priceCents: 3900,
      stock: 22,
      isFeatured: true,
      images: ["/uploads/sample-wallet.svg"],
    },
    {
      name: "Urban Backpack",
      description: "Water-resistant everyday backpack with laptop sleeve.",
      priceCents: 7900,
      stock: 14,
      isFeatured: true,
      images: ["/uploads/sample-backpack.svg"],
    },
    {
      name: "Ceramic Coffee Mug",
      description: "Hand-glazed 350ml mug for daily coffee ritual.",
      priceCents: 1800,
      stock: 40,
      isFeatured: false,
      images: ["/uploads/sample-mug.svg"],
    },
    {
      name: "Noise-Isolating Headphones",
      description: "Comfort fit over-ear headphones with rich bass.",
      priceCents: 12900,
      stock: 9,
      isFeatured: true,
      images: ["/uploads/sample-headphones.svg"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: slugify(product.name) },
      update: {
        description: product.description,
        priceCents: product.priceCents,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isActive: true,
        images: JSON.stringify(product.images),
      },
      create: {
        slug: slugify(product.name),
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isActive: true,
        currency: "usd",
        images: JSON.stringify(product.images),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
