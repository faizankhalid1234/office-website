import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { registerUser } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[register] Failed:", error);
    const message =
      error instanceof Error && error.message.includes("connect")
        ? "Database connection failed. Please try again later."
        : "Registration failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
