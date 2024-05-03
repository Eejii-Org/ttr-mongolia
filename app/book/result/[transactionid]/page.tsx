"use client";
import { MainLayout } from "@components";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type transactionDetailType = {
  invoice: {
    amount: string;
    bank: string;
    bankCode: string;
    cardHolder: string;
    cardNumber: string;
    checksum: string;
    errorCode: null | string;
    errorDesc: string;
    status: "SENT" | "PENDING";
    transactionId: string;
  };
  transaction: {
    additionalInformation: "";
    amount: null;
    availableTourId: "";
    created_at: "";
    dateOfBirth: "";
    email: "";
    firstName: "";
    id: number;
    lastName: "";
    nationality: "";
    peopleCount: number;
    phoneNumber: "";
    transactionDetail: null;
    transactionId: "";
  };
  availalbeTour: {
    created_at: string;
    date: string;
    id: number;
    salePrice: number | null;
    tourId: number;
  };
};

const PaymentResult = () => {
  const router = useRouter();
  const params = useParams();
  const { transactionid } = params;
  const [transactionDetail, setTransactionDetail] =
    useState<transactionDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getStatus = async () => {
      setLoading(true);
      const res = await axios.post(
        "https://ttr-mongolia.vercel.app/api/check-transaction",
        {
          transactionId: transactionid,
        }
      );
      setTransactionDetail(res.data);
      setLoading(false);
    };
    getStatus();
  }, [transactionid]);
  return (
    <MainLayout>
      <div className="flex flex-1   items-center justify-center">
        {loading ? (
          <div>Loading</div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-2xl font-semibold lg:text-4xl">
              {transactionDetail?.invoice?.status === "SENT"
                ? "Success"
                : "Failed"}
            </div>
            <div className="text-base lg:text-lg">
              {transactionDetail?.invoice?.status === "SENT"
                ? "Your payment has been processed successfully"
                : "Unfortunately payment was rejected"}
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-primary px-32 py-3 text-center text-secondary whitespace-nowrap font-bold rounded-xl ripple"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PaymentResult;
