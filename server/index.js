import cors from "cors";
import crypto from "node:crypto";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import {
  ensureDataDir,
  loadAdminUserIds,
  loadLeadMap,
  saveAdminUserIds,
  saveLeadMap,
} from "./lib/telegram-store.js";

dotenv.config();

/** @returns {string} */
function getBotToken() {
  const raw = process.env.TELEGRAM_BOT_TOKEN;
  if (raw == null || raw === "") return "";
  return String(raw)
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/^['"]|['"]$/g, "");
}

const leadSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(10).max(32),
  rideDate: z.string().min(1),
  comment: z.string().max(2000).optional(),
  packageId: z.string().optional(),
});

const packageLabels = {
  p30: "Старт 30 мин",
  p60: "Хит сезона 60 мин",
  p90: "Максимум 90 мин",
  p24: "Суточный тариф",
};

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function ownerIdsFromEnv() {
  const raw = process.env.TELEGRAM_OWNER_IDS ?? "";
  const fromList = raw
    .split(",")
    .map((s) => Number(String(s).trim().replace(/^\uFEFF/, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (fromList.length) return fromList;
  const legacy = Number(String(process.env.TELEGRAM_CHAT_ID ?? "").trim());
  return Number.isFinite(legacy) && legacy > 0 ? [legacy] : [];
}

function isOwner(userId) {
  return ownerIdsFromEnv().includes(Number(userId));
}

async function isAdminUser(userId) {
  const uid = Number(userId);
  if (isOwner(uid)) return true;
  const admins = await loadAdminUserIds();
  return admins.includes(uid);
}

async function getNotifyRecipients() {
  const ids = new Set(ownerIdsFromEnv());
  const legacy = Number(String(process.env.TELEGRAM_CHAT_ID ?? "").trim());
  if (Number.isFinite(legacy) && legacy > 0) ids.add(legacy);
  for (const id of await loadAdminUserIds()) ids.add(id);
  return [...ids];
}

async function tgApi(method, body) {
  const token = getBotToken();
  if (!token) throw new Error("no_bot_token");
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) {
    console.error("Telegram API", method, res.status, json);
    throw new Error("telegram_api");
  }
  return json;
}

async function sendMessageHtml(chatId, text, replyMarkup) {
  return tgApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: replyMarkup,
  });
}

async function editMessageHtml(chatId, messageId, text, replyMarkup) {
  return tgApi("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: replyMarkup,
  });
}

function actorLabel(from) {
  if (from.username) return `@${from.username}`;
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  if (name) return escapeHtml(name);
  return `id:${from.id}`;
}

