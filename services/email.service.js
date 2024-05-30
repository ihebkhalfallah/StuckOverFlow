import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, approvalCode) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/approvalEmailTemplate.html"
    );
    let htmlContent = fs.readFileSync(templatePath, "utf8");
    htmlContent = htmlContent.replace("{{approvalCode}}", approvalCode);

    const mailOptions = {
      from: `"Your Name" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendApprovalCode = async (to, approvalCode) => {
  const subject = "Your Account Approval Code";

  const templatePath = path.resolve("templates", "approvalEmailTemplate.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace("{{approvalCode}}", approvalCode);

  await sendEmail(to, subject, htmlTemplate);
};
