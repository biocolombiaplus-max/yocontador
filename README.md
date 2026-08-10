# BIO COLOMBIA — Panel administrativo de grupo

Panel privado para administrar todas las empresas del grupo **BIO COLOMBIA**
(Biosoft, BioFutbol, Biomarketing, Biosalud, y las que se agreguen despues)
desde un solo lugar, al estilo de una agencia de marketing digital: una
empresa por cliente, con sus redes sociales, su calendario de contenido y sus
estadisticas.

Este proyecto vive en su propio repositorio, aislado del resto de sistemas
del grupo.

## Que incluye hoy

- **Acceso restringido**: solo inician sesion las dos cedulas dadas de alta
  (propietario y administradora). No hay registro publico.
- **Resumen general**: estadisticas consolidadas de todas las empresas
  (seguidores, cuentas conectadas, publicaciones programadas/publicadas).
- **Empresas**: crear nuevas empresas del grupo en cualquier momento, cada
  una con su color, sector y descripcion.
- **Redes sociales por empresa**: organizar las cuentas de Facebook,
  Instagram, WhatsApp y TikTok de cada empresa (usuario, estado, seguidores,
  URL del perfil, notas y un campo para guardar el token de API cuando se
  conecte de verdad).
- **Calendario de contenido**: subir imagenes, videos y reels, escribir el
  texto, elegir las redes destino y llevar el estado (borrador, programado,
  publicado).
- **Estadisticas por empresa y consolidadas**: crecimiento de seguidores,
  engagement, alcance, con graficas.
- **Finanzas por empresa**: registrar ingresos (facturacion) y gastos por
  categoria, con facturado del dia y del mes, gastado del mes, utilidad del
  mes, grafica de ingresos vs. gastos y libro de movimientos.
- **Finanzas consolidadas del grupo**: totales de todas las empresas y
  **reparto de utilidades 50% / 50% entre Juan Carlos y Nicol**, calculado
  sobre la utilidad neta (ingresos menos gastos totales), tanto del mes
  como historico.
- **Ajustes de cuenta**: cada usuario cambia su propia contrasena.
- **Catalogo de servicios**: los servicios digitales que BIO COLOMBIA vende
  (Automatizacion WhatsApp + IA, Automatizacion de cobros, Gestion de redes,
  etc.), cada uno con su logo, imagen de portada, precio y descripcion,
  editables desde el panel. Se pueden publicar u ocultar de la landing
  publica con un clic.
- **CRM de clientes**: registro de las empresas/personas que contratan
  servicios, con sus datos de contacto, los servicios que tienen activos,
  su estado (al dia, pendiente, suspendido) e historial de pagos.
- **Automatizacion de cobros** (recordatorios y confirmaciones):
  recordatorios automaticos por correo antes del vencimiento, aviso el dia
  del vencimiento, suspension automatica con cargo de reconexion si no se
  paga, y **al registrar un pago manualmente el servicio se restablece y se
  le confirma al cliente por correo (y con un enlace listo para WhatsApp)**
  de inmediato. Tambien concilia pagos aprobados en Wompi automaticamente.
- **Landing publica**: pagina de presentacion de los servicios (`/landing`),
  moderna y enfocada en conversion, que se actualiza sola cuando editas el
  catalogo desde el panel.
- **Instalable como app** (PWA): desde el celular ("Agregar a inicio") o el
  computador (boton de instalar del navegador), el panel queda con icono
  propio y se abre en pantalla completa, sin la barra del navegador.

## Instalar el panel en celular y computador

Una vez el panel este desplegado (ver "Desplegar en Firebase App Hosting"
abajo) y tengas su URL publica, instalarlo toma unos segundos y no requiere
descargar nada de una tienda de aplicaciones:

**En celular (Android, con Chrome):**
1. Abre el link del panel en Chrome.
2. Toca el menu (⋮) → **Agregar a pantalla de inicio** → **Instalar**.
3. Queda un icono como cualquier otra app; al abrirlo entra directo, sin
   barra de navegador.

**En celular (iPhone, con Safari):**
1. Abre el link en Safari (no funciona desde Chrome en iOS).
2. Toca el boton de compartir (el cuadro con la flecha hacia arriba).
3. Elige **Agregar a inicio**.

**En computador (Chrome, Edge o cualquier navegador basado en Chromium):**
1. Abre el link del panel.
2. En la barra de direcciones aparece un icono de instalar (una pantalla
   con una flecha) — haz clic ahi y luego en **Instalar**.
3. Queda como una app independiente, con su propio icono en el dock/barra
   de tareas.

Cada persona (Juan Carlos y Nicol) instala el panel en sus propios
dispositivos con el mismo link; el inicio de sesion sigue siendo con su
cedula y contrasena de siempre.

## Sobre la conexion real con Facebook / Instagram / WhatsApp / TikTok

Publicar de verdad en cada red requiere credenciales oficiales que **solo el
dueno del negocio puede crear y autorizar**:

- Meta Business Suite / Graph API (Facebook, Instagram, WhatsApp Business API)
- TikTok for Business API

