import { mailTemplate } from "@/utils";
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
  const { departureRequest, status, availableTourId } = body;
  if (
    !departureRequest ||
    !status ||
    (!availableTourId && availableTourId !== "")
  ) {
    return Response.json({
      status: 400,
      message: "Bad Request",
    });
  }
  const { firstName, lastName, adminNote } = departureRequest;
  const { text, html, subject } = mailTemplate(status == "Denied" ?"requestDeny" : "requestApprove", {
    name: firstName + " " + lastName,
    bookURL: `https://ttr-mongolia.vercel.app/book?availableTourId=${availableTourId}`,
    adminNote: adminNote,
   });
  const info = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: departureRequest.email,
    subject,
    text,
    html,
  });
  return Response.json({
    info,
  });
}
