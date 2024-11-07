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
  const { requestData, status } = body;
  if (
    !requestData ||
    !status
  ) {
    return Response.json({
      status: 400,
      message: "Bad Request",
    });
  }
  const { firstName, lastName, rentalCarId } = requestData;
  const { text, html, subject } = mailTemplate(status == "Denied" ?"requestRentcarDeny" : "requestRentcarApprove", {
    name: firstName + " " + lastName,
    rentalcarURL: `https://www.ttrmongolia.com/rentalcars/${rentalCarId}`,
   });

  console.dir("====== email template:")
  console.dir(html)
  console.log("====== email template:")
  console.log(html)
  
  const info = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: requestData.email,
    subject,
    text,
    html,
  });
  return Response.json({
    info,
  });
}
