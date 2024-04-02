"use client";
import {
  AvailableDates,
  Footer,
  Header,
  MainLayout,
  Tour,
  TourCategoriesFilter,
} from "@components";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

const Tours = ({ searchParams }: { searchParams: { category: string } }) => {
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tours, setTours] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledOpened, setScheduledOpened] = useState(false);
  const selectedTours = useMemo(() => {
    if (selectedCategory == "All") return tours;
    return tours.filter((tour) => tour.categories.includes(selectedCategory));
  }, [selectedCategory, tours]);
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("tours").select("*");
        if (error) {
          throw error;
        }
        setTours(data);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
      setLoading(false);
    };
    fetchTours();
  }, []);
  useEffect(() => {
    if (searchParams?.category) {
      setSelectedCategory(searchParams.category);
    }
  }, [searchParams]);

  return (
    <MainLayout>
      <AvailableDates
        open={scheduledOpened}
        setOpen={setScheduledOpened}
        tours={tours}
      />
      <div className="flex flex-col gap-8 pt-14 mx-3 md:mx-6">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center">
            <div className="text-3xl md:text-5xl font-semibold">
              Our Tour Packages
            </div>
            <button
              data-modal-target="default-modal"
              data-modal-toggle="default-modal"
              className="cursor-pointer ripple bg-primary px-4 py-3 flex-row text-tertiary  rounded-2xl hidden md:flex"
              onClick={() => {
                if (!scheduledOpened) {
                  document.body.style.cssText = `overflow: hidden`;
                } else {
                  document.body.style.cssText = `overflow: auto`;
                }
                setScheduledOpened(!scheduledOpened);
              }}
            >
              Check Available Tour Schedules
            </button>
          </div>

          <TourCategoriesFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {selectedTours?.length == 0 ? (
              <div>There is currently no tours with this category</div>
            ) : (
              <>
                {selectedTours.map((tour, index) => (
                  <Tour {...tour} key={index} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Tours;
