import { RentalCarType } from "@/utils/types";
import StorageImage from "../storageimage";
import { PriceIcon } from "../icons";
import Link from "next/link";

export type RentalCarCardType = {
  rentalCar: {
    id: string;
    mainImage: string;
    name: string;
    subDescription: string;
    carDetail: {
      pricePerDay: string;
    };
  };
};

export const RentalCarCard = ({ rentalCar }: RentalCarCardType) => {
  return (
    <div
      className=" rounded-xl flex-1 flex flex-col"
      style={{
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="relative h-64 md:h-[300px]">
        <StorageImage
          src={rentalCar.mainImage}
          alt={rentalCar.name}
          quality={5}
          fill
          className="object-cover rounded-t-xl"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 gap-4 md:p-6 md:gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <h5 className="text-xl md:text-2xl font-bold">{rentalCar.name}</h5>
          <p className="tour-item-description-3 text-[#6D6D6D]">
            {rentalCar.subDescription}
          </p>
        </div>
        <div className="flex flex-row flex-wrap gap-4 justify-between">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row items-center gap-1 font-bold text-lg md:text-2xl">
              <PriceIcon />
              <span>${rentalCar.carDetail.pricePerDay}</span>
              <span className="font-semibold text-base h-full flex items-end">
                Per Day
              </span>
            </div>
          </div>
          {/* <div className="flex-1 flex items-end justify-end">
            <Arrow />
          </div> */}
        </div>
        <div className="flex flex-row gap-4">
          <Link
            href={"/rentalcars/" + rentalCar.id}
            className="ripple w-full md:w-auto lg:w-1/2 py-2 md:py-3 bg-quaternary text-center font-bold rounded"
          >
            Learn More
          </Link>
          <Link
            href={{
              pathname: "/requestcar",
              query: {
                rentalcarid: rentalCar.id,
              },
            }}
            className="ripple w-full text-white md:w-auto lg:w-1/2 py-2 md:py-3 bg-primary text-center font-bold rounded"
          >
            Request
          </Link>
        </div>
      </div>
    </div>
  );
};
