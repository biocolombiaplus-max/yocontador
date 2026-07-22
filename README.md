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
- **Ajustes de cuenta**: cada usuario cambia su propia contrasena.

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

## Primeros pasos (desarrollo local)

Requisitos: Node.js 20.9+.

```bash
npm install
cp .env.example .env   # si no existe .env, o edita el .env ya presente
npx prisma migrate dev
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
- **Prisma + SQLite** para desarrollo (`prisma/dev.db`, no se versiona). Para
  producción se recomienda cambiar el `datasource` en `prisma/schema.prisma`
  a PostgreSQL (por ejemplo Vercel Postgres o Neon) y actualizar
  `DATABASE_URL`.
- **NextAuth v5** con proveedor de credenciales (cedula + contrasena),
  sesion JWT. `src/proxy.ts` protege todas las rutas salvo `/login`.
- **Archivos subidos** (imagenes/videos/reels) se guardan hoy en
  `public/uploads/<empresa>/...`. En producción sobre una plataforma
  serverless (Vercel) el disco no es persistente entre despliegues: hay que
  migrar esa parte a un almacenamiento de objetos (Vercel Blob, S3,
  Cloudinary) antes de operar con datos reales de forma duradera.

## Estructura principal

```
prisma/schema.prisma        modelos: User, Company, SocialAccount,
                             ContentPost, StatSnapshot, ActivityLog
prisma/seed.ts               usuarios + empresas + datos de ejemplo
src/lib/auth.ts              configuracion de NextAuth
src/proxy.ts                 proteccion de rutas
src/lib/actions/*            server actions (crear empresa, redes,
                              contenido, cambiar contrasena)
src/app/(app)/...            paginas del panel (protegidas)
src/app/login, /cambiar-clave  paginas publicas de acceso
```

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de produccion
npm run start       # servidor de produccion (tras build)
npm run lint        # eslint
npm run db:seed     # vuelve a poblar la base con los datos iniciales
```

## Antes de llevar esto a producción

1. Cambiar `DATABASE_URL` a una base de datos Postgres administrada y
   actualizar el `provider` en `prisma/schema.prisma`.
2. Configurar almacenamiento de objetos para los archivos multimedia.
3. Generar un `AUTH_SECRET` nuevo para el entorno de producción (no
   reutilizar el de desarrollo) y definir `AUTH_URL`/`AUTH_TRUST_HOST` segun
   la plataforma de despliegue.
4. Conectar las APIs oficiales de Meta y TikTok cuando esten listas las
   cuentas de desarrollador del grupo.
