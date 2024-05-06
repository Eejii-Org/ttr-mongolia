// For Golomt API PUSH NOTIF NOT DONE EMAIL USER
import nodemailer from "nodemailer";
import { mailTemplate } from "@/utils";
import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic";

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
  const { data: transaction } = await supabase
    .from("transactions")
    .update({
      transactionDetail: body,
    })
    .eq("transactionId", body.transactionId)
    .select("*")
    .single();
  if (!transaction)
    return Response.json({
      errorMessage: "no transaction found",
      errorCode: 404,
    });
  const { data: availableTourData } = await supabase
    .from("availableTours")
    .select("tourId, date")
    .eq("id", transaction.availableTourId)
    .single();
  if (!availableTourData) return Response.json(transaction);
  const { data: tourData } = await supabase
    .from("tours")
    .select("title, days, nights")
    .eq("id", availableTourData.tourId)
    .single();
  if (!tourData) return Response.json(transaction);
  const { text, html, subject } = mailTemplate(
    body.errorCode === "000" ? "bookSuccess" : "bookFail",
    {
      name: transaction?.firstName + " " + transaction?.lastName,
      paymentURL: `https://www.ttrmongolia.com/book?availableTourId=${transaction.availableTourId}`,
      tourDetail: {
        title: tourData?.title,
        date: availableTourData?.date,
        duration: tourData?.days,
        peopleCount: transaction?.peopleCount,
        paidAmount: body.amount,
      },
    }
  );
  const {
    text: adminText,
    html: adminHTML,
    subject: adminSubject,
  } = mailTemplate(
    body.errorCode === "000" ? "adminPaymentSuccess" : "adminPaymentFailure",
    {
      paymentDetail: {
        title: tourData.title,
        startingDate: availableTourData.date,
        amount: body.amount,
        ...transaction,
      },
    }
  );
  const info = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: transaction.email,
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
  return Response.json(transaction);
}
