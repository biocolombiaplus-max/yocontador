import { NextRequest, NextResponse } from "next/server";

export function unauthorizedCronResponse(): NextResponse {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export function isAuthorizedCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;

  const query = request.nextUrl.searchParams.get("secret");
  return query === secret;
}
