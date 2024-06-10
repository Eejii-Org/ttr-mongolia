import Link from "next/link";
import StorageImage from "./storageimage";
import { DayIcon, PriceIcon, StarIcon } from "./icons";
import { ModifiedAvailableTourType } from "./infinitescrolltours";
import { convert } from "html-to-text";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type TourCardDataType = {
  salePrice: number;
  images: string[];
  title: string;
  id: number;
  days: number;
  date: string;
  overview: string;
  displayPrice: number;
};

export type TourCardType = {
  tourData: TourCardDataType;
  type?: "tour" | "departure";
};

export const TourCard = (props: TourCardType) => {
  const { tourData, type = "tour" } = props;
  return (
    <Link href={`/tours/${tourData.id}`} className="flex-1 flex">
      <div
        className=" rounded-xl flex-1 flex flex-col"
        style={{
          boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="relative h-64 md:h-[300px]">
          {type == "departure" && tourData.salePrice && (
            <div className="absolute top-4 left-4 bg-primary rounded z-10 p-2 pr-4 text-white font-semibold flex flex-row gap-1 items-center">
              <StarIcon />
              On Sale
            </div>
          )}

          <StorageImage
            src={tourData.images?.[0]}
            alt={tourData.title}
            quality={5}
            fill
            className="object-cover rounded-t-xl"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 gap-4 md:p-6 md:gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <h5 className="text-xl md:text-2xl font-bold">{tourData.title}</h5>
            <p className="tour-item-description-3 text-[#6D6D6D]">
              {convert(tourData.overview)}
            </p>
            <div className="flex flex-row flex-wrap gap-4 text-black/80 font-bold text-sm md:text-md">
              {type == "departure" && (
                <>
                  <div className="flex flex-row items-center justify-center gap-1">
                    <CalendarDateIcon />
                    {months[Number(tourData.date?.split("-")[1]) - 1]}{" "}
                    {tourData.date?.split("-")[2]}
                  </div>
                  <div className="bg-black/20 w-[2px] rounded my-1" />
                </>
              )}
              <div className="flex flex-row justify-center items-center gap-1">
                <TimerIcon />
                {tourData.days}
                <span className="font-medium">
                  {tourData.days == 1 ? " day" : " days"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-4 justify-between">
            <div className="flex flex-row gap-4">
              <div className="flex flex-row items-center gap-1 font-bold text-lg md:text-2xl">
                <PriceIcon />
                <span
                  className={`${type == "departure" ? "line-through" : ""}`}
                >
                  ${tourData.displayPrice}
                </span>
                {type == "departure" && (
                  <>
                    /<span className="text-primary">${tourData.salePrice}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 flex items-end justify-end">
              <Arrow />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Arrow = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="24" fill="#FFF5E5" />
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="23.5"
        stroke="black"
        strokeOpacity="0.05"
      />
      <path
        d="M17.332 24.0001H30.6654M30.6654 24.0001L25.332 18.6667M30.6654 24.0001L25.332 29.3334"
        stroke="black"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CalendarDateIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Calendar / Calendar_Days">
      <path
        id="Vector"
        d="M8 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V8M8 4H16M8 4V2M16 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V8M16 4V2M4 8V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V8M4 8H20M16 16H16.002L16.002 16.002L16 16.002V16ZM12 16H12.002L12.002 16.002L12 16.002V16ZM8 16H8.002L8.00195 16.002L8 16.002V16ZM16.002 12V12.002L16 12.002V12H16.002ZM12 12H12.002L12.002 12.002L12 12.002V12ZM8 12H8.002L8.00195 12.002L8 12.002V12Z"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const TimerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Calendar / Timer">
      <path
        id="Vector"
        d="M12 13V9M21 6L19 4M10 2H14M12 21C7.58172 21 4 17.4183 4 13C4 8.58172 7.58172 5 12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21Z"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
