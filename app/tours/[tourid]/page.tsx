"use client";
import { supabase } from "@/utils/supabase/client";
import {
  Included,
  MainLayout,
  NotIncluded,
  Overview,
  Reviews,
  TourInfo,
  TourIntro,
  TourPlan,
} from "@components";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import _ from "lodash";
import { Availability } from "@/components/tour/availability";
const TourPage = () => {
  const [tour, setTour] = useState<TourType | null>(null);
  const scrollToElement = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { tourid } = params;
  const [availableTours, setAvailableTours] = useState<AvailableTourType[]>([]);
  const saleTours = useMemo<AvailableTourType[]>(() => {
    return availableTours.filter(
      (availableTour) => availableTour.salePrice !== null
    );
  }, [availableTours]);
  useEffect(() => {
    const getTour = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .eq("id", tourid)
          .maybeSingle();
        if (error || !data) {
          throw error;
        }
        const { data: availableToursData, error: err } = await supabase
          .from("availableTours")
          .select("*")
          .eq("tourId", data.id)
          .eq("status", "active")
          .gte("date", new Date().toISOString())
          .order("date");
        if (err) {
          throw err;
        }
        setAvailableTours(availableToursData);
        setTour(data as TourType);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
      setLoading(false);
    };
    getTour();
  }, [tourid]);

  const checkAvailableDate = () => scrollToElement.current?.scrollIntoView();

  if (!tour) {
    return <div>Loading</div>;
  }

  return (
    <MainLayout headerTransparent>
      <div className="flex flex-col gap-4 md:gap-12">
        <TourIntro tour={tour} />
        <div className=" w-screen px-3 xl:px-0 container mx-auto flex flex-col-reverse md:flex-row">
          <div className="w-full md:w-2/3 flex flex-col gap-12">
            <Overview tour={tour} />
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-4">
              <div className="flex-1">
                <Included tour={tour} />
              </div>
              <div className="flex-1">
                <NotIncluded tour={tour} />
              </div>
            </div>
            <div className=" z-10">
              <TourPlan itinerary={tour.itinerary} />
            </div>
            <div ref={scrollToElement} className="pt-24 -mt-24">
              <Availability tour={tour} availableTours={availableTours} />
            </div>
          </div>
          <div className="bg-white pb-4 md:p-0 md:bg-transparent w-full md:w-1/3 md:pl-8 md:relative">
            <TourInfo
              tour={tour}
              saleTours={saleTours}
              checkAvailableDate={checkAvailableDate}
            />
          </div>
        </div>
        <div className="mt-32">
          <Reviews />
        </div>
      </div>
    </MainLayout>
  );
};
export default TourPage;

// useEffect(() => {
//   setScrollImages([
//     images[images.length - 2],
//     images[images.length - 1],
//     ...images.slice(0, 3),
//   ]);
//   const interval = setInterval(() => {
//     setScrollImages((prev) => [
//       ...prev.slice(1),
//       images[Math.abs(index + 3) % images.length],
//     ]);
//     console.log(
//       [...scrollImages.slice(1), images[Math.abs(index + 3) % images.length]],
//       index
//     );
//     setIndex((prev) => (prev == images.length - 1 ? 0 : prev + 1));
//   }, 1500);

//   return () => clearInterval(interval);
// }, [images]);

// useEffect(() => {
//   const interval = setInterval(() => {
//     setIndex((prev) => prev + 1);
//     setTimeout(() => {
//       if (index % images.length == 0) {
//         scrollRef?.current?.scrollTo({
//           top: 0,
//           left: 0,
//           behavior: "instant",
//         });
//       } else {
//         scrollRef?.current?.scrollTo({
//           top: 0,
//           left: ((window.innerWidth - 32) / 3) * index + 16,
//           behavior: "smooth",
//         });
//       }
//     }, 1500);
//     setScrollImages([
//       scrollImages[scrollImages.length - 1],
//       ...scrollImages.slice(1, -1),
//       scrollImages[0],
//     ]);
//   }, 1000);

//   return () => clearInterval(interval);
// }, [index, tour]);
