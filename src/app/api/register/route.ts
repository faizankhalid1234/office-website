import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { djangoRegister } from "@/lib/django-auth";
import { syncUserToPrisma } from "@/lib/sync-user";

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

    const result = await djangoRegister({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const prismaUser = await syncUserToPrisma(result.user);

    return NextResponse.json(
      {
        user: {
          id: prismaUser.id,
          name: prismaUser.name,
          email: prismaUser.email,
          role: prismaUser.role,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
