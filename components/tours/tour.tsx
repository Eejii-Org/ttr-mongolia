import Link from "next/link";
import { FC, useMemo } from "react";
import Image from "next/image";
import { DayIcon, NightIcon, PriceIcon } from "../icons";

export const Tour: FC<TourType> = (props) => {
  const {
    images,
    title,
    overview,
    prices,
    originalPrice,
    days,
    nights,
    // minimumRequired: number;
    categories,
    included,
    excluded,
    dates,
    // dates: TravelDate[]; will read later
    // itinerary,
    // reviews,
  } = props;
  // let originalPrice = 1200;
  // let mockPrices: PriceType[] = [
  //   {
  //     tourDateId: "1",
  //     date: "2024-03-10",
  //     price: 1000,
  //   },
  //   {
  //     tourDateId: "1",
  //     date: "2024-03-01",
  //     price: 800,
  //   },
  //   {
  //     tourDateId: "1",
  //     date: "2024-03-26",
  //     price: 800,
  //   },
  // ];
  const sale = useMemo(() => {
    const currentDate = new Date();
    const lowerPriceItems = dates.filter((priceItem) => {
      const priceDate = new Date(priceItem.date);
      return priceDate > currentDate && priceItem.price < originalPrice;
    });
    if (lowerPriceItems.length === 0) return null;
    const sortedLowerPriceItems = lowerPriceItems
      .map((priceItem) => ({ ...priceItem, date: new Date(priceItem.date) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return sortedLowerPriceItems[0];
  }, [prices]);
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-8 cursor-default">
      <div className="relative md:w-1/4 md:max-w-80 h-48 md:h-auto">
        <Link href={"/tours/" + props.id}>
          <Image
            src={images[0]}
            alt={title}
            className="rounded-3xl object-cover"
            fill
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <Link href={"/tours/" + props.id}>
          {sale && (
            <div className="font-bold text-primary text-xl">
              On Sale before {sale.date.toDateString()}
            </div>
          )}
          <div className="font-bold text-xl lg:text-3xl">{title}</div>
          <div className="text-base lg:text-xl">
            {overview.split(" ").slice(0, 50).join(" ")}...
          </div>
        </Link>
      </div>
      <div className="relative md:w-1/4 flex flex-col justify-between gap-4">
        <div className="flex flex-row justify-center md:justify-normal md:flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <PriceIcon />
            <div className="text-xl lg:text-3xl">
              <span
                className={`font-bold text-secondary ${
                  sale ? "line-through" : ""
                }`}
              >
                ${originalPrice}
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
              <span className="font-bold">{days}</span> days
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <NightIcon />
            <div className="text-base lg:text-xl">
              <span className="font-bold">{nights}</span> nights
            </div>
          </div>
        </div>
        <div className="flex md:flex-col lg:flex-row gap-4">
          <button className="ripple flex-1 py-2 md:py-3 bg-primary text-center font-bold text-tertiary rounded-xl">
            Book Now
          </button>
          <Link
            href={"/tours/" + props.id}
            className="ripple flex-1 py-2 md:py-3 bg-quaternary text-center font-bold rounded-xl"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};
