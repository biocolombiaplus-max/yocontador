import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Cualquier archivo estatico servido desde /public (logos, iconos, imagenes
// de marca, etc.) debe quedar accesible sin sesion, sin importar en que
// subcarpeta viva, para que no se rompa cada vez que se agrega una nueva.
const STATIC_ASSET_RE = /\.(png|jpe?g|gif|svg|webp|ico|css|js|woff2?|ttf|json)$/i;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/landing") ||
    pathname.startsWith("/_next") ||
    pathname === "/manifest.webmanifest" ||
    STATIC_ASSET_RE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname !== "/cambiar-clave") {
    // The JWT can lag behind a just-completed password change, so check the
    // authoritative flag in the database rather than trusting the session token.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { mustChangePassword: true },
    });
    if (user?.mustChangePassword) {
      return NextResponse.redirect(new URL("/cambiar-clave", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
