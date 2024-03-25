import { FC } from "react";
import { ArrowCircleIcon } from "./icons";
import Image from "next/image";

export const TourCategories: FC = () => {
  return (
    <div className="flex flex-col gap-6 mx-6">
      <div className="text-5xl font-semibold">Choose your tour</div>
      <div className="flex flex-row gap-4">
        <TourCategory />
        <TourCategory />
        <TourCategory />
      </div>
    </div>
  );
};
const TourCategory: FC = () => {
  return (
    <div className="flex flex-1 h-80 bg-yellow-300 p-3 items-end rounded-3xl">
      {/* <Image
        src={
          
        }
        fill
      /> */}
      <div className="flex p-3 items-center justify-between w-full bg-black rounded-2xl backdrop-blur-lg bg-black/30">
        <div className="text-2xl font-bold text-tertiary">Gobi Tours</div>
        <div>
          <ArrowCircleIcon color="black" filled />
        </div>
      </div>
    </div>
  );
};
