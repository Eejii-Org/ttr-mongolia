"use client";
import { MainLayout } from "@components";

const Payment = ({ searchParams }: { searchParams: { invoice: string } }) => {
  return (
    // <MainLayout>
    <div className="w-screen flex-1 flex">
      <iframe
        src={`https://ecommerce.golomtbank.com/payment/en/${searchParams.invoice}`}
        className="flex-1"
      />
    </div>
    // </MainLayout>
  );
};

export default Payment;
