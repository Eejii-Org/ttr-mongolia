"use client";
import {
  CombinedAvailableToursDataType,
  CombinedToursDataType,
} from "@/app/tours/page";
import { AvailableDates, Tour, TourCategoriesFilter } from "@components";
import { useState, useMemo, Suspense } from "react";

const SearchBarFallback = () => {
  return <>SearchBar</>;
};
export const ToursFilter = ({
  combinedToursData,
  combinedAvailableToursData,
  tourCategories,
}: {
  combinedToursData: CombinedToursDataType[];
  combinedAvailableToursData: CombinedAvailableToursDataType[];
  tourCategories: CategoryType[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All"
  );
  const selectedTours = useMemo<CombinedToursDataType[]>(() => {
    if (selectedCategory == "All") return combinedToursData;
    return combinedToursData.filter((tour) =>
      tour.categories.includes(Number(selectedCategory))
    );
  }, [selectedCategory, combinedToursData]);
  return (
    <>
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center">
          <div className="text-2xl md:text-4xl font-semibold">
            Our Tour Packages
          </div>
          <AvailableDates
            combinedAvailableToursData={combinedAvailableToursData}
          />
        </div>
        <Suspense fallback={<SearchBarFallback />}>
          <TourCategoriesFilter
            tourCategories={tourCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Suspense>
      </div>
      <div className="flex flex-col gap-12">
        {selectedTours?.length == 0 ? (
          <div>There is currently no tours with this category</div>
        ) : (
          <>
            {selectedTours.map((tour, index) => (
              <Tour tour={tour} key={index} />
            ))}
          </>
        )}
      </div>
    </>
  );
};
