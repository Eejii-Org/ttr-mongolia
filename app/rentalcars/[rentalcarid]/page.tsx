import {
  ACIcon,
  ArrowRight,
  EngineIcon,
  MainLayout,
  PersonIcon,
  PriceIcon,
  RentalCarCardType,
  StorageImage,
  TourCardDataType,
  TransmissionIcon,
} from "@components";
import _ from "lodash";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { CategoryType, RentalCarType, TourType } from "@/utils/types";
import { TiptapContent } from "@/components/tiptapcontent";

type Props = {
  params: { rentalcarid: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const rentalcarid = params.rentalcarid;
  const { data, error } = await supabase
    .from("rentalCars")
    .select("*")
    .eq("id", rentalcarid)
    .maybeSingle();
  if (error || !data) {
    throw error;
  }
  const rentalCar = data as RentalCarType;
  return {
    title: rentalCar.name,
    description: rentalCar.subDescription,
    keywords: ["rental car", "mongolia", "travel", "rent", "cheap"],
    category: "travel",
    openGraph: {
      title: rentalCar.name,
      description: rentalCar.subDescription,
      url: `https://www.ttrmongolia.com/rentalcars/${rentalcarid}`,
      siteName: "TTR Mongolia",
      images: rentalCar.mainImage,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: rentalCar.name,
      description: rentalCar.subDescription,
      images: rentalCar.mainImage,
    },
  };
}

const getRentalCarPageDetails = async (rentalcarid: string) => {
  const supabase = createClient();
  try {
    const { data: rentalCar, error } = await supabase
      .from("rentalCars")
      .select("*")
      .eq("id", rentalcarid)
      .maybeSingle();
    if (error || !rentalCar) {
      throw error;
    }
    let randomRentalCars: RentalCarCardType[] = [];
    const { data } = await supabase
      .from("random_rentalcars")
      .select(`*`)
      .neq("id", rentalcarid)
      .eq("status", "active")
      .limit(2);
    if (data) {
      randomRentalCars = [...data];
    }

    return {
      rentalCar: rentalCar as RentalCarType,
      randomRentalCars: randomRentalCars as RentalCarCardType[],
    };
  } catch (error: any) {
    console.error("Error fetching rental cars:", error.message);
    return {
      rentalCar: null,
      randomRentalCars: [],
    };
  }
};

const RentalCarPage = async ({
  params,
}: {
  params: { rentalcarid: string };
}) => {
  const pageDetails = await getRentalCarPageDetails(params.rentalcarid);
  const {
    rentalCar,
    // randomRentalCars,
  } = pageDetails;
  console.log(rentalCar, params.rentalcarid);
  if (!rentalCar) {
    redirect("/rentalcars");
    return;
  }
  return (
    <MainLayout>
      <div className="px-4 flex flex-col gap-8">
        <div className="flex flex-row justify-between w-full md:gap-2 bg-quaternary p-4 md:p-6 mt-4 md:mt-6">
          <div className="text-2xl md:text-4xl font-semibold">
            {rentalCar.name}
          </div>
          <Link
            href={{
              pathname: "/requestcar",
              query: {
                rentalcarid: rentalCar.id,
              },
            }}
            className="ripple text-white w-auto px-16 py-2 md:py-3 bg-primary text-center font-bold rounded flex items-center justify-center"
          >
            Rent Request
          </Link>
        </div>
        <div className="flex-1 flex gap-4 flex-col-reverse md:flex-row">
          <div className="flex-1 overflow-hidden">
            <TiptapContent content={rentalCar?.description} />
          </div>
          <div className="w-full min-h-96 md:w-1/2 flex flex-col">
            <div className="relative flex-1">
              <StorageImage
                className="object-contain"
                src={rentalCar.mainImage}
                alt="RentalCarMainImage"
                fill
              />
            </div>
            <div className="flex flex-col md:gap-2 bg-quaternary p-4 md:p-6 mt-4 md:mt-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="flex flex-row gap-2">
                  <PersonIcon />
                  <div className="flex flex-row gap-1 flex-wrap">
                    <label className="font-semibold">Number of Seats:</label>
                    {rentalCar.carDetail.numberOfSeats}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <TransmissionIcon />
                  <div className="flex flex-row gap-1 flex-wrap">
                    <label className="font-semibold">Transmission:</label>
                    {rentalCar.carDetail.transmission}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <EngineIcon />
                  <div className="flex flex-row gap-1 flex-wrap">
                    <label className="font-semibold">Engine:</label>
                    {rentalCar.carDetail.engine}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <ACIcon />
                  <div className="flex flex-row gap-1 flex-wrap">
                    <label className="font-semibold">A/C:</label>
                    {rentalCar.carDetail.ac}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <PriceIcon />
                  <div className="flex flex-row gap-1 flex-wrap">
                    <label className="font-semibold">Price Per Day:</label>
                    <div className="underline font-bold">
                      ${rentalCar.carDetail.pricePerDay}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center flex-col gap-8">
          <div className="text-xl md:text-2xl font-semibold">Gallery</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {rentalCar.otherImages.map((otherImage, index) => (
              <div className="aspect-video relative">
                <StorageImage
                  src={otherImage}
                  alt={"otherImage" + index}
                  className="bg-quaternary object-contain"
                  fill
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RentalCarPage;

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