Este panel ya tiene la estructura lista para eso: en la pestana **Redes
sociales** de cada empresa hay un campo para guardar el token/clave de acceso
de cada cuenta. Cuando se creen las apps de desarrollador en Meta y TikTok, el
siguiente paso es implementar las llamadas reales a esas APIs (publicar
imagen/video, leer metricas) usando esos tokens. Mientras tanto, el panel
funciona igual para organizar y dejar listo el contenido.

## CRM, correos, WhatsApp y Wompi

### Correos (recordatorios y confirmaciones)

Los correos se envian con **Nodemailer usando una cuenta de Gmail** (la misma
logica que usaban antes con Apps Script, ahora integrada en la aplicacion).
Para activarlos:

1. Activa la verificacion en 2 pasos en la cuenta de Gmail que enviara los
   correos (por ejemplo `biomarketing.salud@gmail.com`).
2. Genera una **contrasena de aplicacion** en
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. En las variables de entorno, define `EMAIL_USER` (la cuenta de Gmail) y
   `EMAIL_APP_PASSWORD` (la contrasena de aplicacion de 16 caracteres, no la
   contrasena normal).

Si estas variables no estan configuradas, la aplicacion **no falla**: registra
un aviso en los logs y sigue funcionando (por ejemplo, un pago se registra
igual aunque el correo no se haya podido enviar).

### WhatsApp

No requiere ninguna API de pago: se usan enlaces `wa.me` (click-to-chat) con
el mensaje ya escrito, tanto en los correos como en botones dentro del panel
(cada cliente y cada suscripcion tiene su boton de WhatsApp listo). Define
`SUPPORT_WHATSAPP` con el numero de soporte (indicativo + numero, sin
espacios ni simbolos).

Si mas adelante consiguen acceso a la API oficial de WhatsApp Business
(Meta Cloud API u otro proveedor) para enviar mensajes de forma
100% automatica sin que alguien haga clic, el punto de integracion es
`src/lib/whatsapp.ts` — ahi se reemplazaria la generacion del enlace por el
envio real.

### Wompi (pagos)

