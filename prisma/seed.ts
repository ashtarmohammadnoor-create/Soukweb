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
    { name: "Minimal Leather Wallet", category: "fashion", description: "Slim full-grain leather wallet with RFID protection.", priceCents: 3900, stock: 22, isFeatured: true, images: ["/uploads/sample-wallet.svg"] },
    { name: "Urban Backpack", category: "travel", description: "Water-resistant everyday backpack with laptop sleeve.", priceCents: 7900, stock: 14, isFeatured: true, images: ["/uploads/sample-backpack.svg"] },
    { name: "Ceramic Coffee Mug", category: "home", description: "Hand-glazed 350ml mug for daily coffee ritual.", priceCents: 1800, stock: 40, isFeatured: true, images: ["/uploads/sample-mug.svg"] },
    { name: "Noise-Isolating Headphones", category: "audio", description: "Comfort fit over-ear headphones with rich bass.", priceCents: 12900, stock: 9, isFeatured: true, images: ["/uploads/sample-headphones.svg"] },
    { name: "Smart Desk Lamp", category: "electronics", description: "Adjustable LED desk lamp with touch dimmer.", priceCents: 5400, stock: 18, isFeatured: true, images: ["/uploads/sample-mug.svg"] },
    { name: "Travel Water Bottle", category: "lifestyle", description: "Insulated stainless bottle for hot and cold drinks.", priceCents: 2600, stock: 34, isFeatured: true, images: ["/uploads/sample-wallet.svg"] },
    { name: "Wireless Mouse", category: "office", description: "Ergonomic wireless mouse with silent click buttons.", priceCents: 3200, stock: 27, isFeatured: true, images: ["/uploads/sample-headphones.svg"] },
    { name: "Notebook Organizer", category: "office", description: "Compact organizer for cables, pens, and notebooks.", priceCents: 4100, stock: 15, isFeatured: true, images: ["/uploads/sample-backpack.svg"] },
    { name: "Portable Phone Stand", category: "electronics", description: "Foldable aluminum stand for phones and mini tablets.", priceCents: 1900, stock: 46, isFeatured: false, images: ["/uploads/sample-wallet.svg"] },
    { name: "Canvas Tote Bag", category: "fashion", description: "Durable daily tote bag with reinforced shoulder straps.", priceCents: 2900, stock: 31, isFeatured: false, images: ["/uploads/sample-backpack.svg"] },
    { name: "Gaming Mouse Pad", category: "gaming", description: "Low-friction gaming pad with anti-slip rubber base.", priceCents: 2100, stock: 28, isFeatured: false, images: ["/uploads/sample-headphones.svg"] },
    { name: "Compact Bluetooth Speaker", category: "audio", description: "Portable speaker with punchy sound and long battery life.", priceCents: 6900, stock: 17, isFeatured: false, images: ["/uploads/sample-mug.svg"] },
    { name: "Kitchen Knife Set", category: "home", description: "5-piece stainless steel knife set with wooden handle.", priceCents: 8800, stock: 12, isFeatured: false, images: ["/uploads/sample-wallet.svg"] },
    { name: "Standing Desk Mat", category: "office", description: "Cushioned anti-fatigue mat for standing desks.", priceCents: 4700, stock: 20, isFeatured: false, images: ["/uploads/sample-backpack.svg"] },
    { name: "Wireless Earbuds", category: "audio", description: "True wireless earbuds with charging case and clear calls.", priceCents: 9900, stock: 19, isFeatured: false, images: ["/uploads/sample-headphones.svg"] },
    { name: "Soft Throw Blanket", category: "home", description: "Lightweight and warm blanket for sofa and bedroom.", priceCents: 3600, stock: 25, isFeatured: false, images: ["/uploads/sample-mug.svg"] },
    { name: "Daily Planner", category: "office", description: "Undated planner for weekly goals and task tracking.", priceCents: 2400, stock: 41, isFeatured: false, images: ["/uploads/sample-wallet.svg"] },
    { name: "Laptop Sleeve", category: "electronics", description: "Padded sleeve for 13-14 inch laptops.", priceCents: 3300, stock: 30, isFeatured: false, images: ["/uploads/sample-backpack.svg"] },
    { name: "Fitness Resistance Bands", category: "lifestyle", description: "Set of 5 resistance bands for home workouts.", priceCents: 2700, stock: 36, isFeatured: false, images: ["/uploads/sample-headphones.svg"] },
    { name: "Car Phone Mount", category: "travel", description: "Secure dashboard mount with adjustable angle.", priceCents: 2200, stock: 29, isFeatured: false, images: ["/uploads/sample-mug.svg"] },
    { name: "Travel Neck Pillow", category: "travel", description: "Memory foam neck pillow for flights and road trips.", priceCents: 3400, stock: 24, isFeatured: false, images: ["/uploads/sample-wallet.svg"] },
    { name: "USB-C Hub 6-in-1", category: "electronics", description: "Multiport hub with HDMI, USB-A, and card reader.", priceCents: 7500, stock: 13, isFeatured: false, images: ["/uploads/sample-backpack.svg"] },
    { name: "Graphic T-Shirt", category: "fashion", description: "Premium cotton t-shirt with minimal graphic print.", priceCents: 3100, stock: 33, isFeatured: false, images: ["/uploads/sample-headphones.svg"] },
    { name: "LED Monitor Light Bar", category: "office", description: "Eye-care monitor lamp with adjustable brightness.", priceCents: 6200, stock: 16, isFeatured: false, images: ["/uploads/sample-mug.svg"] },
    { name: "Smart Plug Mini", category: "electronics", description: "Control home appliances remotely with app scheduling.", priceCents: 2800, stock: 37, isFeatured: false, images: ["/uploads/sample-wallet.svg"] },
    { name: "Reusable Food Container Set", category: "home", description: "BPA-free storage boxes for meal prep and leftovers.", priceCents: 3500, stock: 26, isFeatured: false, images: ["/uploads/sample-backpack.svg"] },
    { name: "Compression Packing Cubes", category: "travel", description: "Space-saving cubes to organize luggage efficiently.", priceCents: 4300, stock: 21, isFeatured: false, images: ["/uploads/sample-mug.svg"] },
    { name: "Minimal Running Cap", category: "fashion", description: "Lightweight breathable cap for sports and outdoor use.", priceCents: 2300, stock: 32, isFeatured: false, images: ["/uploads/sample-headphones.svg"] },
    { name: "Cable Management Kit", category: "office", description: "Clips and straps to keep desk cables neat and tidy.", priceCents: 1700, stock: 44, isFeatured: false, images: ["/uploads/sample-wallet.svg"] },
    { name: "Portable Blender Bottle", category: "lifestyle", description: "USB rechargeable blender bottle for shakes on the go.", priceCents: 8400, stock: 11, isFeatured: false, images: ["/uploads/sample-backpack.svg"] },
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
