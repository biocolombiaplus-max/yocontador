import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCronRequest, unauthorizedCronResponse } from "@/lib/cron-auth";
import { runReminderSweep } from "@/lib/crm/reminder-engine";

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) return unauthorizedCronResponse();
  const result = await runReminderSweep();
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  return GET(request);
}
