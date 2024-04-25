import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import { DayIcon, PriceIcon } from "../icons";
import { CombinedToursDataType } from "@/app/tours/page";

export const Tour = (props: { tour: CombinedToursDataType }) => {
  const { tour } = props;
  const { images, title, overview, originalPrice, days, id } = tour;
  const sale = useMemo<AvailableTourType[]>(() => {
    return tour.availableTours
      .filter((availableTour) => availableTour.salePrice !== null)
      .sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
  }, [tour]);
  console.log(sale);
  return (
    <div className="flex flex-col md:h-48 md:flex-row gap-2 md:gap-8 cursor-default">
      <div className="relative md:w-1/4 md:max-w-80 h-48 md:h-auto rounded overflow-hidden">
        <Link href={"/tours/" + tour.id}>
          <Image src={images[0]} alt={title} className="object-cover" fill />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <Link href={"/tours/" + tour.id}>
          <div className="font-bold text-xl lg:text-3xl">{title}</div>
          <div className="text-sm md:text-base tour-item-description">
            {overview}
          </div>
        </Link>
      </div>
      <div className="relative md:w-1/4 flex flex-col gap-4">
        <div className="flex flex-row justify-center md:justify-normal md:flex-col gap-1">
          {sale.length !== 0 && (
            <div className="font-bold text-primary text-xl">
              {sale.length} Departure{sale.length == 1 ? "" : "s"} On Sale
            </div>
          )}
          <div className="flex flex-row gap-2 items-center">
            <PriceIcon />
            <div className="text-xl lg:text-3xl">
              <span
                className={`font-bold text-secondary ${
                  sale ? "line-through" : ""
                }`}
              >
                ${originalPrice.at(-1)?.pricePerPerson}
              </span>
              {sale.length !== 0 && (
                <>
                  <span>/</span>
                  <span className="font-bold text-primary">
                    {" "}
                    ${sale[0].salePrice}
                  </span>
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
          {/* <div className="flex flex-row gap-2 items-center">
            <NightIcon />
            <div className="text-base lg:text-xl">
              <span className="font-bold">{nights}</span> nights
            </div>
          </div> */}
        </div>
        <div className="flex md:flex-col lg:flex-row gap-4">
          {/* <button className="ripple flex-1 py-2 md:py-3 bg-primary text-center font-bold text-tertiary rounded-xl">
            Book Now
          </button> */}
          <Link
            href={"/tours/" + id}
            className="ripple w-full md:w-auto lg:w-1/2 py-2 md:py-3 bg-quaternary text-center font-bold rounded"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};
