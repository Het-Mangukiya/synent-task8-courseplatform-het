const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log('✅ Email service ready'))
  .catch((err) => console.error('❌ Email config error:', err.message));

/**
 * Send verification email
 */
const sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(to)}`;
  console.log(`✉️ [Email Service] Verification link for ${to}: ${verifyUrl}`);

  const html = `<p>Hi ${name}, verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`;

  try {
    await transporter.sendMail({
      from: `"Craftline" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: 'Verify your email — Craftline',
      html,
    });
  } catch (err) {
    console.warn(`⚠️ [Email Service] SMTP send failed: ${err.message}. Use console verification link for development.`);
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (to, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log(`✉️ [Email Service] Password reset link for ${to}: ${resetUrl}`);

  const html = `<p>Hi ${name}, reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`;

  try {
    await transporter.sendMail({
      from: `"Craftline" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: 'Reset your password — Craftline',
      html,
    });
  } catch (err) {
    console.warn(`⚠️ [Email Service] SMTP send failed: ${err.message}. Use console password reset link for development.`);
  }
};

/**
 * Send enrollment confirmation email
 */
const sendEnrollmentEmail = async (to, name, courseName) => {
  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #fff; border: 1px solid #eaedf0; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; color: #7A4213; margin: 0;">Craftline</h1>
      </div>
      <h2 style="font-size: 20px; color: #0A0A0A; margin-bottom: 8px;">Enrollment confirmed!</h2>
      <p style="color: #737880; font-size: 15px; line-height: 1.6;">
        Hi ${name},<br/><br/>
        You have been successfully enrolled in <strong style="color: #0A0A0A;">${courseName}</strong>. You can start learning right away!
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 32px; background: #16A34A; color: #fff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Start Learning →
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #eaedf0; margin: 24px 0;" />
      <p style="color: #aaa; font-size: 12px; text-align: center;">
        Happy learning! — The Craftline Team
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Craftline" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `Enrolled: ${courseName} — Craftline`,
    html,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendEnrollmentEmail };
