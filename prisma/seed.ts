import bcrypt from "bcryptjs";
import { PrismaClient, SocialPlatform, ExpenseCategory } from "../src/generated/prisma";

const prisma = new PrismaClient();

const EXPENSE_CATEGORIES: { category: ExpenseCategory; label: string; weight: number }[] = [
  { category: "NOMINA", label: "Nomina del equipo", weight: 0.4 },
  { category: "ARRIENDO", label: "Arriendo de oficina", weight: 0.15 },
  { category: "MARKETING", label: "Pauta y marketing digital", weight: 0.15 },
  { category: "TECNOLOGIA", label: "Herramientas y hosting", weight: 0.1 },
  { category: "SERVICIOS", label: "Servicios publicos", weight: 0.08 },
  { category: "IMPUESTOS", label: "Impuestos y obligaciones", weight: 0.07 },
  { category: "OTRO", label: "Gastos varios", weight: 0.05 },
];

const INCOME_LABELS = [
  "Factura de servicio mensual",
  "Nueva suscripcion de cliente",
  "Renovacion de contrato",
  "Venta de plan anual",
  "Consultoria puntual",
];

const COMPANIES = [
  {
    slug: "biosoft",
    name: "Biosoft",
    sector: "Software para laboratorio clinico",
    description:
      "Software especializado para la gestion integral de laboratorios clinicos: ordenes, resultados, facturacion e interoperabilidad.",
    colorHex: "#0EA5A4",
    logoUrl: "/logos/biosoft.png",
  },
  {
    slug: "biofutbol",
    name: "BioFutbol",
    sector: "Tecnologia deportiva con IA",
    description:
      "Aplicacion con inteligencia artificial para la administracion de clubes y escuelas de futbol: jugadores, entrenamientos y desempeno.",
    colorHex: "#16A34A",
    logoUrl: "/logos/biofutbol.png",
  },
  {
    slug: "biomarketing",
    name: "Biomarketing",
    sector: "Marketing digital para salud",
    description:
      "Agencia especialista en aumentar ventas y captacion de pacientes para negocios del sector salud.",
    colorHex: "#DB2777",
    logoUrl: "/logos/biomarketing.png",
  },
  {
    slug: "biosalud",
    name: "Biosalud",
    sector: "Equipos medicos y de laboratorio",
    description:
      "Venta de equipos medicos, de laboratorio y de rayos X, y soluciones integrales para el sector salud.",
    colorHex: "#2563EB",
    logoUrl: "/logos/biosalud.png",
  },
];

const PLATFORMS: SocialPlatform[] = ["FACEBOOK", "INSTAGRAM", "WHATSAPP", "TIKTOK"];

const SERVICES = [
  {
    slug: "automatizacion-whatsapp-ia",
    name: "Automatizacion WhatsApp + IA",
    shortDescription: "CRM y remarketing por WhatsApp con inteligencia artificial.",
    description:
      "Un CRM completo para gestionar tus contactos y ventas, con automatizacion de mensajes y remarketing por WhatsApp asistido por inteligencia artificial. Ideal para negocios que quieren responder rapido y no perder ni un cliente.",
    colorHex: "#25D366",
    defaultPriceCOP: 450000,
    defaultPeriod: "MENSUAL" as const,
  },
  {
    slug: "automatizacion-cobros",
    name: "Automatizacion de cobros",
    shortDescription: "Recordatorios, cobros y confirmaciones de pago automaticas.",
    description:
      "Automatiza el cobro mensual o anual de tus clientes: recordatorios por correo y WhatsApp, conciliacion de pagos con Wompi y confirmacion automatica cuando el pago se registra.",
    colorHex: "#7C3AED",
    defaultPriceCOP: 250000,
    defaultPeriod: "MENSUAL" as const,
  },
  {
    slug: "gestion-redes-sociales",
    name: "Gestion de redes sociales",
    shortDescription: "Contenido, calendario y estadisticas para tus redes.",
    description:
      "Manejamos el contenido, la programacion y el analisis de resultados de tus redes sociales (Facebook, Instagram, TikTok y WhatsApp), con reportes mensuales de crecimiento.",
    colorHex: "#DB2777",
    defaultPriceCOP: 600000,
    defaultPeriod: "MENSUAL" as const,
  },
  {
    slug: "diseno-desarrollo-web",
    name: "Diseno y desarrollo web",
    shortDescription: "Paginas y landings profesionales que convierten.",
    description:
      "Diseno y desarrollo de sitios web y landing pages modernas, rapidas y optimizadas para convertir visitantes en clientes.",
    colorHex: "#2563EB",
    defaultPriceCOP: 1_800_000,
    defaultPeriod: "ANUAL" as const,
  },
];

