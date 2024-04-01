import { FC, useMemo } from "react";
import { ArrowRight, SaleIcon } from "../icons";

export const Availability = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Availability</div>
      <div className="flex flex-col gap-4">
        {tour.dates.map((tourDate, index) => (
          <AvailabilityItem
            {...tourDate}
            originalPrice={tour.originalPrice}
            days={tour.days}
            nights={tour.nights}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};
interface AvailabilityItemPropsType extends TravelDate {
  originalPrice: number;
  days: number;
  nights: number;
}

const AvailabilityItem: FC<AvailabilityItemPropsType> = ({
  date,
  price,
  originalPrice,
  days,
  nights,
}) => {
  const isOnSale = useMemo(() => {
    return price < originalPrice;
  }, [originalPrice, price]);
  return (
    <div className="shadow-md p-4 flex flex-col md:flex-row flex-wrap lg:flex-row rounded border border-quinary gap-4 md:gap-8">
      <div className="flex flex-row gap-8 items-center">
        <div>
          <div className="font-medium text-base text-[#c1c1c1]">Monday</div>
          <div className="font-bold text-xl">July 1 2024</div>
        </div>
        <ArrowRight />
        <div>
          <div className="font-medium text-base text-[#c1c1c1]">Monday</div>
          <div className="font-bold text-xl">July 1 2024</div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center flex-col">
        <div className="flex flex-row md:flex-col gap-4 md:gap-0 items-center md:items-start">
          <div className="flex flex-row items-center gap-1">
            <SaleIcon />
            <div className="font-bold text-primary text-lg md:text-xl">
              On Sale
            </div>
          </div>
          <div className="text-lg lg:text-xl">
            <span
              className={`font-bold text-secondary ${
                isOnSale ? "line-through" : ""
              }`}
            >
              ${originalPrice}
            </span>
            {isOnSale && (
              <>
                <span>/</span>
                <span className="font-bold text-primary"> ${price}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button className="ripple py-3 px-8 bg-primary text-center font-bold text-secondary rounded-xl flex-1 md:flex-auto">
          Book Now
        </button>
      </div>
    </div>
  );
};
