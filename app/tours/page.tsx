import { MainLayout, ToursFilter } from "@components";
import { createClient } from "@/utils/supabase/server";
import { AvailableTourType } from "@/utils";

export interface CombinedToursDataType extends TType {
  availableTours: AvailableTourType[];
}
export interface CombinedAvailableToursDataType extends AvailableTourType {
  tourData: TType | null;
}

type TType = {
  id?: number;
  images: string[];
  title: string;
  overview: string;
  days: number;
  categories: number[];
  displayPrice: number | null;
};

const getTours = async () => {
  const supabase = createClient();

  try {
    const { data: tours, error } = await supabase
      .from("tours")
      .select("id, title, overview, days, images, categories, displayPrice")
      .eq("status", "active");
    if (error) {
      throw error;
    }
    const { data: availableTours, error: err } = await supabase
      .from("availableTours")
      .select("*")
      .eq("status", "active")
      .gte("date", new Date().toISOString())
      .order("date");
    if (err) {
      throw error;
    }
    const combinedToursData = tours
      ? tours
          .map((tour) => {
            return {
              ...tour,
              availableTours: availableTours.filter(
                (availableTours) => availableTours.tourId === tour.id
              ),
            };
          })
          .sort(
            (a, b) =>
              a.availableTours.reduce(
                (a, { salePrice }) => a + (salePrice === null ? 1 : 0),
                0
              ) -
                b.availableTours.reduce(
                  (a, { salePrice }) => a + (salePrice === null ? 1 : 0),
                  0
                ) || b?.availableTours?.length - a?.availableTours?.length
          )
      : [];
    const combinedAvailableToursData =
      !tours || !availableTours
        ? []
        : availableTours.map((availableTour) => {
            return {
              ...availableTour,
              tourData:
                tours.find((tour) => tour.id == availableTour.tourId) || null,
            };
          });
    const { data: tourCategories, error: er } = await supabase
      .from("tourCategories")
      .select("*");
    if (er) throw er;

    return {
      combinedToursData,
      combinedAvailableToursData,
      tourCategories,
    };
  } catch (error: any) {
    console.error("Error fetching tour categories:", error.message);
    return {
      combinedToursData: [],
      combinedAvailableToursData: [],
      tourCategories: [],
    };
  }
};

const Tours = async () => {
  const { combinedToursData, combinedAvailableToursData, tourCategories } =
    await getTours();
  return (
    <MainLayout>
      <div className="flex flex-col gap-8 px-3 lg:p-0 lg:mx-auto lg:container lg:px-4">
        <ToursFilter
          combinedToursData={combinedToursData}
          combinedAvailableToursData={combinedAvailableToursData}
          tourCategories={tourCategories}
        />
      </div>
    </MainLayout>
  );
};

export default Tours;
