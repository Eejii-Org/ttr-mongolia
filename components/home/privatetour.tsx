import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
export const PrivateTour: FC = () => {
  return (
    <div className="bg-[#1e1e1e] relative">
      <Image
        src="/static/privatetourbg.png"
        alt="privatetourbg"
        fill
        className="object-cover"
      />
      <div className="md:mx-auto container px-6 py-16 flex flex-col items-center gap-0 text-left lg:gap-2 relative">
        <div className="flex flex-col items-center gap-4 flex-1 text-tertiary">
          <div className="text-2xl md:text-3xl text-white font-semibold">
            Request a Private Tour
          </div>
          <div className="text-base md:text-xl text-center">
            If you’re looking to enjoy a trip with your loves ones privately,
            fill up our form and our team will be in touch.
          </div>
        </div>

        <Link
          href="/privatetour"
          className="ripple bg-[#FDA403] border border-primary text-tertiary py-3 px-12 gip mt-6 cursor-pointer font-semibold rounded"
        >
          Request Private Tour
        </Link>
      </div>
    </div>
  );
};
