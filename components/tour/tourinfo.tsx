"use client";
import _ from "lodash";
export const TourInfo = ({
  tour,
  saleTours,
  minimumPrice,
}: {
  tour: TourType;
  saleTours: AvailableTourType[];
  minimumPrice: number;
}) => {
  const checkAvailableDate = () =>
    document
      .getElementById("availableTours")
      ?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="flex justify-center md:justify-normal flex-col gap-2">
      <div className="font-bold text-secondary text-xl">Price</div>
      {saleTours.length !== 0 && (
        <div className="flex flex-row justify-between">
          <div className="font-semibold text-primary text-xl">
            {saleTours.length} Departure{saleTours.length == 1 ? "" : "s"} On
            Sale
          </div>
          <div className="font-semibold text-primary text-xl">
            ${minimumPrice}
          </div>
        </div>
      )}
      <div className="flex flex-row md:flex-col gap-2">
        <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
          {tour.originalPrice.map((price, index) => (
            <div
              className="bg-[#F2F2F2] px-3 py-2 rounded border border-black/5"
              key={index}
            >
              <div className="font-medium">
                {price.passengerCount}
                {index == tour.originalPrice.length - 1 ? "+" : ""} Pax
              </div>
              <div>
                <span className="font-bold text-lg">
                  ${price.pricePerPerson}
                </span>{" "}
                <span>per person</span>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="flex flex-row gap-2 items-center">
          <PriceIcon />
          <div className="text-xl lg:text-3xl">
            <span
              className={`font-bold text-secondary ${
                saleTours.length !== 0 ? "line-through" : ""
              }`}
            >
              ${tour.originalPrice.at(-1)?.pricePerPerson}
            </span>
            {saleTours.length !== 0 && (
              <>
                <span>/</span>
                <span className="font-bold text-primary">
                  {" "}
                  ${saleTours[0].salePrice}
                </span>
              </>
            )}
          </div>
        </div> */}
        {/* <div className="flex flex-row gap-2 items-center">
          <DayIcon />
          <div className="text-base lg:text-xl">
            <span className="font-bold">{tour.days}</span> days
          </div>
        </div> */}
      </div>

      <button
        className="mt-2 ripple flex-1 py-3 bg-primary text-center font-bold text-secondary rounded"
        onClick={checkAvailableDate}
      >
        Check Availability
      </button>
    </div>
  );
};
