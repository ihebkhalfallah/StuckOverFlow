import nodemailer from "nodemailer";
import ApiError from "../utils/apiError.js";
import httpStatus from "http-status";

// Function to send email
export async function sendEmail(to, subject, text, html) {
  try {
    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_FROM}>`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);

    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error sending email");
  }
}
