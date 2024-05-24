"use client";
import supabase from "@/utils/supabase/client";
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
    additionalInformation: string;
    availableTourId: string;
    created_at: string;
    dateOfBirth: string;
    deposit: string;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    nationality: string;
    pax: number;
    paymentMethod: "invoice" | "credit-card";
    paymentType: "half" | "full";
    peopleCount: number;
    phoneNumber: string;
    total: number;
    transactionDetail: string | null;
    transactionId: string;
    invoiceProcessed: boolean;
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
      const res = await axios.post(`/api/check-transaction`, {
        transactionId: transactionid,
      });
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
              {transactionDetail?.transaction.paymentMethod == "invoice" ? (
                transactionDetail?.transaction.invoiceProcessed ? (
                  "Success"
                ) : (
                  "Processing"
                )
              ) : (
                <>
                  {transactionDetail?.invoice?.status === "SENT"
                    ? transactionDetail?.invoice?.errorCode === "000"
                      ? "Success"
                      : "Failed"
                    : "Pending"}
                </>
              )}
            </div>
            <div className="text-base lg:text-lg">
              {transactionDetail?.transaction.paymentMethod == "invoice" ? (
                transactionDetail?.transaction.invoiceProcessed ? (
                  "We have successfully sent invoice to your email."
                ) : (
                  "Your departure has been successfully booked. We are currently processing your invoice. Please check your email regularly for the invoice."
                )
              ) : (
                <>
                  {transactionDetail?.invoice?.status === "SENT"
                    ? transactionDetail?.invoice?.errorCode === "000"
                      ? "Your payment has been processed successfully"
                      : "Unfortunately payment was rejected"
                    : "Transaction is Pending"}
                </>
              )}
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
