import Link from "next/link";
import { FC } from "react";

export const CustomerSupport: FC = () => {
  return (
    <div className="bg-[#f7ecd5]">
      <div className="mx-3 md:mx-auto container px-6 py-9 flex flex-col lg:flex-row items-center  gap-0 text-left md:items-end lg:gap-8">
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-lg md:text-2xl font-semibold">
            24/7 Customer Support
          </div>
          <div className="text-base md:text-lg">
            No matter the hour or the destination, our travel agency provides
            round-the-clock customer support. From itinerary changes to urgent
            assistance during your trip, our team of experts is just a call,
            email, or chat away. Travel confidently knowing we're here for you,
            24/7.
          </div>
        </div>

        <Link
          href="/contact"
          className="ripple bg-primary text-tertiary py-3 px-16 gip mt-6 cursor-pointer font-semibold"
        >
          Contact Now
        </Link>
      </div>
    </div>
  );
};
