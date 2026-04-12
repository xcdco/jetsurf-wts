import { leadSchema } from "@/lib/lead-schema";
import { notifyLead } from "@/lib/notify-lead";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Проверьте поля формы", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await notifyLead(parsed.data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
