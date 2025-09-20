import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// 1. Configure transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Gmail address
    pass: process.env.SMTP_PASS, // 16-digit Google App Password
  },
});

// 2. Verify transporter (optional, but good for debugging)
transporter.verify()
  .then(() => console.log("📧 Mailer is ready"))
  .catch(err => console.error("❌ Mailer error:", err.message));

// 4. OTP email sender (use this in your signup/login flow)
export const sendOtpEmail = async (toEmail, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in ${
        process.env.OTP_EXPIRE_MINUTES || 10
      } minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong></p>
             <p>This code expires in ${
               process.env.OTP_EXPIRE_MINUTES || 10
             } minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP mail sent to ${toEmail}`);
  } catch (err) {
    console.error("❌ OTP mail failed:", err.message);
  }
};
