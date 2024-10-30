import nodemailer from "nodemailer";
import { createClient } from "@/utils/supabase/server";
import { mailTemplate } from "@/utils";
import { NextResponse } from "next/server";
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
    !body.email ||
    !body.phoneNumber ||
    !body.age ||
    !body.internationalDriverLicence ||
    !body.startDate ||
    !body.endDate ||
    !body.rentalCarId ||
    !body.withDriver ||
    !body.price
  ) {
    return NextResponse.json(
      {
        error: {
          message: "Bad Request",
        },
      },
      {
        status: 400,
      }
    );
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    age,
    internationalDriverLicence,
    startDate,
    endDate,
    rentalCarId,
    withDriver,
    price,
  } = body;



  const { error } = await supabase.from("carRentalRequests").insert({
    firstName,
    lastName,
    phoneNumber,
    email,
    age,
    internationalDriverLicence: internationalDriverLicence == "1" ? true : false,
    startDate,
    endDate,
    rentalCarId,
    withDriver: withDriver == "1" ? true : false,
    price,
    status: "Pending",
  });

  if (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 400,
      }
    );
  }

  // const { text, html, subject } = mailTemplate("requestReply", {
  //   name: firstName + " " + lastName,
  // });

  // const {
  //   text: adminText,
  //   html: adminHTML,
  //   subject: adminSubject,
  // } = mailTemplate("requestAdmin", {
  //   departureDetail: body,
  // });

  // const info = await transporter.sendMail({
  //   from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
  //   to: email,
  //   subject,
  //   text,
  //   html,
  // });

  // const adminInfo = await transporter.sendMail({
  //   from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
  //   to: process.env.ADMIN_EMAIL,
  //   subject: adminSubject,
  //   text: adminText,
  //   html: adminHTML,
  // });

  return NextResponse.json(
    {
      // info,
      // adminInfo,
      response: 'success'
    },
    {
      status: 200,
    }
  );
}
