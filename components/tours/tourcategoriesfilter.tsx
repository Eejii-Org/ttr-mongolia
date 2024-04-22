import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

type ToursPropsType = {
  selectedCategory: number | "All";
  setSelectedCategory: Dispatch<SetStateAction<number | "All">>;
};

export const TourCategoriesFilter = ({
  selectedCategory,
  setSelectedCategory,
}: ToursPropsType) => {
  const searchParams = useSearchParams();
  const searchCategory = searchParams.get("category");
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [tourCategories, setTourCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    const fetchTourCategories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tourCategories")
          .select("*");
        if (error) {
          throw error;
        }
        setTourCategories(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
        setLoading(false);
      }
    };

    fetchTourCategories();
  }, []);
  useEffect(() => {
    if (searchCategory) {
      setSelectedCategory(Number(searchCategory));
    }
  }, [searchCategory]);
  if (loading) {
    return <></>;
  }
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
