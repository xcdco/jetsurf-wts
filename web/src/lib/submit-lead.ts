import type { LeadPayload } from "@/lib/lead-schema";

export async function submitLead(payload: LeadPayload) {
  const base =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
      : "";

  const url = base ? `${base}/api/leads` : "/api/leads";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err?.message === "string" ? err.message : "Ошибка отправки",
    );
  }

  return res.json() as Promise<{ ok: boolean }>;
}
