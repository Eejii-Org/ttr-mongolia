import Link from "next/link";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { DayIcon, NightIcon, PriceIcon } from "../icons";
import { createClient } from "@/utils/supabase/client";

export const Tour: FC<TourType> = (props) => {
  const { images, title, overview, originalPrice, days, nights, id } = props;
  const supabase = createClient();
  const [sale, setSale] = useState<TravelDate | null>(null);
  useEffect(() => {
    const getSale = async () => {
      const { data, error } = await supabase
        .from("availableTours")
        .select("*")
        .eq("tourId", id)
        .gte("date", new Date().toISOString())
        .lte("price", originalPrice)
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
    getSale();
  }, [originalPrice, id]);
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-8 cursor-default">
      <div className="relative md:w-1/4 md:max-w-80 h-48 md:h-auto rounded overflow-hidden">
        <Link href={"/tours/" + props.id}>
          <Image src={images[0]} alt={title} className="object-cover" fill />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <Link href={"/tours/" + props.id}>
          <div className="font-bold text-xl lg:text-3xl">{title}</div>
          <div className="text-sm md:text-base">
            {overview.split(" ").slice(0, 60).join(" ")}...
          </div>
        </Link>
      </div>
      <div className="relative md:w-1/4 flex flex-col justify-between gap-4">
        <div className="flex flex-row justify-center md:justify-normal md:flex-col gap-1">
          {sale && (
            <div className="font-bold text-primary text-xl">
              On Sale as low as
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
            href={"/tours/" + props.id}
            className="ripple w-full md:w-auto lg:w-1/2 py-2 md:py-3 bg-quaternary text-center font-bold rounded"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};
