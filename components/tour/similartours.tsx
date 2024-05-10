"use client";
import supabase from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, DayIcon, PriceIcon } from "../icons";
import Link from "next/link";
export const SimilarTours = ({
  categories,
  tourId,
}: {
  categories: number[];
  tourId: string;
}) => {
  const [similarTours, setSimilarTours] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getSimilarTours = async () => {
      try {
        const { data: dataWithSameCategory } = await supabase
          .from("random_tours")
          .select(`*`)
          .neq("id", tourId)
          .eq("status", "active")
          .overlaps("categories", categories)
          .limit(2);
        if (dataWithSameCategory?.length == 2) {
          setSimilarTours(dataWithSameCategory);
          return;
        }
        const { data, error: err } = await supabase
          .from("random_tours")
          .select(`*`)
          .neq("id", tourId)
          .neq(
            "id",
            dataWithSameCategory?.length == 1
              ? dataWithSameCategory[0].id
              : "-1"
          )
          .limit(2 - (dataWithSameCategory?.length || 0));
        setSimilarTours(
          dataWithSameCategory
            ? data
              ? [...dataWithSameCategory, ...data]
              : [...dataWithSameCategory]
            : []
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getSimilarTours();
  }, [categories, tourId]);
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Similar Tours</div>
      <div className="flex flex-col lg:flex-row gap-6">
        {similarTours.map((similarTour, index) => (
          <TourCard {...similarTour} key={index} />
        ))}
      </div>
    </div>
  );
};

const TourCard = (props: TourType) => {
  return (
    <div className="flex-1 shadow rounded-xl">
      <div className="relative h-64">
        <Image
          src={props.images[0]}
          alt={props.title}
          quality={5}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl md:text-2xl font-bold">{props.title}</h5>
          <p className="tour-item-description-3 text-[#6D6D6D]">
            {props.overview}
          </p>
        </div>
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row items-center gap-1 font-semibold text-2xl">
              <PriceIcon />${props.displayPrice}
            </div>
            <div className="bg-black/20 w-[2px] rounded my-1" />
            <div className="flex flex-row items-center gap-1 font-semibold text-2xl">
              <DayIcon />
              {props.days}
              <span className="font-medium text-xl">
                {props.days == 1 ? " day" : " days"}
              </span>
            </div>
          </div>
          <Link
            href={`/tours/${props.id}`}
            className="flex flex-row items-center gap-2"
          >
            <div className="font-semibold md:text-xl">Learn More</div>
            <ArrowRight color="black" />
          </Link>
        </div>
      </div>
    </div>
  );
};
