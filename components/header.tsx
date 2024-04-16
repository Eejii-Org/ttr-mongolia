import Link from "next/link";
import { FC, useState } from "react";
import { CloseIcon, Hamburger } from "./icons";

type HeaderPropsType = {
  transparent?: boolean;
};

export const Header: FC<HeaderPropsType> = ({ transparent = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="relative">
        <button
          className="p-2 ripple flex rounded-full md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Hamburger color={transparent ? "white" : "black"} />
        </button>
        <div
          className={`${
            sidebarOpen ? "p-4 pt-8 pr-8 opacity-100" : "w-0 h-0 p-0 opacity-0"
          } transition-all overflow-hidden top-0 right-0 absolute bg-white shadow-md rounded flex flex-col`}
        >
          <div className="absolute right-0 top-0">
            <button
              className="p-2 ripple flex rounded-full md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <CloseIcon width={24} height={24} />
            </button>
          </div>
          <Link href="/volunteering">
            <div className="font-bold gip text-base text-lime-600 hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
              Volunteering
            </div>
          </Link>
          <Link href="/tours">
            <div className="font-bold gip text-black hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
              Tours
            </div>
          </Link>
          <Link href="/contact">
            <div className="font-bold gip text-black hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
              Contact Us
            </div>
          </Link>
          <Link href="/about">
            <div className="font-bold gip text-black hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
              About Us
            </div>
          </Link>
        </div>
      </div>
      <div className="flex-row gap-1 hidden md:flex">
        <Link href="/volunteering">
          <div className="font-bold gip text-base text-lime-600 hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
            Volunteering
          </div>
        </Link>
        <Link href="/tours">
          <div className="font-bold gip text-base hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
            Tours
          </div>
        </Link>
        <Link href="/contact">
          <div className="font-bold gip text-base hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
            Contact Us
          </div>
        </Link>
        <Link href="/about">
          <div className="font-bold gip text-base hover:bg-gray-600/20 px-3 py-1 rounded cursor-pointer ripple flex">
            About Us
          </div>
        </Link>
      </div>
    </div>
  );
};
