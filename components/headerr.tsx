import Link from "next/link";
import { FC } from "react";

export const Header: FC = () => {
  return (
    <div className="py-3 px-3 md:px-6  flex flex-row justify-between items-center w-screen top-0 fixed z-50 bg-tertiary">
      <Link href="/">
        <div className=" font-semibold text-2xl text-secondary cursor-pointer">
          TTR Mongolia
        </div>
      </Link>
      <div className="flex flex-row gap-1">
        <div className="font-bold gip text-base text-lime-600 hover:bg-quaternary px-3 py-1 rounded cursor-pointer ripple hidden md:flex">
          Volunteering
        </div>
        <Link href="/tours">
          <div className="font-bold gip text-base text-secondary hover:bg-quaternary px-3 py-1 rounded cursor-pointer ripple hidden md:flex">
            Tours
          </div>
        </Link>
        <div className="font-bold gip text-base text-secondary hover:bg-quaternary px-3 py-1 rounded cursor-pointer ripple hidden md:flex">
          Contact Us
        </div>
      </div>
    </div>
  );
};
