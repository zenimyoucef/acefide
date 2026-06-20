import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@ACEFIDE.dz" },
    update: {},
    create: {
      email: "admin@ACEFIDE.dz",
      password: adminPassword,
      name: "Admin ACEFIDE",
      role: "SUPER_ADMIN",
    },
  });

  console.log({ admin });

  // Create site settings
  const settings = [
    { key: "site_name_ar", value: "المركز الجزائري للاستشراف الاقتصادي و تطوير الاستثمار و المقاولاتية" },
    { key: "site_name_en", value: "Algerian Center for Economic Foresight, Investment Development and Entrepreneurship" },
    { key: "site_name_fr", value: "Centre Algérien de Prospective Économique, de Développement de l'Investissement et de l'Entrepreneuriat" },
    { key: "contact_email", value: "contact@ACEFIDE.dz" },
    { key: "contact_phone", value: "+213 (0) XXX XX XX XX" },
    { key: "contact_address_ar", value: "الجزائر العاصمة، الجزائر" },
    { key: "contact_address_en", value: "Algiers, Algeria" },
    { key: "contact_address_fr", value: "Alger, Algérie" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
