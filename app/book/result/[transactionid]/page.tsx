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
      <div className="flex flex-1 items-center justify-center">
        {loading ? (
          <div>Loading</div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-2xl font-semibold lg:text-4xl">
              {transactionDetail?.transaction?.paymentMethod == "invoice" ? (
                transactionDetail?.transaction?.invoiceProcessed ? (
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
            <div className="text-base lg:text-lg text-center max-w-[600px] px-6">
              {transactionDetail?.transaction?.paymentMethod == "invoice" ? (
                transactionDetail?.transaction?.invoiceProcessed ? (
                  "We have successfully sent invoice to your email."
                ) : (
                  "Thank you for booking a tour with us ! We have received your request and will send you your invoice soon. Please check your emails regularly. Note that your tour is not confirmed until we receive payment. Thank you for understanding."
                )
              ) : (
                <>
                  {transactionDetail?.invoice?.status === "SENT"
                    ? transactionDetail?.invoice?.errorCode === "000"
                      ? "Thank you for booking a tour with us ! Your payment was successful. You will receive details of your booking by email. We are happy to welcome you soon for your adventure !"
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
