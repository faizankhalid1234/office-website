import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_CATEGORIES = [
  { name: "Tea & Refreshments", color: "#f59e0b" },
  { name: "Petrol", color: "#ef4444" },
  { name: "Car Maintenance", color: "#8b5cf6" },
  { name: "Office Rent", color: "#3b82f6" },
  { name: "Electricity", color: "#eab308" },
  { name: "Internet", color: "#06b6d4" },
  { name: "Stationery", color: "#84cc16" },
  { name: "Staff Lunch", color: "#f97316" },
  { name: "Marketing", color: "#ec4899" },
  { name: "Travel", color: "#14b8a6" },
  { name: "Miscellaneous", color: "#6b7280" },
];

async function main() {
  console.log("Seeding database...");

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { ...cat, isDefault: true },
    });
  }

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@hhhusain.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@hhhusain.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const employeePassword = await bcrypt.hash("employee123", 12);
  await prisma.user.upsert({
    where: { email: "employee@hhhusain.com" },
    update: {},
    create: {
      name: "Employee",
      email: "employee@hhhusain.com",
      password: employeePassword,
      role: "EMPLOYEE",
    },
  });

  const now = new Date();
  await prisma.budget.upsert({
    where: {
      month_year: { month: now.getMonth() + 1, year: now.getFullYear() },
    },
    update: {},
    create: {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount: 500000,
    },
  });

  console.log("Seed completed!");
  console.log("Admin: admin@hhhusain.com / admin123");
  console.log("Employee: employee@hhhusain.com / employee123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
