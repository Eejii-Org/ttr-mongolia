"use client";
import {
  AvailableDates,
  MainLayout,
  Tour,
  TourCategoriesFilter,
} from "@components";
import { useState, useEffect, useMemo, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";

const SearchBarFallback = () => {
  return <>SearchBar</>;
};

const Tours = () => {
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All"
  );
  const [tours, setTours] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduledOpened, setScheduledOpened] = useState(false);
  const selectedTours = useMemo(() => {
    if (selectedCategory == "All") return tours;
    return tours.filter((tour) =>
      tour.categories.includes(Number(selectedCategory))
    );
  }, [selectedCategory, tours]);
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .eq("status", "active");
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

  return (
    <MainLayout>
      <AvailableDates
        open={scheduledOpened}
        setOpen={setScheduledOpened}
        tours={tours}
      />
      <div className="flex flex-col gap-8 px-3 md:p-0 pt-16 md:pt-14 md:mx-auto container">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center">
            <div className="text-2xl md:text-4xl font-semibold">
              Our Tour Packages
            </div>
            <button
              data-modal-target="default-modal"
              data-modal-toggle="default-modal"
              className="cursor-pointer ripple bg-primary px-4 py-3 rounded flex-row text-tertiary md:flex"
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
          <Suspense fallback={<SearchBarFallback />}>
            <TourCategoriesFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Suspense>
        </div>
        <div className="flex flex-col gap-12">
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
      </div>
    </MainLayout>
  );
};

export default Tours;
