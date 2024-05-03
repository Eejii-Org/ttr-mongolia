import Link from "next/link";
import { FC } from "react";

export const PrivateTour: FC = () => {
  return (
    <div className="bg-[#1e1e1e]">
      <div className="md:mx-auto container px-6 py-9 flex flex-col lg:flex-row items-center  gap-0 text-left md:items-end lg:gap-8">
        <div className="flex flex-col gap-2 flex-1 text-tertiary">
          <div className="text-lg md:text-2xl font-semibold">
            Request a Private Tour
          </div>
          <div className="text-base md:text-lg opacity-70">
            If you’re looking to enjoy a trip with your loves ones privately,
            fill up our form and our team will be in touch.
          </div>
        </div>

        <Link
          href="/privatetour"
          className="ripple bg-[#FDA403]/20 border border-primary text-primary py-3 px-12 gip mt-6 cursor-pointer font-semibold rounded"
        >
          Request Private Tour
        </Link>
      </div>
    </div>
  );
};
