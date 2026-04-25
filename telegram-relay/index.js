import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(express.json({ limit: "1mb" }));

function cleanText(value) {
  if (value == null) return "";
  return String(value)
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/^['"]|['"]$/g, "");
}

function getRelayTargetBase() {
  const configured = cleanText(process.env.TELEGRAM_TARGET_BASE);
  if (!configured) return "https://api.telegram.org";
  return configured.replace(/\/+$/, "");
}

function getAllowedToken() {
  return cleanText(process.env.TELEGRAM_RELAY_ALLOWED_TOKEN);
}

function shouldAllowToken(token) {
  const allowed = getAllowedToken();
  if (!allowed) return true;
  return token === allowed;
}

async function proxyTelegram(req, res) {
  const { token, method } = req.params;
  if (!shouldAllowToken(token)) {
    return res.status(403).json({ ok: false, error: "forbidden_token" });
  }

  const targetBase = getRelayTargetBase();
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, String(item));
    } else if (value != null) {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  const url = `${targetBase}/bot${token}/${method}${qs ? `?${qs}` : ""}`;

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers:
        req.method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: req.method === "POST" ? JSON.stringify(req.body ?? {}) : undefined,
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") ?? "application/json";
    res.status(upstream.status);
    res.set("Content-Type", contentType);
    return res.send(text);
  } catch (error) {
    console.error("[relay] telegram proxy error", method, error);
    return res.status(502).json({ ok: false, error: "upstream_unreachable" });
  }
}

app.all("/bot:token/:method", proxyTelegram);

app.get("/health", (_req, res) => {
  res.json({ ok: true, target: getRelayTargetBase() });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Telegram relay listening on :${port} -> ${getRelayTargetBase()}`);
});
