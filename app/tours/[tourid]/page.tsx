import {
  ArrowRight,
  Included,
  MainLayout,
  NotIncluded,
  Overview,
  Reviews,
  SimilarTours,
  TourCardDataType,
  TourInfo,
  TourIntro,
  TourPlan,
} from "@components";
import _ from "lodash";
import { Availability } from "@/components/tour/availability";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { AvailableTourType, CategoryType, TourType } from "@/utils/types";

type Props = {
  params: { tourid: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const tourid = params.tourid;
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("id", tourid)
    .maybeSingle();
  if (error || !data) {
    throw error;
  }
  const { data: dt, error: e } = await supabase
    .from("tourCategories")
    .select("*")
    .in("id", data.categories);
  const tour = data as TourType;
  const categories = dt as CategoryType[];
  return {
    title: tour.title,
    description: tour.overview,
    keywords: categories.map((category) => category.name),
    category: categories?.[0].name || "travel",
    openGraph: {
      title: tour.title,
      description: tour.overview,
      url: `https://www.ttrmongolia.com/tours/${tour.id}`,
      siteName: "TTR Mongolia",
      images: tour.images,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: tour.title,
      description: tour.overview,
      images: tour.images,
    },
  };
}

const getTourPageDetails = async (tourid: string) => {
  const supabase = createClient();
  try {
    const { data: tour, error } = await supabase
      .from("tours")
      .select("*")
      .eq("id", tourid)
      .maybeSingle();
    if (error || !tour) {
      throw error;
    }
    const { data: availableTours, error: err } = await supabase
      .from("availableTours")
      .select("*")
      .eq("tourId", tour.id)
      .eq("status", "active")
      .gte("date", new Date().toISOString())
      .order("date");
    if (err) {
      throw err;
    }
    const saleTours = availableTours?.filter(
      (availableTour) => availableTour.salePrice !== null
    );
    const { data: categories, error: e } = await supabase
      .from("tourCategories")
      .select("id")
      .in("id", tour.categories);
    if (e) {
      throw e;
    }
    
    const minimumPrice = _.min(saleTours.map((t) => t.salePrice));
    let similarTours: TourCardDataType[] = [];
    const { data: dataWithSameCategory } = await supabase
      .from("random_tours")
      .select(`*`)
      .eq("status", "active")
      .overlaps("categories", categories.map((f) => {return f.id}))
      .limit(2);

    if (dataWithSameCategory) {
      if (dataWithSameCategory?.length == 2) {
        similarTours = [...dataWithSameCategory];
      } else {
        const { data } = await supabase
          .from("random_tours")
          .select(`*`)
          .neq("id", tourid)
          .neq(
            "id",
            dataWithSameCategory?.length == 1
              ? dataWithSameCategory[0].id
              : "-1"
          )
          .limit(2 - (dataWithSameCategory?.length || 0));
        if (data) {
          similarTours = [...dataWithSameCategory, ...data];
        } else {
          similarTours = [...dataWithSameCategory];
        }
      }
    } else {
      const { data } = await supabase
        .from("random_tours")
        .select(`*`)
        .neq("id", tourid)
        .eq("status", "active")
        .limit(2);
      if (data) {
        similarTours = [...data];
      }
    }

    return {
      tour: tour as TourType,
      availableTours: availableTours as AvailableTourType[],
      saleTours: saleTours as AvailableTourType[],
      categories: categories as CategoryType[],
      minimumPrice: minimumPrice as number,
      similarTours: similarTours as TourCardDataType[],
    };
  } catch (error: any) {
    console.error("Error fetching tour categories:", error.message);
    return {
      tour: null,
      availableTours: [],
      saleTours: [],
      categories: [],
      minimumPrice: 0,
      similarTours: [],
    };
  }
};

const TourPage = async ({ params }: { params: { tourid: string } }) => {
  const pageDetails = await getTourPageDetails(params.tourid);
  const {
    tour,
    availableTours,
    saleTours,
    categories,
    minimumPrice,
    similarTours,
  } = pageDetails;
  if (!tour) {
    redirect("/tours");
    return;
  }
  return (
    <MainLayout headerTransparent>
      <div className="flex flex-col gap-4 md:gap-12">
        <TourIntro tour={tour} categories={categories} />
        <div className=" w-screen container px-4 mx-auto flex flex-col-reverse md:flex-row">
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
              <TourPlan map={tour.map} itinerary={tour.itinerary} />
            </div>
            <div id="availableTours" className="pt-24 -mt-24">
              <Availability tour={tour} availableTours={availableTours} />
            </div>
            <SimilarTours similarTours={similarTours} />
          </div>
          <div className="bg-white pb-4 md:p-0 md:bg-transparent w-full md:w-1/3 md:pl-8 md:relative">
            <div className="sticky top-16 md:max-w-96 flex flex-col gap-6">
              <TourInfo
                minimumPrice={minimumPrice}
                tour={tour}
                saleTours={saleTours}
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
