import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCronRequest, unauthorizedCronResponse } from "@/lib/cron-auth";
import { syncWompiPayments } from "@/lib/crm/wompi-sync";

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) return unauthorizedCronResponse();
  const result = await syncWompiPayments();
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  return GET(request);
}
