import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "nlesiecki@icloud.com" },
    update: {
      password: adminPassword,
      role: "admin"
    },
    create: {
      email: "nlesiecki@icloud.com",
      password: adminPassword,
      role: "admin",
      name: "Admin"
    }
  })

  // Create test customer user
  const customerPassword = await bcrypt.hash("customer123", 10)
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {
      password: customerPassword,
      role: "customer"
    },
    create: {
      email: "customer@example.com",
      password: customerPassword,
      role: "customer",
      name: "Test Customer"
    }
  })

  console.log("Created users:")
  console.log("Admin:", admin)
  console.log("Customer:", customer)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 