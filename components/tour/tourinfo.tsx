import { useEffect, useMemo, useState } from "react";
import { DayIcon, NightIcon, PriceIcon } from "../icons";
import { supabase } from "@/utils/supabase/client";

export const TourInfo = ({
  tour,
  checkAvailableDate,
}: {
  tour: TourType;
  checkAvailableDate: () => void;
}) => {
  const [sale, setSale] = useState<TravelDate | null>(null);
  const [saleCount, setSaleCount] = useState(0);
  useEffect(() => {
    const getSale = async () => {
      const { data, error } = await supabase
        .from("availableTours")
        .select("*")
        .eq("tourId", tour.id)
        .gte("date", new Date().toISOString())
        .lte("price", tour.originalPrice)
        .order("price");
      if (error) {
        console.error(error);
        return;
      }
      if (data.length == 0) {
        setSale(null);
        return;
      }
      setSaleCount(data?.length);
      setSale(data?.[0]);
    };
    if (tour) getSale();
  }, [tour]);

  return (
    <div className="flex sticky top-16 justify-center md:justify-normal flex-col gap-2">
      {sale && (
        <div className="font-bold text-primary text-xl">
          {saleCount} Departure{saleCount == 1 ? "" : "s"} On Sale
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
        {/* <div className="flex flex-row gap-2 items-center">
          <NightIcon />
          <div className="text-base lg:text-xl">
            <span className="font-bold">{tour.nights}</span> nights
          </div>
        </div> */}
      </div>

      <button
        className="md:max-w-60 mt-5 ripple flex-1 py-3 bg-primary text-center font-bold text-secondary"
        onClick={checkAvailableDate}
      >
        Check Availability
      </button>
    </div>
  );
};
