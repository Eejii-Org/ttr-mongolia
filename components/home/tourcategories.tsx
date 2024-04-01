import { FC, useEffect, useState } from "react";
import { ArrowCircleIcon } from "../icons";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export const TourCategories: FC = () => {
  const supabase = createClient();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchTourCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("tourCategories")
          .select("*")
          .order("count")
          .limit(3);
        if (error) {
          throw error;
        }
        setCategories(data);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
    };

    fetchTourCategories();
  }, []);
  return (
    <div className="flex flex-col gap-6 mx-3 md:mx-6">
      <div className="flex flex-row justify-between items-center">
        <div className="text-3xl md:text-5xl font-semibold">
          Choose your tour
        </div>
        <Link href="/tours">
          <div className="text-base text-gray-400 font-medium md:text-xl">
            View More
          </div>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {categories.map((category, index) => (
          <TourCategory {...category} key={index} />
        ))}
      </div>
    </div>
  );
};
const TourCategory: FC<CategoryType> = (props) => {
  const { name, image } = props;
  return (
    <Link
      href={{
        pathname: "/tours",
        query: {
          category: name,
        },
      }}
      className="flex-auto md:flex-1"
    >
      <div className="flex h-56 lg:h-80 bg-yellow-300 p-3 items-end rounded-3xl relative ">
        <Image
          src={image}
          fill
          alt={name}
          priority
          // unoptimized={true}
          className={`object-cover select-none rounded-3xl`}
        />
        <div className="flex p-3 items-center justify-between w-full bg-black rounded-2xl backdrop-blur-lg bg-black/30">
          <div className="text-xl md:text-2xl font-bold text-tertiary">
            {name}
          </div>
          <div>
            <ArrowCircleIcon color="black" filled="true" />
          </div>
        </div>
      </div>
    </Link>
  );
};
