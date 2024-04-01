import { FC, useState } from "react";
import { ChevronDownIcon } from "./icons";

type TourPlanType = {
  itinerary: ItineraryType[];
};
export const TourPlan: FC<TourPlanType> = ({ itinerary }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Tour Plan</div>
      <div className="font-medium text-xl">
        {itinerary.map((itinerary, index) => (
          <ListItem {...itinerary} index={index} key={index} />
        ))}
      </div>
    </div>
  );
};

interface DayType extends ItineraryType {
  index: number;
}

const ListItem = ({ title, description, index }: DayType) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border ${index == 0 ? "" : "border-t-0"}`}>
      {/* <td> */}
      <div
        className={`text-lg md:text-xl hover:bg-black/10 p-3 flex flex-row justify-between items-center ${
          open ? "border-b" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        <div>
          <span className="font-bold text-primary pr-2">DAY {index + 1}</span>
          <span className="font-medium">{title}</span>
        </div>
        <div className={`transition-all ${open ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </div>
      </div>
      <div
        className={`${
          open ? "flex" : "hidden"
        } text-base md:text-lg p-3 font-normal`}
      >
        {description}
      </div>
      {/* </td> */}
    </div>
  );
};