async function notifyTelegram(payload) {
  const allowSkip = process.env.ALLOW_LEADS_WITHOUT_TELEGRAM === "1";
  const token = getBotToken();
  const lines = [
    "<b>Новая заявка JetSurf (сайт)</b>",
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
  const html = lines.join("\n");

  if (!token) {
    if (allowSkip) {
      console.info("[lead]", html.replace(/<[^>]+>/g, ""));
      return;
    }
    throw new Error(
      "TELEGRAM_BOT_TOKEN не задан. Добавьте токен в server/.env или установите ALLOW_LEADS_WITHOUT_TELEGRAM=1 для локальной разработки.",
    );
  }

  const recipients = await getNotifyRecipients();
  if (!recipients.length) {
    if (allowSkip) {
      console.warn(
        "[lead] Нет получателей Telegram — заявка не отправлена (режим ALLOW_LEADS_WITHOUT_TELEGRAM).",
      );
      console.info("[lead]", html.replace(/<[^>]+>/g, ""));
      return;
    }
    throw new Error(
      "Нет получателей Telegram: укажите TELEGRAM_OWNER_IDS (ваш числовой id у @userinfobot) или TELEGRAM_CHAT_ID в server/.env",
    );
  }

  const shortId = crypto.randomBytes(4).toString("hex");
  const replyMarkup = {
    inline_keyboard: [
      [{ text: "Связался", callback_data: `ct:${shortId}` }],
    ],
  };

  /** @type {Record<string, number>} */
  const targets = {};
  for (const chatId of recipients) {
    try {
      const json = await sendMessageHtml(chatId, html, replyMarkup);
      if (json.result?.message_id != null) {
        targets[String(chatId)] = json.result.message_id;
      }
    } catch (e) {
      console.error("[lead] send to", chatId, e);
    }
  }

  if (Object.keys(targets).length === 0) {
    throw new Error(
      "Не удалось отправить сообщение в Telegram (проверьте токен бота и id чата; бот должен иметь возможность писать получателю).",
    );
  }

  const leads = await loadLeadMap();
  leads[shortId] = { html, targets, contacted: false };
  await saveLeadMap(leads);
}

async function handleCallbackQuery(q) {
  const data = q.data ?? "";
  const m = /^ct:([a-f0-9]{8})$/.exec(data);
  if (!m) return;
  const shortId = m[1];
  const from = q.from;
  if (!(await isAdminUser(from.id))) {
    await tgApi("answerCallbackQuery", {
      callback_query_id: q.id,
      text: "Недостаточно прав",
      show_alert: true,
    });
    return;
  }

  const leads = await loadLeadMap();
  const lead = leads[shortId];
  if (!lead) {
    await tgApi("answerCallbackQuery", {
      callback_query_id: q.id,
      text: "Заявка не найдена",
      show_alert: false,
    });
    return;
  }
  if (lead.contacted) {
    const who = lead.contactedBy ? ` Уже: ${lead.contactedBy}` : "";
    await tgApi("answerCallbackQuery", {
      callback_query_id: q.id,
      text: `Уже отмечено.${who}`,
      show_alert: false,
    });
    return;
  }

  const actor = actorLabel(from);
  const newText = `${lead.html}\n\n✅ <b>Связались:</b> ${actor}`;
  const emptyKeyboard = { inline_keyboard: [] };

  for (const [chatIdStr, messageId] of Object.entries(lead.targets)) {
    try {
      await editMessageHtml(chatIdStr, messageId, newText, emptyKeyboard);
    } catch (e) {
      console.error("[callback] edit", chatIdStr, messageId, e);
    }
  }

  lead.contacted = true;
  lead.contactedBy = actor;
  leads[shortId] = lead;
  await saveLeadMap(leads);

  await tgApi("answerCallbackQuery", {
    callback_query_id: q.id,
    text: "Отмечено",
    show_alert: false,
  });
}

async function handleMessage(msg) {
  const text = (msg.text ?? "").trim();
  const fromId = msg.from?.id;
  if (!fromId || !text) return;

  if (text === "/start") {
    const owners = ownerIdsFromEnv();
    const adminHint =
      owners.length > 0
        ? "Владельцы бота получают заявки и могут добавлять админов ответом на сообщение пользователя: <code>/addadmin</code> или <code>/removeadmin</code>."
        : "Укажите в .env переменную <code>TELEGRAM_OWNER_IDS</code> (числовые id через запятую), чтобы управлять админами.";
    await sendMessageHtml(
      msg.chat.id,
      [
        "<b>JetSurf — уведомления</b>",
        "Администраторы получают заявки с сайта.",
        "Под кнопкой «Связался» отобразится, кто взял клиента.",
        "",
        adminHint,
        "",
        "<code>/listadmins</code> — список id админов из файла (не включая владельцев из .env).",
      ].join("\n"),
      { inline_keyboard: [] },
    );
    return;
  }

  if (text === "/listadmins") {
    if (!(await isAdminUser(fromId))) return;
    const ids = await loadAdminUserIds();
    await sendMessageHtml(
      msg.chat.id,
      ids.length
        ? `<b>Админы (файл)</b>\n${ids.join(", ")}`
        : "<b>Админы (файл)</b>\nпока пусто — только владельцы из .env.",
      { inline_keyboard: [] },
    );
    return;
  }

  const cmd = text.split(/\s+/)[0];
  if (cmd === "/addadmin" || cmd === "/removeadmin") {
    if (!isOwner(fromId)) {
      await sendMessageHtml(
        msg.chat.id,
        "Только владелец бота (TELEGRAM_OWNER_IDS) может выдавать и забирать админку.",
        { inline_keyboard: [] },
      );
      return;
    }
    const target = msg.reply_to_message?.from?.id;
    if (!target) {
      await sendMessageHtml(
        msg.chat.id,
        "Ответьте этой командой на сообщение пользователя, которому нужно выдать или забрать админку.",
        { inline_keyboard: [] },
      );
      return;
    }
    if (isOwner(target)) {
      await sendMessageHtml(
        msg.chat.id,
        "Владельцев из .env нельзя снять через бота.",
        { inline_keyboard: [] },
      );
      return;
    }
    let ids = await loadAdminUserIds();
    if (cmd === "/addadmin") {
      if (!ids.includes(target)) ids = [...ids, target];
      await saveAdminUserIds(ids);
      await sendMessageHtml(
        msg.chat.id,
        `Пользователь <code>${target}</code> добавлен в админы.`,
        { inline_keyboard: [] },
      );
    } else {
      ids = ids.filter((x) => x !== target);
      await saveAdminUserIds(ids);
      await sendMessageHtml(
        msg.chat.id,
        `Пользователь <code>${target}</code> убран из админов.`,
        { inline_keyboard: [] },
      );
    }
  }
}

let updateOffset = 0;

async function pollTelegramOnce() {
  const token = getBotToken();
  if (!token) return;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/getUpdates?timeout=45&offset=${updateOffset}`,
    );
    const json = await res.json();
    if (!json.ok || !Array.isArray(json.result)) return;
    for (const u of json.result) {
      updateOffset = u.update_id + 1;
      if (u.callback_query) await handleCallbackQuery(u.callback_query);
      else if (u.message) await handleMessage(u.message);
    }
  } catch (e) {
    console.error("[poll]", e);
  }
}

function startTelegramPolling() {
  if (!getBotToken()) {
    console.warn("TELEGRAM_BOT_TOKEN не задан — заявки только в лог.");
    return;
  }
  (async function loop() {
    for (;;) {
      await pollTelegramOnce();
      await new Promise((r) => setTimeout(r, 400));
    }
  })();
}

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: corsOrigin
      ? corsOrigin.split(",").map((s) => s.trim())
      : true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/leads", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Проверьте поля формы",
      issues: parsed.error.flatten(),
    });
  }

  try {
    await notifyTelegram(parsed.data);
  } catch (e) {
    console.error("[api/leads]", e);
    const msg =
      e instanceof Error && typeof e.message === "string"
        ? e.message
        : "Ошибка сервера";
    const status = /TELEGRAM|Telegram|получател/i.test(msg) ? 503 : 500;
    return res.status(status).json({ message: msg });
  }

  return res.json({ ok: true });
});

const port = Number(process.env.PORT) || 4000;

await ensureDataDir();
app.listen(port, () => {
  console.log(`JetSurf API listening on :${port}`);
  startTelegramPolling();
});
