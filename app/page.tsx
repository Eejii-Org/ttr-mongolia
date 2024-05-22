import { FC } from "react";
import {
  CustomerSupport,
  Intro,
  OurAgency,
  Values,
  Reviews,
  MainLayout,
  PrivateTour,
  TourCategories,
  ModifiedAvailableTourType,
  SaleDepartures,
  TourCardDataType,
} from "@components";
import { createClient } from "@/utils/supabase/server";

const getIntro = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("intro")
      .select("*")
      .eq("status", "active")
      .order("order", { ascending: true });
    if (error) {
      throw error;
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching intro:", error.message);
  }
};
const getCategories = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("tourCategories")
      .select("*")
      .order("count")
      .limit(3);
    if (error) {
      throw error;
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching tour categories:", error.message);
  }
};
const getAvailableTours = async () => {
  const supabase = createClient();
  try {
    const { data: availableTours, error: err } = await supabase
      .from("availableTours")
      .select("salePrice, tourId, date")
      .eq("status", "active")
      .gte("date", new Date().toISOString())
      .not("salePrice", "is", null)
      .order("salePrice")
      .limit(3);
    if (err) throw err;
    const tourIdArray = availableTours?.map((aTour) => aTour.tourId) || [];
    const { data: tours, error } = await supabase
      .from("tours")
      .select("title, id, displayPrice, originalPrice, overview, images, days")
      .in("id", tourIdArray);
    if (error) throw error;
    const combinedAvailableToursData =
      !tours || !availableTours
        ? []
        : availableTours.map((availableTour) => {
            return {
              ...availableTour,
              ...tours.find((tour) => tour.id == availableTour.tourId),
            };
          });
    return combinedAvailableToursData;
  } catch (error: any) {
    console.error(error);
    return [];
  }
};
const Home: FC = async () => {
  const intro = await getIntro();
  const categories = await getCategories();
  const availableTours = await getAvailableTours();
  return (
    <MainLayout headerTransparent>
      <div className="flex-1 w-full flex flex-col gap-28">
        <Intro intro={intro as IntroType[]} />
        {/* <InfiniteScrollingTours
          tours={availableTours as ModifiedAvailableTourType[]}
        /> */}
        <div className="container px-4 mx-auto flex flex-col gap-28">
          <SaleDepartures data={availableTours as TourCardDataType[]} />
          <Values />
          <TourCategories categories={categories as CategoryType[]} />
        </div>
        <CustomerSupport />
        <div className="container px-4 mx-auto flex flex-col gap-28">
          <OurAgency />
        </div>
        <PrivateTour />
        <Reviews />
      </div>
    </MainLayout>
  );
};

export default Home;