const DEMO_CLIENTS = [
  {
    firstName: "Laura",
    lastName: "Gomez",
    email: "laura.gomez@example.com",
    phone: "3011234567",
    companyName: "Clinica Vital",
    serviceSlug: "automatizacion-whatsapp-ia",
    monthsAgo: 2,
    status: "AL_DIA" as const,
  },
  {
    firstName: "Carlos",
    lastName: "Ramirez",
    email: "carlos.ramirez@example.com",
    phone: "3022345678",
    companyName: "Odontologia Sonrisas",
    serviceSlug: "gestion-redes-sociales",
    monthsAgo: 4,
    status: "PENDIENTE" as const,
  },
  {
    firstName: "Marcela",
    lastName: "Torres",
    email: "marcela.torres@example.com",
    phone: "3033456789",
    companyName: "Centro Medico Bienestar",
    serviceSlug: "automatizacion-cobros",
    monthsAgo: 3,
    status: "SUSPENDIDO" as const,
  },
];

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
      update: { logoUrl: c.logoUrl },
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

    const existingIncome = await prisma.income.count({ where: { companyId: company.id } });
    if (existingIncome === 0) {
      const monthlyRevenue = 8_000_000 + i * 3_500_000;

      for (let monthsBack = 5; monthsBack >= 0; monthsBack--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - monthsBack, 1);
        const isCurrentMonth = monthsBack === 0;
        const daysInMonth = isCurrentMonth
          ? today.getDate()
          : new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

        const entriesCount = 4 + (i % 3);
        for (let n = 0; n < entriesCount; n++) {
          const day = 1 + Math.floor(((n + 1) / (entriesCount + 1)) * daysInMonth);
          const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
          const amount = Math.round(
            (monthlyRevenue / entriesCount) * (0.75 + Math.random() * 0.5)
          );
          await prisma.income.create({
            data: {
              companyId: company.id,
              date,
              amount,
              description: INCOME_LABELS[(n + monthsBack) % INCOME_LABELS.length],
            },
          });
        }

        for (const { category, label, weight } of EXPENSE_CATEGORIES) {
          const amount = Math.round(monthlyRevenue * weight * (0.85 + Math.random() * 0.3));
          const day = 3 + Math.floor(Math.random() * Math.max(1, daysInMonth - 5));
          const date = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth(),
            Math.min(day, daysInMonth)
          );
          await prisma.expense.create({
            data: {
              companyId: company.id,
              date,
              amount,
              category,
              description: label,
            },
          });
        }
      }
    }
  }

  const serviceIdBySlug = new Map<string, string>();
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    const service = await prisma.serviceOffering.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        shortDescription: s.shortDescription,
        description: s.description,
        colorHex: s.colorHex,
        defaultPriceCOP: s.defaultPriceCOP,
        defaultPeriod: s.defaultPeriod,
        order: i,
      },
    });
    serviceIdBySlug.set(s.slug, service.id);
  }

  const today = new Date();
  for (const demo of DEMO_CLIENTS) {
    const serviceId = serviceIdBySlug.get(demo.serviceSlug);
    if (!serviceId) continue;

    const client = await prisma.client.upsert({
      where: { email: demo.email },
      update: {},
      create: {
        firstName: demo.firstName,
        lastName: demo.lastName,
        email: demo.email,
        phone: demo.phone,
        companyName: demo.companyName,
      },
    });

    const existingSub = await prisma.clientSubscription.findFirst({
      where: { clientId: client.id, serviceId },
    });
    if (existingSub) continue;

    const service = SERVICES.find((s) => s.slug === demo.serviceSlug)!;
    const initialChargeDate = new Date(today);
    initialChargeDate.setMonth(initialChargeDate.getMonth() - demo.monthsAgo);

    const renewalDate = new Date(today);
    if (demo.status === "AL_DIA") renewalDate.setDate(renewalDate.getDate() + 20);
    if (demo.status === "PENDIENTE") renewalDate.setDate(renewalDate.getDate() + 2);
    if (demo.status === "SUSPENDIDO") renewalDate.setDate(renewalDate.getDate() - 1);

    const subscription = await prisma.clientSubscription.create({
      data: {
        clientId: client.id,
        serviceId,
        priceCOP: service.defaultPriceCOP,
        period: service.defaultPeriod,
        status: demo.status,
        initialChargeDate,
        renewalDate,
      },
    });

    if (demo.status === "AL_DIA") {
      const lastPayment = new Date(today);
      lastPayment.setDate(lastPayment.getDate() - 10);
      await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: service.defaultPriceCOP,
          method: "MANUAL",
          reference: "Pago demo",
          paidAt: lastPayment,
        },
      });
    }
  }

  console.log(
    "Seed completado: 2 usuarios, 4 empresas, cuentas sociales, estadisticas, catalogo de servicios y clientes demo."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
