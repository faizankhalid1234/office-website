import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMonthlyReport } from "@/lib/expense-service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

  const report = await getMonthlyReport(session.user.id, month, year);
  return NextResponse.json(report);
}
