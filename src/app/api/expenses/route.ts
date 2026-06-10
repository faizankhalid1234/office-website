import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validations";
import { decimalToNumber } from "@/lib/utils-format";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  const expenses = await prisma.expense.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true, user: { select: { name: true } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(
    expenses.map((e) => ({ ...e, amount: decimalToNumber(e.amount) }))
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        title: parsed.data.title,
        amount: parsed.data.amount,
        date: new Date(parsed.data.date),
        paymentMethod: parsed.data.paymentMethod,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        userId: session.user.id,
        receiptUrl: body.receiptUrl,
        receiptName: body.receiptName,
      },
      include: { category: true },
    });

    return NextResponse.json(
      { ...expense, amount: decimalToNumber(expense.amount) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
