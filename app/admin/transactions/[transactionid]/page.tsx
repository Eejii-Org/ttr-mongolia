"use client";
import { supabase } from "@/utils/supabase/client";
import { ArrowLeft, EmailIcon, Input, PhoneIcon } from "@components";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";

const Transaction = () => {
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionType | null>(null);
  const [tourData, setTourData] = useState<TourType | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { transactionid } = params;
  const [isNotFound, setIsNotFound] = useState(false);
  const leave = async () => {
    router.push("/admin/transactions");
    return;
  };
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("id", transactionid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        const { data: availableTourData, error: err } = await supabase
          .from("availableTours")
          .select("tourId")
          .eq("id", data[0].availableTourId)
          .limit(1)
          .single();
        if (err) {
          throw err;
        }
        const { data: tourData, error: er } = await supabase
          .from("tours")
          .select("title")
          .eq("id", availableTourData.tourId);
        if (er) {
          throw er;
        }
        if (tourData.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setTourData(tourData[0] as TourType);
        setTransaction(data[0] as TransactionType);
      } catch (error: any) {
        console.error("Error fetching transaction:", error.message);
        toast.error("Error fetching transaction:", error.message);
      }
      setLoading(false);
    };
    fetchTransaction();
  }, [transactionid]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <div className="flex flex-row items-center gap-4">
        <button
          onClick={leave}
          className="flex p-2 ripple rounded-full bg-tertiary border"
        >
          <ArrowLeft color="black" />
        </button>
        <div className="text-2xl md:text-4xl font-semibold">
          {isNotFound
            ? "Tour not found"
            : `Transaction Number: ${transaction?.id}`}
        </div>
      </div>
      {transaction && (
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <Detail transaction={transaction} tourData={tourData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Detail = ({
  transaction,
  tourData,
}: {
  transaction: TransactionType;
  tourData: TourType | null;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="text-2xl md:text-4xl font-semibold">
          {tourData?.title}
        </div>
        <div>
          {transaction?.transactionDetail &&
          transaction?.transactionDetail !== "" &&
          transaction?.transactionDetail?.status == "SENT" ? (
            <div
              className={`border border-green-500 bg-green-500/10 w-min px-5 py-3 text-base rounded text-green-500`}
            >
              Success
            </div>
          ) : (
            <div
              className={`border border-red-500 bg-red-500/10 w-min px-5 py-3 text-base rounded text-red-500`}
            >
              Awaiting
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">TransactionId:</label>
          <Input
            type="text"
            placeholder="X123456"
            value={transaction.transactionId}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">Amount:</label>
          <Input
            type="text"
            placeholder="$0000"
            value={transaction.amount}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">FirstName:</label>
          <Input
            type="text"
            placeholder="John"
            value={transaction.firstName}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">LastName:</label>
          <Input
            type="text"
            placeholder="Doe"
            value={transaction.lastName}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">PhoneNumber:</label>
          <Input
            type="text"
            placeholder="+976 9999 9999"
            value={transaction.phoneNumber}
            icon={<PhoneIcon />}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">Email:</label>
          <Input
            type="text"
            placeholder="test@gmail.com"
            value={transaction.email}
            icon={<EmailIcon />}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Nationality:</label>
          <Input
            type="text"
            placeholder="Mongolia"
            value={transaction.nationality}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">Date Of Birth:</label>
          <Input
            type="text"
            placeholder="January 1 2001"
            value={transaction.dateOfBirth}
            disabled
          />
        </div>
      </div>
      <div className="flex">
        <div className="min-w-80">
          <label className="pl-2 font-medium">People Count:</label>
          <Input
            type="text"
            placeholder="1"
            value={transaction.peopleCount}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Additional Information:</label>
        <textarea
          placeholder="Additional Information"
          className=" min-h-48 w-full p-4 border rounded-xl"
          value={transaction.additionalInformation}
          disabled
        ></textarea>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Golomt Information:</label>
        <pre id="json" className="p-4 border rounded-xl">
          {JSON.stringify(
            transaction.transactionDetail ||
              "No Transaction Detail from Golomt Found",
            undefined,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default Transaction;
