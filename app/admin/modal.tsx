import { CloseIcon } from "@components";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export const Modal = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`absolute z-50 top-0 bottom-0 w-full h-full overflow-scroll backdrop-blur-sm bg-black/50 items-center justify-center ${
        open ? "flex" : "hidden"
      }`}
    >
      <button onClick={() => setOpen(false)} className="absolute top-4 right-4">
        <CloseIcon />
      </button>
      <div className="w-full h-full overflow-scroll lg:h-auto lg:w-3/4 bg-white lg:rounded-3xl">
        {children}
      </div>
    </div>
  );
};
