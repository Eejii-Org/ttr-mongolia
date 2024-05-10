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

const Home: FC = async () => {
  const intro = await getIntro();
  const categories = await getCategories();
  return (
    <MainLayout headerTransparent>
      <div className="flex-1 w-full flex flex-col gap-28">
        <Intro intro={intro as IntroType[]} />
        <div className="container mx-auto flex flex-col gap-28">
          <Values />
          <TourCategories categories={categories as CategoryType[]} />
        </div>
        <CustomerSupport />
        <div className="container mx-auto flex flex-col gap-28">
          <OurAgency />
        </div>
        <PrivateTour />
        <Reviews />
      </div>
    </MainLayout>
  );
};

export default Home;
