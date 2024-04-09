import Link from "next/link";
import { FC } from "react";

export const CustomerSupport: FC = () => {
  return (
    <div className="mx-3 md:mx-6 p-6 flex flex-col lg:flex-row items-center bg-quinary rounded-3xl gap-0 text-left md:items-end lg:gap-8">
      <div className="flex flex-col gap-2 flex-1">
        <div className="text-2xl md:text-3xl font-semibold">
          24/7 Customer Support
        </div>
        <div className="text-lg md:text-xl">
          No matter the hour or the destination, our travel agency provides
          round-the-clock customer support. From itinerary changes to urgent
          assistance during your trip, our team of experts is just a call,
          email, or chat away. Travel confidently knowing we're here for you,
          24/7.
        </div>
      </div>

      <Link
        href="/contact"
        className="ripple bg-primary text-tertiary py-3 px-16 gip rounded-full mt-6 cursor-pointer font-semibold"
      >
        Contact Now
      </Link>
    </div>
  );
};
