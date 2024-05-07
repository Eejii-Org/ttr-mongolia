import { FC, useMemo } from "react";
import { ArrowRight } from "../icons";
import Link from "next/link";

export const Availability = ({
  tour,
  availableTours,
}: {
  tour: TourType;
  availableTours: AvailableTourType[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Available Tours</div>
      <div className="flex flex-col gap-4">
        {availableTours.length == 0 && (
          <div>
            There are currently no scheduled departures but you can request a
            new departure date.
          </div>
        )}
        {availableTours.map((tourDate, index) => (
          <AvailabilityItem
            {...tourDate}
            displayPrice={tour.displayPrice}
            originalPrice={tour.originalPrice}
            days={tour.days}
            nights={tour.nights}
            key={index}
          />
        ))}
        <div className="flex flex-row justify-between gap-4 items-center pt-2">
          <div className="text-xl font-semibold">
            Or you can request for a new tour
          </div>
          <Link
            href={{
              pathname: "/newdeparture",
              query: {
                tourid: tour.id,
              },
            }}
            className="ripple py-3 px-8 bg-primary text-center font-bold text-secondary rounded"
          >
            Request a New Departure
          </Link>
        </div>
      </div>
    </div>
  );
};
interface AvailabilityItemPropsType extends AvailableTourType {
  originalPrice: PriceType[];
  displayPrice: number;
  days: number;
  nights: number;
}

const AvailabilityItem: FC<AvailabilityItemPropsType> = ({
  date,
  originalPrice,
  salePrice,
  displayPrice,
  days,
  nights,
  id,
}) => {
  const dates = useMemo(() => {
    const startingDate = new Date(date);
    let endingDate = new Date(date);
    endingDate.setDate(startingDate.getDate() + days);
    return {
      startingDate: {
        day: startingDate.toLocaleString("default", { weekday: "short" }),
        date:
          startingDate.toLocaleString("default", { month: "long" }) +
          " " +
          startingDate.getDate() +
          " " +
          startingDate.getFullYear(),
      },
      endingDate: {
        day: endingDate.toLocaleString("default", { weekday: "short" }),
        date:
          endingDate.toLocaleString("default", { month: "long" }) +
          " " +
          endingDate.getDate() +
          " " +
          endingDate.getFullYear(),
      },
    };
  }, [date, days]);
  return (
    <div className="shadow-md p-4 flex flex-col md:flex-row flex-wrap lg:flex-row rounded border border-quinary gap-4 md:gap-8">
      <div className="flex flex-row gap-8 items-center">
        <div>
          <div className="font-medium text-base text-[#c1c1c1]">
            {dates.startingDate.day}
          </div>
          <div className="font-bold md:text-xl">{dates.startingDate.date}</div>
        </div>
        <ArrowRight />
        <div>
          <div className="font-medium text-base text-[#c1c1c1]">
            {dates.endingDate.day}
          </div>
          <div className="font-bold md:text-xl">{dates.endingDate.date}</div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center flex-col">
        <div className="flex flex-row md:flex-col gap-4 md:gap-0 items-center md:items-start">
          {salePrice !== null && (
            <div className="flex flex-row items-center gap-1">
              {/* <SaleIcon /> */}
              <div className="font-bold text-primary text-base md:text-base">
                On Sale
              </div>
            </div>
          )}

          <div className="text-lg lg:text-xl">
            <span
              className={`font-bold text-secondary ${
                salePrice !== null ? "line-through" : ""
              }`}
            >
              ${displayPrice}
            </span>
            {salePrice !== null && (
              <>
                <span>/</span>
                <span className="font-bold text-primary"> ${salePrice}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Link
          className="ripple py-3 px-8 bg-primary text-center font-bold text-secondary rounded flex-1 md:flex-auto"
          href={{
            pathname: "/book",
            query: {
              availableTourId: id,
            },
          }}
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};
