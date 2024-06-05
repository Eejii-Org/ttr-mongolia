"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChevronDownIcon } from "./icons";

type DrawerType = {
  children: React.ReactNode;
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const Drawer = ({ children, title, open, setOpen }: DrawerType) => {
  // const [isOpen, setIsOpen] = useState(false);
  // useEffect(() => {
  //   setIsOpen(open);
  // }, [open]);
  return (
    <div className="drop-shadow-card bg-white rounded-2xl overflow-hidden">
      <div className="p-4 md:p-6 flex flex-row justify-between items-center">
        <h2 className="font-bold text-xl text-secondary">{title}</h2>
        <div className={`transition-all ${open ? "rotate-180" : "rotate-0"}`}>
          <button
            className="ripple rounded-full p-2"
            onClick={() => setOpen(!open)}
          >
            <ChevronDownIcon />
          </button>
        </div>
      </div>
      <hr></hr>
      <div
        className={`flex flex-col gap-4 md:gap-6 transition-all origin-top duration-500 ease-in-out ${
          open
            ? "max-h-[1000px] p-4 md:p-6 opacity-100"
            : "max-h-0 p-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
