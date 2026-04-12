import type { LeadPayload } from "@/lib/lead-schema";

const packageLabels: Record<string, string> = {
  p30: "Старт 30 мин",
  p60: "Хит сезона 60 мин",
  p90: "Максимум 90 мин",
  p24: "Суточный тариф",
};

export async function notifyLead(payload: LeadPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const lines = [
    "<b>Новая заявка JetSurf</b>",
    `Имя: ${escapeHtml(payload.name)}`,
    `Телефон: ${escapeHtml(payload.phone)}`,
    `Дата: ${escapeHtml(payload.rideDate)}`,
  ];
  if (payload.packageId) {
    lines.push(
      `Пакет: ${escapeHtml(packageLabels[payload.packageId] ?? payload.packageId)}`,
    );
  }
  if (payload.comment) {
    lines.push(`Комментарий: ${escapeHtml(payload.comment)}`);
  }
  const text = lines.join("\n");

  if (!token || !chatId) {
    console.info("[lead]", text.replace(/<[^>]+>/g, ""));
    return;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("Telegram error", res.status, body);
    throw new Error("telegram_failed");
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
