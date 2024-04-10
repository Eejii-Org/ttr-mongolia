import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ToursPropsType = {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
};

export const TourCategoriesFilter = ({
  selectedCategory,
  setSelectedCategory,
}: ToursPropsType) => {
  const supabase = createClient();
  const [tourCategories, setTourCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    const fetchTourCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("tourCategories")
          .select("*");
        if (error) {
          throw error;
        }
        setTourCategories(data);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
    };

    fetchTourCategories();
  }, []);
  return (
    <div className="flex flex-row gap-4 overflow-scroll no-scroll-bar w-full">
      <div
        className={`ripple px-4 py-2 rounded-sm whitespace-nowrap cursor-pointer ${
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
          className={`ripple px-4 py-2 rounded-sm whitespace-nowrap cursor-pointer ${
            category.name == selectedCategory
              ? "bg-primary text-tertiary"
              : "bg-quaternary"
          } hover:bg-primary hover:text-tertiary transition-all min-w-min`}
          onClick={() => setSelectedCategory(category.name)}
          key={index}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};
