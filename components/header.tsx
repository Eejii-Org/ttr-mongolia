import Link from "next/link";
import { FC } from "react";

type HeaderPropsType = {
  transparent?: boolean;
};

export const Header: FC<HeaderPropsType> = ({ transparent = false }) => {
  return (
    <div
      className={`py-3 px-3 md:px-6  flex flex-row justify-between items-center w-screen top-0 fixed z-40 transition-all
      ${transparent ? "text-tertiary" : "bg-tertiary  text-secondary "}`}
    >
      <Link href="/">
        <div className="font-semibold text-2xl cursor-pointer">
          TTR Mongolia
        </div>
      </Link>
      <div className="flex flex-row gap-1">
        <div className="font-bold gip text-base text-lime-600 hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple hidden md:flex">
          Volunteering
        </div>
        <Link href="/tours">
          <div className="font-bold gip text-base hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple hidden md:flex">
            Tours
          </div>
        </Link>
        <Link href="/contact">
          <div className="font-bold gip text-base hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple hidden md:flex">
            Contact Us
          </div>
        </Link>
      </div>
    </div>
  );
};
