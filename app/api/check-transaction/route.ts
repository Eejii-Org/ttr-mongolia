import crypto from "crypto";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.transactionId) {
    return Response.json({
      status: 400,
      message: "Bad Request",
    });
  }
  const { transactionId } = body;
  const { data, error } = await supabase
    .from("transactions")
    .select()
    .eq("transactionId", transactionId)
    .limit(1)
    .single();

  if (error) {
    return Response.json(error);
  }
  const { data: availableTour, error: err } = await supabase
    .from("availableTours")
    .select()
    .eq("id", data.availableTourId)
    .limit(1)
    .single();
  if (err) {
    return Response.json(err);
  }
  const { error: er } = await supabase
    .from("transactions")
    .update({
      transactionDetail: data,
    })
    .eq("transactionId", transactionId);
  if (er) {
    return Response.json(er);
  }
  const res = await checkInvoice(transactionId);
  return Response.json({
    transaction: data,
    availableTour: availableTour,
    invoice: res.data,
  });
}

const hmac256 = (message: string) => {
  let hash = crypto
    .createHmac("sha256", process.env.GOLOMT_KEY as crypto.BinaryLike)
    .update(message);
  return hash.digest("hex");
};

const checkInvoice = async (transactionId: string) => {
  return await axios.post(
    "https://ecommerce.golomtbank.com/api/inquiry",
    {
      transactionId: transactionId,
      checksum: hmac256(transactionId + transactionId),
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.GOLOMT_TOKEN,
      },
    }
  );
};

// type transactionType = {
//   id: string;
//   created_at: string;
//   amount: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   nationality: string;
//   dateOfBirth: string;
//   peopleCount: number;
//   transactionDetail: any;
//   transactionId: any;
//   additionalInformation: string;
//   availableTourId: string;
// };
