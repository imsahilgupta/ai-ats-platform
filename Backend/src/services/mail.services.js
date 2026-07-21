const nodemailer = require("nodemailer");
const notificationModel = require("../models/notification.model");

let transporter;
let transporterChecked = false;

/**
 * Lazily builds the SMTP transporter from env vars. Returns null (rather than
 * throwing) when SMTP isn't configured, so the app degrades to log-only
 * instead of crashing every flow that sends an email in local/dev setups.
 */
function getTransporter() {
  if (transporterChecked) return transporter;
  transporterChecked = true;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[MAIL] SMTP_HOST/SMTP_USER/SMTP_PASS not set — emails will be logged, not sent.");
    transporter = null;
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function layout(title, bodyHtml) {
  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
    <p style="font-size: 18px; font-weight: 700; margin: 0 0 24px;">MockMate<span style="color:#6d5bfa;">.AI</span></p>
    <h1 style="font-size: 20px; margin: 0 0 16px;">${title}</h1>
    ${bodyHtml}
    <p style="margin-top: 32px; font-size: 12px; color: #888;">This is an automated message from MockMate.AI.</p>
  </div>`;
}

/**
 * Sends a real email via SMTP when configured; otherwise logs it. Never
 * throws — callers (registration, payment verification, etc.) should not
 * fail their primary action just because an email couldn't be delivered.
 */
async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();

  if (!t) {
    const plainBody = (text || html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    console.log(`[MAIL] (not sent — SMTP unconfigured) To: ${to} | Subject: ${subject}\n  ${plainBody}`);
    return { sent: false, reason: "smtp_not_configured" };
  }

  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || `"MockMate.AI" <no-reply@mockmate.ai>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " "),
    });
    return { sent: true };
  } catch (err) {
    console.error(`[MAIL] Failed to send to ${to}:`, err.message);
    return { sent: false, reason: err.message };
  }
}

function sendVerificationCodeEmail(toEmail, code) {
  return sendMail({
    to: toEmail,
    subject: "Verify your MockMate.AI account",
    html: layout(
      "Confirm your email address",
      `<p>Use this code to verify your account. It expires in 10 minutes.</p>
       <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 24px 0;">${code}</p>`,
    ),
  });
}

function sendPasswordResetCodeEmail(toEmail, code) {
  return sendMail({
    to: toEmail,
    subject: "Reset your MockMate.AI password",
    html: layout(
      "Reset your password",
      `<p>Use this code to reset your password. It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
       <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 24px 0;">${code}</p>`,
    ),
  });
}

function sendBillingReceiptEmail(toEmail, { plan, amountNpr, transactionId, gateway, billedAt, renewsAt }) {
  return sendMail({
    to: toEmail,
    subject: `Receipt: your MockMate.AI ${plan} plan payment`,
    html: layout(
      "Payment receipt",
      `<p>Your MockMate.AI subscription has been upgraded to <strong>${plan}</strong>. Enjoy your new benefits!</p>
       <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
         <tr><td style="padding: 6px 0; color: #666;">Plan</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${plan}</td></tr>
         <tr><td style="padding: 6px 0; color: #666;">Amount charged</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">NPR ${amountNpr.toLocaleString()}</td></tr>
         <tr><td style="padding: 6px 0; color: #666;">Payment method</td><td style="padding: 6px 0; text-align: right;">${gateway}</td></tr>
         <tr><td style="padding: 6px 0; color: #666;">Transaction ID</td><td style="padding: 6px 0; text-align: right; font-family: monospace;">${transactionId}</td></tr>
         <tr><td style="padding: 6px 0; color: #666;">Billed on</td><td style="padding: 6px 0; text-align: right;">${new Date(billedAt).toLocaleDateString()}</td></tr>
         <tr><td style="padding: 6px 0; color: #666;">Renews on</td><td style="padding: 6px 0; text-align: right;">${new Date(renewsAt).toLocaleDateString()}</td></tr>
       </table>
       <p>Keep this email for your records.</p>`,
    ),
  });
}

function sendMockInterviewCompletedEmail(toEmail, { role, overallScore }) {
  return sendMail({
    to: toEmail,
    subject: "Your mock interview results are ready",
    html: layout(
      "Mock interview completed",
      `<p>Your <strong>${role}</strong> mock interview is complete.</p>
       <p style="font-size: 28px; font-weight: 700; margin: 16px 0;">${overallScore}/100</p>
       <p>Log in to MockMate.AI to see your full feedback report.</p>`,
    ),
  });
}

function sendResumeAnalysisCompletedEmail(toEmail, { atsScore, versionLabel }) {
  return sendMail({
    to: toEmail,
    subject: "Your resume ATS score is ready",
    html: layout(
      "Resume analysis completed",
      `<p>Your resume analysis (${versionLabel}) is complete.</p>
       <p style="font-size: 28px; font-weight: 700; margin: 16px 0;">${atsScore}/100</p>
       <p>Log in to MockMate.AI to see keyword gaps and bullet-point rewrites.</p>`,
    ),
  });
}

function sendCareerReportGeneratedEmail(toEmail, { matchScore }) {
  return sendMail({
    to: toEmail,
    subject: "Your career strategy report is ready",
    html: layout(
      "Career report generated",
      `<p>Your career strategy report is ready, with a job match score of:</p>
       <p style="font-size: 28px; font-weight: 700; margin: 16px 0;">${matchScore}/100</p>
       <p>Log in to MockMate.AI to see your skill gaps and preparation plan.</p>`,
    ),
  });
}

/**
 * Sends a real email AND logs it as an in-app notification, so the
 * notification bell and the inbox reflect what was actually emailed.
 */
async function sendEmailNotification({ userId, toEmail, subject, text, html, type = "system" }) {
  const result = await sendMail({ to: toEmail, subject, html: html || `<p>${text}</p>`, text });

  try {
    const notif = await notificationModel.create({
      user: userId,
      type,
      message: `[${subject}] ${text || ""}`,
      emailSent: result.sent,
      scheduledFor: new Date(),
    });
    return notif;
  } catch (err) {
    console.error("Failed to create notification log:", err);
    throw err;
  }
}

module.exports = {
  sendMail,
  sendVerificationCodeEmail,
  sendPasswordResetCodeEmail,
  sendBillingReceiptEmail,
  sendMockInterviewCompletedEmail,
  sendResumeAnalysisCompletedEmail,
  sendCareerReportGeneratedEmail,
  sendEmailNotification,
};
