import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { CategoryType } from "@/utils";

type ToursPropsType = {
  selectedCategories: number[];
  setSelectedCategories: (newCategories: number[]) => void;
};

export const SelectTourCategories = ({
  selectedCategories,
  setSelectedCategories,
}: ToursPropsType) => {
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
    <div className="flex flex-row gap-4 overflow-scroll w-full">
      {tourCategories?.map((category, index) => (
        <div
          className={`ripple px-4 py-2 rounded whitespace-nowrap cursor-pointer ${
            selectedCategories.includes(category.id || -1)
              ? "bg-primary text-tertiary"
              : "bg-quaternary"
          } hover:bg-primary hover:text-tertiary transition-all min-w-min`}
          onClick={() =>
            selectedCategories.includes(category.id || -1)
              ? setSelectedCategories(
                  selectedCategories.filter((cat) => cat != category.id)
                )
              : setSelectedCategories([
                  ...selectedCategories,
                  category.id || -1,
                ])
          }
          key={index}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};
