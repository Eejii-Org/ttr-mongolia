"use client";
import { FC } from "react";
import { ArrowCircleIcon } from "../icons";
import Link from "next/link";
import StorageImage from "../storageimage";
import { CategoryType } from "@/utils";

export const TourCategories = ({
  categories,
}: {
  categories: CategoryType[];
}) => {
  return (
    <div className="flex flex-col gap-6 mx-3 md:mx-0">
      <div className="flex flex-row justify-between items-end">
        <div className="text-2xl md:text-4xl font-semibold">
          Choose your tour
        </div>
        <Link href="/tours">
          <div className="text-base text-gray-400 font-medium md:text-lg">
            View More
          </div>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {categories.map((category, index) => (
          <TourCategory {...category} key={index} />
        ))}
      </div>
    </div>
  );
};
const TourCategory: FC<CategoryType> = (props) => {
  const { name, image, id } = props;
  return (
    <Link
      href={{
        pathname: "/tours",
        query: {
          category: id,
        },
      }}
      className="flex-auto md:flex-1"
    >
      <div className="flex h-56 md:h-[300px] bg-yellow-300 p-3 items-end relative rounded-[32px] overflow-hidden">
        <StorageImage
          src={image || ""}
          fill
          alt={`category-${id}`}
          priority
          // unoptimized={true}
          className={`object-cover select-none`}
        />
        <div className="flex p-3 justify-between items-center w-full bg-black/20 backdrop-blur-[2px] z-0 ripple rounded-2xl">
          <div className="text-lg md:text-xl pl-3 font-medium text-white">
            {name}
          </div>
          <ArrowCircleIcon filled="true" color="black" />
        </div>
      </div>
    </Link>
  );
};
