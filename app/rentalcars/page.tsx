import { MainLayout, RentalCarCard } from "@components";
import { createClient } from "@/utils/supabase/server";

const getRentalCars = async () => {
  const supabase = createClient();
  try {
    const { data: rentalCars, error: er } = await supabase
      .from("rentalCars")
      .select("id, name, subDescription, mainImage, carDetail");
    if (er) throw er;
    return {
      rentalCars,
    };
  } catch (error: any) {
    console.error("Error fetching rental cars:", error.message);
    return {
      rentalCars: [],
    };
  }
};

const RentalCars = async () => {
  const { rentalCars } = await getRentalCars();
  // Test deploy
  return (
    <MainLayout>
      <div className="flex flex-col gap-8 px-3 lg:p-0 lg:mx-auto lg:container lg:px-4">
        <div className="flex flex-col md:gap-2">
          <div className="text-2xl md:text-4xl font-semibold">
            Our Available Cars
          </div>
          <p className="text-base md:text-lg">
            Embark on an unforgettable journey through Mongolia's breathtaking
            landscapes, where every mile reveals a new adventure waiting to be
            explored!
          </p>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {rentalCars.map((rentalCar, index) => (
            <RentalCarCard rentalCar={rentalCar} key={index} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default RentalCars;
