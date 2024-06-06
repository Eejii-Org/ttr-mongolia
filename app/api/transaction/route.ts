import nodemailer from "nodemailer";
import { mailTemplate } from "@/utils";
import { createClient } from "@/utils/supabase/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    // Update transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .update({
        transactionDetail: body,
      })
      .eq("transactionId", body.transactionId)
      .select("*")
      .single();

    if (transactionError) {
      throw new Error("Failed to update transaction");
    }

    if (!transaction) {
      return new Response(
        JSON.stringify({
          errorMessage: "No transaction found",
          errorCode: 404,
        }),
        { status: 404 }
      );
    }

    if (transaction.availableTourId == "-1") {
      /* Custom Payment */

      if (body.errorCode !== "000") {
        return new Response(
          JSON.stringify({
            errorMessage: "Transaction Failed",
            errorCode: 200,
          }),
          { status: 200 }
        );
      }
      const { text, html, subject } = mailTemplate("customPayReceipt", {
        transactionDetail: { ...transaction },
      });
      await transporter.sendMail({
        from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`,
        to: transaction.email,
        subject,
        text,
        html,
      });
      return new Response(
        JSON.stringify({
          errorMessage: "Success",
          errorCode: 200,
        }),
        { status: 200 }
      );
      return;
    }

    // Fetch tour and available tour data
    const { data: availableTourData, error: availableTourError } =
      await supabase
        .from("availableTours")
        .select("tourId, date")
        .eq("id", transaction.availableTourId)
        .single();

    if (availableTourError) {
      throw new Error("Failed to fetch available tour data");
    }

    if (!availableTourData) {
      return new Response(
        JSON.stringify({
          errorMessage: "No available tour found",
          errorCode: 404,
        }),
        { status: 404 }
      );
    }

    const { data: tourData, error: tourError } = await supabase
      .from("tours")
      .select("title, days")
      .eq("id", availableTourData.tourId)
      .single();

    if (tourError) {
      throw new Error("Failed to fetch tour data");
    }

    if (!tourData) {
      return new Response(
        JSON.stringify({
          errorMessage: "No tour found",
          errorCode: 404,
        }),
        { status: 404 }
      );
    }

    // Compose email templates
    const { text, html, subject } = mailTemplate(
      body.errorCode === "000" ? "bookSuccess" : "bookFail",
      {
        name: transaction.firstName + " " + transaction.lastName,
        paymentURL: `https://www.ttrmongolia.com/book?availableTourId=${transaction.availableTourId}`,
        tourDetail: {
          title: tourData.title,
          date: availableTourData.date,
          duration: tourData.days,
          peopleCount: transaction.peopleCount,
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
    // receipt
    const {
      text: receiptText,
      html: receiptHTML,
      subject: receiptSubject,
    } = mailTemplate("bookSuccessReceipt", {
      transactionDetail: { ...transaction },
    });
    await transporter.sendMail({
      from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`,
      to: transaction.email,
      subject: receiptSubject,
      text: receiptText,
      html: receiptHTML,
    });

    // Send emails
    await transporter.sendMail({
      from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`,
      to: transaction.email,
      subject,
      text,
      html,
    });

    await transporter.sendMail({
      from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: adminSubject,
      text: adminText,
      html: adminHTML,
    });

    return new Response(
      JSON.stringify({
        errorMessage: "Success",
        errorCode: 200,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ errorMessage: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}

const sentReceipt = (transaction: TransactionType) => {};
