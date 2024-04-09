import crypto from "crypto";
import axios from "axios";
export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.amount || !body.availableTourId) {
    return Response.json({
      status: 400,
      message: "Bad Request",
    });
  }
  const { amount } = body;
  const transactionId = generateTransactionId();
  const res = await getInvoice(transactionId, amount);

  return Response.json(res.data);
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
      callback: `https://ttr-mongolia.vercel.app/book/result/${transactionId}`,
      checksum: hmac256(
        transactionId +
          amount +
          "GET" +
          `https://ttr-mongolia.vercel.app/book/result/${transactionId}`
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