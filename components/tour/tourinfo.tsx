import { useEffect, useMemo, useState } from "react";
import { DayIcon, NightIcon, PriceIcon } from "../icons";
import { createClient } from "@/utils/supabase/client";

export const TourInfo = ({
  tour,
  checkAvailableDate,
}: {
  tour: TourType;
  checkAvailableDate: () => void;
}) => {
  const supabase = createClient();

  const [sale, setSale] = useState<TravelDate | null>(null);
  useEffect(() => {
    const getSale = async () => {
      const { data, error } = await supabase
        .from("availableTours")
        .select("*")
        .eq("id", tour.id)
        .gte("date", new Date().toISOString())
        .lte("price", tour.originalPrice)
        .order("price")
        .limit(1);

      if (error) {
        console.error(error);
        return;
      }
      if (data.length == 0) {
        setSale(null);
        return;
      }
      setSale(data?.[0]);
    };
    if (tour) getSale();
  }, [tour]);

  return (
    <div className="flex sticky top-16 justify-center md:justify-normal flex-col gap-2">
      {sale && (
        <div className="font-bold text-primary md:text-xl">
          On Sale before {new Date(sale.date).toDateString()}
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
        className="md:max-w-60 mt-5 ripple flex-1 py-3 bg-primary text-center font-bold text-secondary"
        onClick={checkAvailableDate}
      >
        Check Availability
      </button>
    </div>
  );
};
