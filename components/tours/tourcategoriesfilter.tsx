"use client";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryType } from "@/utils";

type ToursPropsType = {
  selectedCategory: number | "All";
  setSelectedCategory: Dispatch<SetStateAction<number | "All">>;
  tourCategories: CategoryType[];
};

export const TourCategoriesFilter = ({
  selectedCategory,
  setSelectedCategory,
  tourCategories,
}: ToursPropsType) => {
  const searchParams = useSearchParams();
  const searchCategory = searchParams.get("category");
  useEffect(() => {
    if (searchCategory) {
      setSelectedCategory(Number(searchCategory));
    }
  }, [searchCategory]);
  return (
    <div className="flex flex-row gap-4 overflow-scroll no-scroll-bar w-full">
      <div
        className={`ripple px-4 py-2 rounded whitespace-nowrap cursor-pointer ${
          "All" == selectedCategory
            ? "bg-primary text-tertiary"
            : "bg-quaternary"
        } hover:bg-primary hover:text-tertiary transition-all min-w-min`}
        onClick={() => setSelectedCategory("All")}
      >
        All
      </div>
      {tourCategories?.map((category, index) => (
        <div
          className={`ripple px-4 py-2 rounded whitespace-nowrap cursor-pointer ${
            JSON.stringify(category.id) == selectedCategory
              ? "bg-primary text-tertiary"
              : "bg-quaternary"
          } hover:bg-primary hover:text-tertiary transition-all min-w-min`}
          onClick={() => setSelectedCategory(category.id || -1)}
          key={index}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};
