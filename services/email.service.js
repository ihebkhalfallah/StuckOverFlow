import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use any email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
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
