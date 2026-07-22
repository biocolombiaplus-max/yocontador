import bcrypt from "bcryptjs";
import { PrismaClient, SocialPlatform } from "../src/generated/prisma";

const prisma = new PrismaClient();

const COMPANIES = [
  {
    slug: "biosoft",
    name: "Biosoft",
    sector: "Software para laboratorio clinico",
    description:
      "Software especializado para la gestion integral de laboratorios clinicos: ordenes, resultados, facturacion e interoperabilidad.",
    colorHex: "#0EA5A4",
  },
  {
    slug: "biofutbol",
    name: "BioFutbol",
    sector: "Tecnologia deportiva con IA",
    description:
      "Aplicacion con inteligencia artificial para la administracion de clubes y escuelas de futbol: jugadores, entrenamientos y desempeno.",
    colorHex: "#16A34A",
  },
  {
    slug: "biomarketing",
    name: "Biomarketing",
    sector: "Marketing digital para salud",
    description:
      "Agencia especialista en aumentar ventas y captacion de pacientes para negocios del sector salud.",
    colorHex: "#DB2777",
  },
  {
    slug: "biosalud",
    name: "Biosalud",
    sector: "Equipos medicos y de laboratorio",
    description:
      "Venta de equipos medicos, de laboratorio y de rayos X, y soluciones integrales para el sector salud.",
    colorHex: "#2563EB",
  },
];

const PLATFORMS: SocialPlatform[] = ["FACEBOOK", "INSTAGRAM", "WHATSAPP", "TIKTOK"];

async function main() {
  const passwordJuanCarlos = await bcrypt.hash("88262856", 10);
  const passwordNicol = await bcrypt.hash("1127052812", 10);

  await prisma.user.upsert({
    where: { cedula: "88262856" },
    update: {},
    create: {
      cedula: "88262856",
      name: "Juan Carlos Caceres",
      role: "PROPIETARIO",
      passwordHash: passwordJuanCarlos,
      mustChangePassword: true,
      avatarColor: "#0EA5A4",
    },
  });

  await prisma.user.upsert({
    where: { cedula: "1127052812" },
    update: {},
    create: {
      cedula: "1127052812",
      name: "Nicol Bustos",
      role: "ADMINISTRADORA",
      passwordHash: passwordNicol,
      mustChangePassword: true,
      avatarColor: "#DB2777",
    },
  });

  for (let i = 0; i < COMPANIES.length; i++) {
    const c = COMPANIES[i];
    const company = await prisma.company.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, order: i },
    });

    for (const platform of PLATFORMS) {
      await prisma.socialAccount.upsert({
        where: { companyId_platform: { companyId: company.id, platform } },
        update: {},
        create: {
          companyId: company.id,
          platform,
          handle: `@${c.slug}`,
          status: "PENDIENTE",
          followers: 0,
        },
      });
    }

    const today = new Date();
    const latestFollowers: Partial<Record<SocialPlatform, number>> = {};

    for (let week = 11; week >= 0; week--) {
      const date = new Date(today);
      date.setDate(date.getDate() - week * 7);
      date.setHours(0, 0, 0, 0);

      for (const platform of ["FACEBOOK", "INSTAGRAM"] as SocialPlatform[]) {
        const base = 400 + i * 250 + (platform === "INSTAGRAM" ? 180 : 0);
        const growth = (11 - week) * (18 + i * 6);
        const wiggle = Math.round(Math.sin(week + i) * 12);
        const followers = base + growth + wiggle;
        latestFollowers[platform] = followers;

        await prisma.statSnapshot.upsert({
          where: {
            companyId_platform_date: { companyId: company.id, platform, date },
          },
          update: {},
          create: {
            companyId: company.id,
            platform,
            date,
            followers,
            engagementRate: Number((2.1 + Math.random() * 3.2).toFixed(2)),
            reach: Math.round((base + growth) * (3.5 + Math.random())),
            postsCount: Math.round(2 + Math.random() * 4),
          },
        });
      }
    }

    for (const platform of ["FACEBOOK", "INSTAGRAM"] as SocialPlatform[]) {
      const followers = latestFollowers[platform];
      if (followers === undefined) continue;
      await prisma.socialAccount.update({
        where: { companyId_platform: { companyId: company.id, platform } },
        data: { followers, status: "CONECTADA", connectedAt: today },
      });
    }
  }

  console.log("Seed completado: 2 usuarios, 4 empresas, cuentas sociales y estadisticas demo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
