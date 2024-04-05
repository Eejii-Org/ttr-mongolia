import crypto from "crypto";
import axios from "axios";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET() {
  // const body = await request.json();
  const transactionId = Math.random().toString(36).substring(2, 9);
  const getInvoice = async () => {
    return await axios.post(
      "https://ecommerce.golomtbank.com/api/invoice",
      {
        amount: 1,
        callback: "https://ttr-mongolia.vercel.app",
        checksum: hmac256(
          transactionId + 1 + "GET" + "https://ttr-mongolia.vercel.app"
        ),
        genToken: "N",
        returnType: "GET",
        transactionId: transactionId,
        socialDeeplink: "N",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.GOLOMT_TOKEN,
        },
      }
    );
  };
  const res = await getInvoice();
  console.log(res);
  return Response.json(res.data);
}

function hmac256(message: string) {
  let hash = crypto.createHmac("sha256", "kuWpouuElin)cO!Z").update(message);
  return hash.digest("hex");
}
