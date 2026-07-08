import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP settings missing: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendCodeEmail(to, subject, code) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const text = `Ваш код для входа: ${code}\n\nКод действует 10 минут.`;

  const mailer = getTransporter();
  await mailer.sendMail({
    from,
    to,
    subject,
    text,
  });
}

export async function sendNewsletterWelcomeEmail(to) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject = "Вы подписаны на рассылку Коровушкино";
  const text = `Здравствуйте!

Спасибо, что подписались на рассылку «Коровушкино» и выбрали нас.

Мы будем присылать новости о ферме, новых продуктах и специальных предложениях.

С уважением,
команда «Коровушкино»`;

  const mailer = getTransporter();
  await mailer.sendMail({
    from,
    to,
    subject,
    text,
  });
}
