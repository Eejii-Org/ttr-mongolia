"use client";
import { Footer, Header } from "@components";

const Booking = () => {
  return (
    <div className="flex-1 w-full flex flex-col min-h-screen justify-between">
      <div className="flex flex-col gap-16 flex-1">
        <Header transparent={false} />
        <div className="flex flex-row gap-8 pt-14 mx-3 md:mx-6 flex-1 bg-red">
          <div className="flex-1">Test</div>
          <div className="flex-1 flex">
            {/* <iframe
              src={`https://ecommerce.golomtbank.com/payment/en/invoice`}
              className="flex-1"
            /> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Booking;
