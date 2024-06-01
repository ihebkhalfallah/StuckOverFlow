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
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendEmail = async (to, subject = 'Your Reservation is Successful', text = 'Thank you for your reservation.') => {
    const mailOptions = {
      from: `"BodySmith _ La fitnesse pour tous" <${process.env.EMAIL_USER}>`, 
      to,
      subject,
      text,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

// export const sendReservationMail = async (to) => {
//   const subject = "Your Reservation is succefful";

//   const templatePath = path.resolve("templates", "approvalEmailTemplate.html");
//   let htmlTemplate = fs.readFileSync(templatePath, "utf-8");


//   await sendEmail(to, subject, htmlTemplate);
// };