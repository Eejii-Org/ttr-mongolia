"use client";
import { FC, useState } from "react";
import { ChevronDownIcon } from "../icons";
import { TiptapContent } from "../tiptapcontent";

type TourPlanType = {
  itinerary: ItineraryType[];
};
export const TourPlan: FC<TourPlanType> = ({ itinerary }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Tour Plan</div>
      <div className="font-medium text-xl">
        {itinerary?.map((item, index) => (
          <ListItem
            {...item}
            index={index}
            length={itinerary.length}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

interface DayType extends ItineraryType {
  index: number;
  length: number;
}

const ListItem = ({ title, description, index, length }: DayType) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border overflow-hidden ${
        index == 0 ? "rounded-t-lg" : "border-t-0"
      } ${index == length - 1 ? "rounded-b-lg" : ""}`}
    >
      {/* <td> */}
      <div
        className={`text-lg md:text-xl hover:bg-black/10 p-4 cursor-pointer flex flex-row justify-between items-center ${
          open ? "border-b" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-row items-center">
          <span className="font-bold text-primary pr-2">Day {index + 1} :</span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className={`transition-all ${open ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </div>
      </div>

      <div
        className={`${
          open ? "flex" : "hidden"
        } text-base md:text-lg p-3 text-black/65 font-normal`}
      >
        <TiptapContent content={description} />
      </div>
      {/* </td> */}
    </div>
  );
};
