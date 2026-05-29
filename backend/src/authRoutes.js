import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { query } from "./db.js";
import { sendCodeEmail } from "./mailer.js";

const router = express.Router();

const TOKEN_TTL_HOURS = 24;
const CODE_TTL_MINUTES = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_SELECT_FIELDS = `
  id,
  login,
  email,
  role,
  surname,
  first_name,
  phone,
  session_version,
  created_at,
  updated_at
`;

export function signToken(user) {
  const payload = {
    id: user.id,
    login: user.login,
    email: user.email || null,
    role: user.role || "user",
    sessionVersion: Number(user.sessionVersion ?? user.session_version ?? 1),
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: `${TOKEN_TTL_HOURS}h`,
  });
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizeUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    login: row.login,
    email: row.email || null,
    role: row.role || "user",
    surname: row.surname || "",
    firstName: row.first_name || "",
    phone: row.phone || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const result = await query(
      "SELECT id, session_version, role, email, login FROM users WHERE id = $1",
      [payload.id]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const currentSessionVersion = Number(result.rows[0].session_version ?? 1);
    if (Number(payload.sessionVersion ?? 1) !== currentSessionVersion) {
      return res.status(401).json({ error: "Сессия устарела. Войдите снова" });
    }

    req.user = {
      ...payload,
      email: result.rows[0].email || payload.email || null,
      login: result.rows[0].login || payload.login,
      role: result.rows[0].role || "user",
      sessionVersion: currentSessionVersion,
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Невалидный или истёкший токен" });
  }
}

router.post("/login/request-code", async (req, res) => {
  const rawEmail = String(req.body?.email || "").trim().toLowerCase();

  if (!rawEmail || !EMAIL_RE.test(rawEmail)) {
    return res.status(400).json({ error: "Укажите корректную почту" });
  }

  try {
    const userResult = await query(
      `SELECT id FROM users
       WHERE LOWER(email) = LOWER($1) OR LOWER(login) = LOWER($1)
       LIMIT 1`,
      [rawEmail]
    );

    const userId = userResult.rowCount > 0 ? userResult.rows[0].id : null;
    const code = generateCode();

    await query(
      `INSERT INTO auth_codes (email, code, purpose, user_id, expires_at)
       VALUES ($1, $2, 'login', $3, NOW() + ($4 || ' minutes')::INTERVAL)`,
      [rawEmail, code, userId, CODE_TTL_MINUTES]
    );

    await sendCodeEmail(rawEmail, "Код входа в личный кабинет Коровушкино", code);

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/login/confirm-code", async (req, res) => {
  const rawEmail = String(req.body?.email || "").trim().toLowerCase();
  const rawCode = String(req.body?.code || "").trim();

  if (!rawEmail || !rawCode) {
    return res.status(400).json({ error: "Почта и код обязательны" });
  }

  try {
    const codeResult = await query(
      `SELECT id, user_id FROM auth_codes
       WHERE email = $1 AND code = $2 AND purpose = 'login'
         AND expires_at > NOW() AND used_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      [rawEmail, rawCode]
    );

    if (codeResult.rowCount === 0) {
      return res.status(400).json({ error: "Неверный или просроченный код" });
    }

    let userRow = null;

    if (codeResult.rows[0].user_id) {
      const userResult = await query(
        `SELECT ${USER_SELECT_FIELDS} FROM users WHERE id = $1 LIMIT 1`,
        [codeResult.rows[0].user_id]
      );
      userRow = userResult.rows[0] || null;
    }

    if (!userRow) {
      const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10);
      const created = await query(
        `INSERT INTO users (login, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING ${USER_SELECT_FIELDS}`,
        [rawEmail, rawEmail, passwordHash]
      );
      userRow = created.rows[0];
    }

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

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT ${USER_SELECT_FIELDS} FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    return res.json({ user: normalizeUserRow(result.rows[0]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.patch("/me", authMiddleware, async (req, res) => {
  const body = req.body || {};
  const canUpdate = ["surname", "firstName", "phone"].some((key) =>
    Object.prototype.hasOwnProperty.call(body, key)
  );

  if (!canUpdate) {
    return res.status(400).json({ error: "Нечего обновлять" });
  }

  try {
    const hasSurname = Object.prototype.hasOwnProperty.call(body, "surname");
    const hasFirstName = Object.prototype.hasOwnProperty.call(body, "firstName");
    const hasPhone = Object.prototype.hasOwnProperty.call(body, "phone");

    const nextSurname = hasSurname ? String(body.surname || "").trim() : undefined;
    const nextFirstName = hasFirstName ? String(body.firstName || "").trim() : undefined;
    const nextPhone = hasPhone ? String(body.phone || "").trim() : undefined;

    const result = await query(
      `UPDATE users
       SET surname = CASE WHEN $2 THEN $3 ELSE surname END,
           first_name = CASE WHEN $4 THEN $5 ELSE first_name END,
           phone = CASE WHEN $6 THEN $7 ELSE phone END,
           updated_at = NOW()
       WHERE id = $1
       RETURNING ${USER_SELECT_FIELDS}`,
      [
        req.user.id,
        hasSurname,
        nextSurname ?? null,
        hasFirstName,
        nextFirstName ?? null,
        hasPhone,
        nextPhone ?? null,
      ]
    );

    return res.json({ user: normalizeUserRow(result.rows[0]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
