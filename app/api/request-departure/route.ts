import nodemailer from "nodemailer";
import { createClient } from "@/utils/supabase/server";
import { mailTemplate } from "@/utils";
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
  const supabase = createClient();
  const body = await request.json();
  if (
    !body.firstName ||
    !body.lastName ||
    !body.phoneNumber ||
    !body.email ||
    !body.nationality ||
    !body.dateOfBirth ||
    !body.peopleCount ||
    !body.tourId ||
    !body.startingDate
  ) {
    return Response.json({
      status: 400,
      message: "Bad Request",
    });
  }
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    nationality,
    dateOfBirth,
    peopleCount,
    additionalInformation,
    tourId,
    startingDate,
    tourTitle,
  } = body;
  const { data, error } = await supabase
    .from("departureRequests")
    .insert({
      firstName,
      lastName,
      phoneNumber,
      email,
      nationality,
      dateOfBirth,
      peopleCount,
      additionalInformation,
      tourId,
      startingDate,
      status: "Pending",
    })
    .select()
    .single();
  if (error) {
    return Response.json(error);
  }
  const { text, html, subject } = mailTemplate("requestReply", {
    name: firstName + " " + lastName,
    
  });
  const { text: adminText, html: adminHTML, subject: adminSubject } = mailTemplate("requestAdmin", {
    departureDetail:body,
  });
  const info = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: email,
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
    adminInfo
  });
}
