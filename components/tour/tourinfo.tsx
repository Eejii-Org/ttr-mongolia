import { useMemo } from "react";
import { DayIcon, NightIcon, PriceIcon } from "../icons";

export const TourInfo = ({
  tour,
  checkAvailableDate,
}: {
  tour: TourType;
  checkAvailableDate: () => void;
}) => {
  const sale = useMemo(() => {
    if (!tour) return null;
    const currentDate = new Date();
    const lowerPriceItems = tour.dates.filter((priceItem) => {
      const priceDate = new Date(priceItem.date);
      return priceDate > currentDate && priceItem.price < tour.originalPrice;
    });
    if (lowerPriceItems.length === 0) return null;
    const sortedLowerPriceItems = lowerPriceItems
      .map((priceItem) => ({ ...priceItem, date: new Date(priceItem.date) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return sortedLowerPriceItems[0];
  }, [tour]);

  return (
    <div className="flex sticky top-16 justify-center md:justify-normal flex-col gap-2">
      {sale && (
        <div className="font-bold text-primary md:text-xl">
          On Sale before {sale.date.toDateString()}
        </div>
      )}
      <div className="flex flex-row md:flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <PriceIcon />
          <div className="text-xl lg:text-3xl">
            <span
              className={`font-bold text-secondary ${
                sale ? "line-through" : ""
              }`}
            >
              ${tour.originalPrice}
            </span>
            {sale && (
              <>
                <span>/</span>
                <span className="font-bold text-primary"> ${sale.price}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <DayIcon />
          <div className="text-base lg:text-xl">
            <span className="font-bold">{tour.days}</span> days
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <NightIcon />
          <div className="text-base lg:text-xl">
            <span className="font-bold">{tour.nights}</span> nights
          </div>
        </div>
      </div>

      <button
        className="md:max-w-60 mt-5 ripple flex-1 py-3 bg-primary text-center font-bold text-secondary rounded-xl"
        onClick={checkAvailableDate}
      >
        Check Availability
      </button>
    </div>
  );
};
