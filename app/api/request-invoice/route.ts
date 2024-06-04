import crypto from "crypto";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
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

type BodyType = {
  personalDetail: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    nationality: string;
    dateOfBirth: string;
    peopleCount: number;
    additionalInformation: string;
  };
  paymentType: string;
  paymentMethod: string;
  availableTourId: number;
  tourTitle: string;
  startingDate: string;
  deposit: string;
  pax: number;
  total: number;
};

export async function POST(request: Request) {
  const supabase = createClient();
  const body: BodyType = await request.json();
  const { deposit, pax, total, availableTourId, paymentMethod, paymentType } =
    body;
  // deposit can be either half or total amount the value
  const transactionId = generateTransactionId();

  /* Save to Database */
  const { error } = await supabase.from("transactions").insert({
    ...body.personalDetail,
    transactionId: transactionId,
    availableTourId,
    transactionDetail: null,
    paymentMethod,
    paymentType,
    deposit,
    pax,
    total,
    invoiceProcessed: false,
  });

  if (error) {
    return Response.json({
      status: error.code,
      statusText: error.message,
    });
  }

  /* Generate Invoice through Golomt Bank */
  if (paymentMethod == "credit-card") {
    const inv = await getInvoice(transactionId, deposit);
    return Response.json(inv.data);
  }
  const res = await bookInvoice(body);
  return Response.json({ mail: res, transactionId });
}

const hmac256 = (message: string) => {
  let hash = crypto
    .createHmac("sha256", process.env.GOLOMT_KEY as crypto.BinaryLike)
    .update(message);
  return hash.digest("hex");
};
const generateTransactionId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let transactionId = "";
  const idLength = Math.floor(Math.random() * 6) + 10; // Random length between 10 and 15
  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters.charAt(randomIndex);
  }
  return transactionId;
};
const getInvoice = async (transactionId: string, amount: string) => {
  return await axios.post(
    "https://ecommerce.golomtbank.com/api/invoice",
    {
      amount: amount,
      callback: `https://www.ttrmongolia.com/book/result/${transactionId}`,
      checksum: hmac256(
        transactionId +
          amount +
          "GET" +
          `https://www.ttrmongolia.com/book/result/${transactionId}`
      ),
      genToken: "Y",
      returnType: "GET",
      transactionId: transactionId,
      socialDeeplink: "N",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.GOLOMT_TOKEN,
      },
    }
  );
};
const bookInvoice = async (body: any) => {
  const {
    text: customerText,
    html: customerHTML,
    subject: customerSubject,
  } = mailTemplate("bookInvoice", {
    bookingDetail: body,
  });
  const {
    text: adminText,
    html: adminHTML,
    subject: adminSubject,
  } = mailTemplate("adminBookInvoice", {
    bookingDetail: body,
  });
  const customerInfo = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: body.personalDetail.email,
    subject: customerSubject,
    text: customerText,
    html: customerHTML,
  });
  const adminInfo = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: process.env.ADMIN_EMAIL,
    subject: adminSubject,
    text: adminText,
    html: adminHTML,
  });
  console.log(customerInfo, adminInfo);
  return customerInfo;
};
