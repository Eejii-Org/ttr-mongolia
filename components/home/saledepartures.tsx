import { TourCard, TourCardDataType, TourCardType } from "../tourcard";
import Link from "next/link";

export const SaleDepartures = ({ data }: { data: TourCardDataType[] }) => {
  return (
    <div className="flex flex-col gap-6 mx-3 md:mx-0">
      <div className="flex flex-row justify-between items-end">
        <div className="text-2xl md:text-4xl font-semibold">
          Departures On Sale
        </div>
        <Link
          href={{
            pathname: "/tours",
            query: {
              availableDatesOpen: "true",
            },
          }}
        >
          <div className="text-base text-gray-400 font-medium md:text-lg">
            View More
          </div>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {data.map((data, index) => (
          <TourCard tourData={data} type="departure" key={index} />
        ))}
        {3 - data.length > 0 &&
          new Array(3 - data.length)
            .fill(null)
            .map((_, i) => <div className="flex-1" key={i} />)}
      </div>
    </div>
  );
};
