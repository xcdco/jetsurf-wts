import fs from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");

export async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function adminsPath() {
  return path.join(dataDir, "admins.json");
}

function leadsPath() {
  return path.join(dataDir, "lead-messages.json");
}

/** @returns {Promise<number[]>} */
export async function loadAdminUserIds() {
  try {
    const raw = await fs.readFile(adminsPath(), "utf8");
    const j = JSON.parse(raw);
    const arr = Array.isArray(j.userIds) ? j.userIds : [];
    return arr.map(Number).filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}

/** @param {number[]} userIds */
export async function saveAdminUserIds(userIds) {
  await ensureDataDir();
  const uniq = [...new Set(userIds.map(Number).filter((n) => Number.isFinite(n)))];
  await fs.writeFile(adminsPath(), JSON.stringify({ userIds: uniq }, null, 2), "utf8");
}

/** @returns {Promise<Record<string, { html: string; targets: Record<string, number>; contacted: boolean }>>} */
export async function loadLeadMap() {
  try {
    const raw = await fs.readFile(leadsPath(), "utf8");
    const j = JSON.parse(raw);
    return j.leads && typeof j.leads === "object" ? j.leads : {};
  } catch {
    return {};
  }
}

/** @param {Record<string, { html: string; targets: Record<string, number>; contacted: boolean; contactedBy?: string }>} leads */
export async function saveLeadMap(leads) {
  await ensureDataDir();
  await fs.writeFile(leadsPath(), JSON.stringify({ leads }, null, 2), "utf8");
}