Define `WOMPI_PUBLIC_KEY` y `WOMPI_PRIVATE_KEY` (se consiguen en
[comercios.wompi.co](https://comercios.wompi.co)). **Nunca las escribas en el
codigo** — solo van como variables de entorno. Con esto, cada recordatorio
incluye un boton de pago real, y el sistema concilia automaticamente los
pagos aprobados con las suscripciones pendientes.

### Automatizacion diaria (cron)

Dos rutas hacen el trabajo de fondo, protegidas por `CRON_SECRET`:

- `GET/POST /api/cron/reminders` — envia recordatorios, avisos de
  vencimiento y suspensiones del dia.
- `GET/POST /api/cron/wompi-sync` — concilia pagos aprobados en Wompi.

Hay que llamarlas una vez al dia desde algo externo (la aplicacion no se
"despierta" sola). Opciones sencillas:

- **Vercel Cron** (si despliegas ahi): agrega un `vercel.json` con los
  horarios y las rutas.
- **Google Cloud Scheduler** (si usas Firebase App Hosting): crea dos jobs
  HTTP apuntando a esas rutas con el header `Authorization: Bearer <CRON_SECRET>`.
- **[cron-job.org](https://cron-job.org)** (gratis, mas simple): crea un cron
  job por cada URL, por ejemplo
  `https://tu-dominio/api/cron/reminders?secret=<CRON_SECRET>` a las 8:00 AM
  y `https://tu-dominio/api/cron/wompi-sync?secret=<CRON_SECRET>` a las 6:00 PM
  (hora de Colombia), replicando los horarios del script original.

## Primeros pasos (desarrollo local)

Requisitos: Node.js 20.9+ y una base de datos PostgreSQL (local o en la nube,
por ejemplo [Neon](https://neon.tech) gratis).

```bash
npm install
cp .env.example .env   # y pon tu DATABASE_URL y un AUTH_SECRET propio
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Usuarios iniciales

El seed crea exactamente dos usuarios, con la cedula como contrasena
temporal (se obliga a cambiarla en el primer ingreso):

| Nombre | Cedula | Rol |
|---|---|---|
| Juan Carlos Caceres | 88262856 | Propietario |
| Nicol Bustos | 1127052812 | Administradora |

**Importante:** en cuanto entren por primera vez, cada uno debe definir su
propia contrasena en la pantalla que aparece automaticamente. Nadie mas
puede crear cuentas nuevas desde la aplicacion: solo existen estas dos.

## Arquitectura

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4.
- **Prisma + PostgreSQL**. Las migraciones ya estan generadas para Postgres
  en `prisma/migrations/`.
- **NextAuth v5** con proveedor de credenciales (cedula + contrasena),
  sesion JWT. `src/proxy.ts` protege todas las rutas salvo `/login`.
- **Archivos subidos** (imagenes/videos/reels) se guardan hoy en
  `public/uploads/<empresa>/...`. En producción sobre una plataforma
  serverless o basada en contenedores efimeros (Firebase App Hosting,
  Vercel) el disco no es persistente entre despliegues/instancias: hay que
  migrar esa parte a un almacenamiento de objetos (Firebase Storage,
  Cloudinary, S3) antes de operar con datos reales de forma duradera.

## Desplegar en Firebase App Hosting

Firebase App Hosting corre Next.js con soporte completo de SSR y server
actions (no es el Firebase Hosting clasico ni Firestore). La app sigue
usando PostgreSQL para los datos — Firebase no ofrece Postgres, asi que
necesitas una base externa (Neon, gratis y rapido de crear, es la opcion
mas sencilla).

Usa un **proyecto de Firebase nuevo y separado** de tus otros proyectos,
para que esto no se mezcle con nada mas.

1. Crea una base Postgres gratis en [neon.tech](https://neon.tech) y copia
   su cadena de conexion (`postgresql://...`).
2. En la [consola de Firebase](https://console.firebase.google.com), crea
   un **proyecto nuevo** dedicado a BIO COLOMBIA.
3. Dentro del proyecto, ve a **App Hosting** → **Comenzar** (Get started) →
   conecta tu cuenta de GitHub → selecciona el repositorio
   `biocolombiaplus-max/bio-colombia`, rama `main`.
4. En el paso de configuracion del backend, agrega las variables de entorno
   (desde marzo 2026 esto se hace directo en la consola, sin editar
   archivos):
   - `DATABASE_URL`: la cadena de Neon del paso 1.
   - `AUTH_SECRET`: genera uno nuevo con
     `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
5. Completa la creacion del backend. Firebase construye y despliega
   automaticamente; te da una URL publica del tipo
   `https://bio-colombia--<proyecto>.web.app` (o similar).
6. Antes de compartir el link, corre las migraciones y el seed una vez
   desde tu maquina, apuntando a la base de Neon:
   ```bash
   DATABASE_URL="<la de Neon>" npm run db:migrate:deploy
   DATABASE_URL="<la de Neon>" npm run db:seed
   ```
7. Entra a la URL para confirmar que el login funciona, y comparte ese link
   con Nicol — ella entra con su cedula (`1127052812`) y define su propia
   contrasena en el primer ingreso.

El repositorio incluye `apphosting.yaml` con la configuracion base (tamano
de instancia y las dos variables de entorno como secretos). Cada push a
`main` vuelve a desplegar automaticamente.

> **Alternativa:** el proyecto tambien puede desplegarse igual de facil en
> [Vercel](https://vercel.com) (Add New → Project → importar el repo,
> mismas dos variables de entorno, *Build Command*
> `prisma migrate deploy && next build`), si en algun momento prefieres esa
> plataforma en vez de Firebase.

## Estructura principal

```
prisma/schema.prisma          modelos: User, Company, SocialAccount,
                               ContentPost, StatSnapshot, ActivityLog,
                               Client, ServiceOffering, ClientSubscription,
                               Payment, ReminderLog
prisma/seed.ts                 usuarios + empresas + catalogo + clientes demo
src/lib/auth.ts                configuracion de NextAuth
src/proxy.ts                   proteccion de rutas (deja /landing y
                                /api/cron publicos)
src/lib/actions/*              server actions (empresas, redes, contenido,
                                clientes, servicios, suscripciones, pagos)
src/lib/crm/reminder-engine.ts  logica de recordatorios y registro de pagos
src/lib/crm/wompi-sync.ts       conciliacion de pagos aprobados en Wompi
src/lib/email/                 envio (Nodemailer) y plantillas premium
src/lib/whatsapp.ts             enlaces click-to-chat de WhatsApp
src/lib/wompi.ts                enlaces de pago y consulta de transacciones
src/app/(app)/...              paginas del panel (protegidas)
src/app/landing/                landing publica del catalogo de servicios
src/app/api/cron/               endpoints para la automatizacion diaria
src/app/login, /cambiar-clave  paginas publicas de acceso
```

## Scripts

```bash
npm run dev                 # servidor de desarrollo
npm run build                # build de produccion
npm run start                 # servidor de produccion (tras build)
npm run lint                  # eslint
npm run db:seed               # vuelve a poblar la base con los datos iniciales
npm run db:migrate:deploy     # aplica las migraciones pendientes (produccion)
```

## Pendiente para produccion seria (no bloquea el primer despliegue)

1. Configurar almacenamiento de objetos (Firebase Storage, S3, Cloudinary)
   para que las imagenes/videos subidos (contenido y logos de servicios)
   persistan entre despliegues.
2. Conectar las APIs oficiales de Meta y TikTok cuando esten listas las
   cuentas de desarrollador del grupo.
3. Configurar el cron externo para `/api/cron/reminders` y
   `/api/cron/wompi-sync` (ver seccion "Automatizacion diaria" arriba) —
   sin esto, los recordatorios y la conciliacion de pagos no se ejecutan
   solos.
4. Considerar backups automaticos de la base de datos (Neon los ofrece por
   defecto).
5. Si en algun momento consiguen la API oficial de WhatsApp Business, se
   puede reemplazar el envio manual con un clic por envio 100% automatico
   (ver nota en la seccion de WhatsApp arriba).
