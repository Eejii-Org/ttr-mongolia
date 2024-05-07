"use client";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowRight,
  Included,
  MainLayout,
  NotIncluded,
  Overview,
  Reviews,
  SimilarTours,
  TourInfo,
  TourIntro,
  TourPlan,
} from "@components";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import _ from "lodash";
import { Availability } from "@/components/tour/availability";
import Link from "next/link";
const TourPage = () => {
  const [tour, setTour] = useState<TourType | null>(null);
  const scrollToElement = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { tourid } = params;
  const [availableTours, setAvailableTours] = useState<AvailableTourType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
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

  useEffect(() => {
    const getCategories = async () => {
      if (!tour) return;
      try {
        const { data, error } = await supabase
          .from("tourCategories")
          .select("*")
          .in("id", tour.categories);
        if (error) {
          throw error;
        }
        setCategories(data);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
    };
    if (tour) getCategories();
  }, [tour]);

  const checkAvailableDate = () => scrollToElement.current?.scrollIntoView();

  if (!tour) {
    return <div>Loading</div>;
  }

  return (
    <MainLayout headerTransparent>
      <div className="flex flex-col gap-4 md:gap-12">
        <TourIntro tour={tour} categories={categories} />
        <div className=" w-screen px-3 xl:px-0 container mx-auto flex flex-col-reverse md:flex-row">
          <div className="w-full md:w-2/3 flex flex-col gap-20">
            <Overview tour={tour} />
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-4">
              <div className="flex-1">
                <Included tour={tour} />
              </div>
              <div className="flex-1">
                <NotIncluded tour={tour} />
              </div>
            </div>
            <div className="z-10">
              <TourPlan itinerary={tour.itinerary} />
            </div>
            <div ref={scrollToElement} className="pt-24 -mt-24">
              <Availability tour={tour} availableTours={availableTours} />
            </div>
            <SimilarTours
              tourId={tourid as string}
              categories={tour.categories}
            />
          </div>
          <div className="bg-white pb-4 md:p-0 md:bg-transparent w-full md:w-1/3 md:pl-8 md:relative">
            <div className="sticky top-16 md:max-w-96 flex flex-col gap-6">
              <TourInfo
                tour={tour}
                saleTours={saleTours}
                checkAvailableDate={checkAvailableDate}
              />
              <div className="bg-[#FFF5E5]  flex flex-col gap-8 px-4 py-3 rounded-lg">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg">Got a question?</h3>
                  <p>
                    Contact us now to have all of your adventure related
                    questions answered!
                  </p>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={"/contact"}
                    className="flex flex-row items-center font-bold text-primary"
                  >
                    Contact Now
                    <ArrowRight color="#FDA403" />
                  </Link>
                </div>
              </div>
              <div className="bg-[#FFF5E5]  flex flex-col gap-8 px-4 py-3 rounded-lg">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg">Request a Private Tour</h3>
                  <p>
                    If you'are looking to enjoy a trip privately with your own
                    group, fill up our form and our team will be in touch.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={"/privatetour"}
                    className="flex flex-row items-center font-bold text-primary"
                  >
                    Request Private Tour
                    <ArrowRight color="#FDA403" />
                  </Link>
                </div>
              </div>
            </div>
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
