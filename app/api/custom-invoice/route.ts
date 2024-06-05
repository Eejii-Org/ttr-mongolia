import crypto from "crypto";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic"; // defaults to auto

type BodyType = {
  deposit: string;
  availableTourId: number;
};

export async function POST(request: Request) {
  const supabase = createClient();
  const body: BodyType = await request.json();
  const { deposit, availableTourId } = body;
  const transactionId = generateTransactionId();

  /* Save to Database */
  const { error } = await supabase.from("transactions").insert({
    deposit,
    availableTourId,
  });

  if (error) {
    return Response.json({
      status: error.code,
      statusText: error.message,
    });
  }

  /* Generate Invoice through Golomt Bank */
  const inv = await getInvoice(transactionId, deposit);
  console.log(inv);
  return Response.json(inv.data);
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
