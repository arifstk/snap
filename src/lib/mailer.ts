// lib/mailer.ts
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  // host: "smtp.example.com",
  // port: 587,
  // secure: false,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"snap", <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  })
}

