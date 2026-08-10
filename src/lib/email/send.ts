import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Bio Marketing";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!EMAIL_USER || !EMAIL_APP_PASSWORD) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_APP_PASSWORD },
    });
  }
  return transporter;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export type SendEmailResult = { sent: boolean; error?: string };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const t = getTransporter();
  if (!t) {
    console.warn(
      `[email] EMAIL_USER/EMAIL_APP_PASSWORD no configurados. No se envio: "${input.subject}" a ${input.to}.`
    );
    return { sent: false, error: "Credenciales de correo no configuradas." };
  }

  try {
    await t.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo || EMAIL_USER,
    });
    return { sent: true };
  } catch (error) {
    console.error("[email] Error enviando correo:", error);
    return { sent: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}
