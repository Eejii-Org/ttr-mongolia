"use client";
import { MainLayout } from "@components";
import axios from "axios";
import _ from "lodash";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

const CP = ({ searchParams }: { searchParams: { amount: string } }) => {
  const { amount } = searchParams;
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pay = async () => {
    setError(null);
    if (Number(amount) <= 0 || !_.isNumber(Number(amount))) {
      setError("Not a Number");
      return;
    }
    setPayLoading(true);
    const res = await axios.post(`/api/custom-invoice`, {
      deposit: amount,
      availableTourId: -1,
    });
    if (res.status !== 200) {
      setError(res.statusText);
    }
    setPayLoading(false);
    router.push(`/book/payment?invoice=${res.data.invoice}`);
  };
  if (!amount) {
    redirect("/");
    return;
  }
  return (
    <MainLayout>
      <div className="flex-1 items-center justify-center flex flex-col gap-4">
        <h1 className="font-semibold text-2xl">Custom Payment</h1>
        <div className="text-xl">
          <span className="font-semibold">Amount: </span>${amount}
        </div>
        {error && (
          <div className="font-semibold text-red-600">Error: {error}</div>
        )}
        <button
          onClick={pay}
          className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold ripple rounded min-w-80"
        >
          {payLoading ? "Loading" : "Pay"}
        </button>
      </div>
    </MainLayout>
  );
};

export default CP;
