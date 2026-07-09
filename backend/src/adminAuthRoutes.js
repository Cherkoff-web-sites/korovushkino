import express from "express";
import { query } from "./db.js";
import {
  signToken,
  normalizeUserRow,
  findOrCreateUserByEmail,
  findUserByEmail,
} from "./authRoutes.js";
import { sendCodeEmail } from "./mailer.js";

const router = express.Router();

const CODE_TTL_MINUTES = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAllowedAdminEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdminEmail(email) {
  const allowed = getAllowedAdminEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

function getEmergencyPassword() {
  return String(process.env.ADMIN_EMERGENCY_PASSWORD || "");
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function ensureAdminUser(rawEmail) {
  const { user: userRow } = await findOrCreateUserByEmail(rawEmail);
  if (userRow.role !== "admin") {
    await query("UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = $1", [userRow.id]);
    userRow.role = "admin";
  }
  return userRow;
}

router.post("/request-code", async (req, res) => {
  const rawInput = String(req.body?.email || "").trim();
  const emergencyPassword = getEmergencyPassword();

  if (!rawInput) {
    return res.status(400).json({ error: "Укажите email" });
  }

  if (!EMAIL_RE.test(rawInput)) {
    if (emergencyPassword && rawInput === emergencyPassword) {
      const fallbackEmail = getAllowedAdminEmails()[0];
      if (!fallbackEmail) {
        return res.status(403).json({ error: "Аварийный вход не настроен" });
      }
      try {
        const userRow = await ensureAdminUser(fallbackEmail);
        return res.json({
          ok: true,
          emergency: true,
          user: normalizeUserRow(userRow),
          accessToken: signToken(userRow),
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Ошибка сервера" });
      }
    }
    return res.status(400).json({ error: "Укажите корректную почту" });
  }

  const email = rawInput.toLowerCase();
  if (!isAllowedAdminEmail(email)) {
    return res.status(403).json({ error: "Нет доступа к админ-панели для этой почты" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    const code = generateCode();

    await query(
      `INSERT INTO auth_codes (email, code, purpose, user_id, expires_at)
       VALUES ($1, $2, 'admin_login', $3, NOW() + ($4 || ' minutes')::INTERVAL)`,
      [email, code, existingUser?.id ?? null, CODE_TTL_MINUTES]
    );

    await sendCodeEmail(email, "Код входа в админ-панель Коровушкино", code);
    return res.json({ ok: true, emailCodeRequired: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось отправить код. Попробуйте позже." });
  }
});

router.post("/confirm-code", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const code = String(req.body?.code || "").trim();

  if (!email || !code) {
    return res.status(400).json({ error: "Почта и код обязательны" });
  }

  if (!isAllowedAdminEmail(email)) {
    return res.status(403).json({ error: "Нет доступа к админ-панели для этой почты" });
  }

  try {
    const codeResult = await query(
      `SELECT id FROM auth_codes
       WHERE email = $1 AND code = $2 AND purpose = 'admin_login'
         AND expires_at > NOW() AND used_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, code]
    );

    if (codeResult.rowCount === 0) {
      return res.status(400).json({ error: "Неверный или просроченный код" });
    }

    const userRow = await ensureAdminUser(email);
    await query("UPDATE auth_codes SET used_at = NOW() WHERE id = $1", [codeResult.rows[0].id]);

    return res.json({
      user: normalizeUserRow(userRow),
      accessToken: signToken(userRow),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
