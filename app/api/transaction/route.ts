import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update({
      transactionDetail: body,
    })
    .eq("transactionId", body.transactionId)
    .select();
  // console.log(data, error);
  return Response.json(data);
}

const sendEmail = async () => {};
