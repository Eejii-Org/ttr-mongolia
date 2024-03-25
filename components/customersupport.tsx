import { FC } from "react";

export const CustomerSupport: FC = () => {
  return (
    <div className="mx-6 p-6 flex flex-row items-end bg-quinary rounded-3xl gap-8">
      <div className="flex flex-col gap-2 flex-1">
        <div className="text-3xl font-semibold">24/7 Customer Support</div>
        <div className="text-xl">
          No matter the hour or the destination, our travel agency provides
          round-the-clock customer support. From itinerary changes to urgent
          assistance during your trip, our team of experts is just a call,
          email, or chat away. Travel confidently knowing we're here for you,
          24/7.
        </div>
      </div>
      <div className="ripple bg-primary text-tertiary py-3 px-16 gip rounded-full mt-6 cursor-pointer font-semibold">
        Contact Now
      </div>
    </div>
  );
};
