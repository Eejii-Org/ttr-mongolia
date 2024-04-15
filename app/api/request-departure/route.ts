import nodemailer from "nodemailer";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
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
  const supabase = createClient();
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
  const info = await transporter.sendMail({
    from: `"TTR Mongolia Website Departure Request" <${process.env.CONTACT_EMAIL}>`, // sender address
    // to: "info@ttrmongolia.com", // list of receivers
    to: "enhuush0704@gmail.com",
    subject: `New Departure Request ${email}`, // Subject line
    text: `
      \n Tour Detail
      \n TourId: ${tourId}
      \n Tour Title: ${tourTitle}
      \n RequestedStartingDate: ${startingDate}
      \n Personal Information:
      \n Name: ${firstName} ${lastName}
      \n Email: ${email}
      \n PhoneNumber: ${phoneNumber}
      \n Nationality: ${nationality}
      \n DateOfBirth: ${dateOfBirth}
      \n People Count: ${peopleCount}
      \n Additional Information: ${additionalInformation}
  `, // plain text body
    html: `
        <div>
          <div>Tour Detail</div>
          <div>TourId: ${tourId}</div>
          <div>Tour Title: ${tourTitle}</div>
          <div>RequestedStartingDate: ${startingDate}</div>
          <div>Personal Information:</div>
          <div>Name: ${firstName} ${lastName}</div>
          <div>Email: ${email}</div>
          <div>PhoneNumber: ${phoneNumber}</div>
          <div>Nationality: ${nationality}</div>
          <div>DateOfBirth: ${dateOfBirth}</div>
          <div>People Count: ${peopleCount}</div>
          <div>Additional Information: ${additionalInformation}</div>
        </div>
      `, // html body
  });
  return Response.json({
    info,
  });
}
