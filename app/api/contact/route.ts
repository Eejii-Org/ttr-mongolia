import { mailTemplate, templateTypeType } from "@/utils";
import nodemailer from "nodemailer";
export const dynamic = "force-dynamic"; // defaults to auto

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_PASSWORD,
  },
});

export async function POST(request: Request) {
  const body = await request.json();
  const { text, html, subject } = mailTemplate("contact", {
    name: body?.firstName + " " + body?.lastName,
  });
  const {
    text: adminText,
    html: adminHTML,
    subject: adminSubject,
  } = mailTemplate("contactAdmin", {
    userDetail: body,
  });
  const info = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: body.email,
    subject,
    text,
    html,
  });
  const adminInfo = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: process.env.ADMIN_EMAIL,
    subject: adminSubject,
    text: adminText,
    html: adminHTML,
  });
  return Response.json({
    info,
    adminInfo,
  });
}
