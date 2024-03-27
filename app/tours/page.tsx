"use client";
import {
  DayIcon,
  Footer,
  Header,
  NightIcon,
  PriceIcon,
  // SearchIcon,
  TourCategoriesFilter,
} from "@components";
import { useState, useEffect, FC, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/router";
import Image from "next/image";

const Tours = ({ searchParams }: { searchParams: { category: string } }) => {
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tours, setTours] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(false);
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
    <div className="flex-1 w-full flex flex-col pt-14 min-h-screen justify-between">
      <div className="flex flex-col gap-16 pb-16">
        <Header />
        <div className="flex flex-col gap-8 pt-5 mx-3 md:mx-6">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center">
              <div className="text-3xl md:text-5xl font-semibold">
                Our Tour Packages
              </div>
              {/* <div className="flex flex-row gap-4"> */}
              {/* <div className="bg-quaternary px-4 py-3 flex flex-row gap-3  rounded-2xl">
                  <input
                    type="text"
                    className="bg-transparent outline-none"
                    placeholder="Gobi Desert"
                  />
                  <SearchIcon />
                </div> */}
              <div className="cursor-pointer ripple bg-primary px-4 py-3 flex-row text-tertiary  rounded-2xl hidden md:flex">
                Check Available Tour Schedules
              </div>
              {/* </div> */}
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
      </div>
      <Footer />
    </div>
  );
};

const Tour: FC<TourType> = (props) => {
  const {
    images,
    title,
    overview,
    prices,
    originalPrice,
    days,
    nights,
    // minimumRequired: number;
    categories,
    included,
    excluded,
    // dates: TravelDate[]; will read later
    // itinerary,
    // reviews,
  } = props;
  // let originalPrice = 1200;
  // let mockPrices: PriceType[] = [
  //   {
  //     tourDateId: "1",
  //     date: "2024-03-10",
  //     price: 1000,
  //   },
  //   {
  //     tourDateId: "1",
  //     date: "2024-03-01",
  //     price: 800,
  //   },
  //   {
  //     tourDateId: "1",
  //     date: "2024-03-26",
  //     price: 800,
  //   },
  // ];
  const sale = useMemo(() => {
    const currentDate = new Date();
    const lowerPriceItems = prices.filter((priceItem) => {
      const priceDate = new Date(priceItem.date);
      return priceDate > currentDate && priceItem.price < originalPrice;
    });
    if (lowerPriceItems.length === 0) return null;
    const sortedLowerPriceItems = lowerPriceItems
      .map((priceItem) => ({ ...priceItem, date: new Date(priceItem.date) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return sortedLowerPriceItems[0];
  }, [prices]);
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-8 cursor-default">
      <div className="relative md:w-1/4 md:max-w-80 h-48 md:h-auto">
        <Image
          src={images[0]}
          alt={title}
          className="rounded-3xl object-cover"
          fill
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {sale && (
          <div className="font-bold text-primary text-xl">
            On Sale before {sale.date.toDateString()}
          </div>
        )}
        <div className="font-bold text-xl lg:text-3xl">{title}</div>
        <div className="text-base lg:text-xl">
          {overview.split(" ").slice(0, 50).join(" ")}...
        </div>
      </div>
      <div className="relative md:w-1/4 flex flex-col justify-between gap-4">
        <div className="flex flex-row justify-center md:justify-normal md:flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <PriceIcon />
            <div className="text-xl lg:text-3xl">
              <span
                className={`font-bold text-secondary ${
                  sale ? "line-through" : ""
                }`}
              >
                ${originalPrice}
              </span>
              {sale && (
                <>
                  <span>/</span>
                  <span className="font-bold text-primary"> ${sale.price}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <DayIcon />
            <div className="text-base lg:text-xl">
              <span className="font-bold">{days}</span> days
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <NightIcon />
            <div className="text-base lg:text-xl">
              <span className="font-bold">{nights}</span> nights
            </div>
          </div>
        </div>
        <div className="flex md:flex-col lg:flex-row gap-4">
          <button className="ripple flex-1 py-2 md:py-3 bg-primary text-center font-bold text-tertiary rounded-xl">
            Book Now
          </button>
          <button className="ripple flex-1 py-2 md:py-3 bg-quaternary text-center font-bold rounded-xl">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tours;

// const tours = [
//   {
//     images: [""],
//     title: "",
//     overview: "",
//     onSale: true,
//     saleDate: "21st June",
//     originalPrice: 2000,
//     days: 7,
//     nights: 7,
//     minimumRequired: 3,
//     categories: [],
//     included: [],
//     excluded: [
//       {
//         name: "",
//         explanation: "",
//       },
//     ],
//     rates: [],
//     dates: [
//       {
//         date: "",
//         price: "",
//         tourId: "",
//         title: "",
//         overview: "",
//         people: [
//           {
//             firstName: "",
//             lastName: "",
//             email: "",
//             gender: "",
//             phoneNumber: "",
//             nationality: "",
//           },
//         ],
//       },
//     ],
//     itinerary: [
//       {
//         title: "",
//         description: "",
//       },
//     ],
//     reviews: [
//       {
//         name: "",
//         rate: "",
//         date: "",
//         review: "",
//       },
//     ],
//   },
// ];

// const categories = [
//   "All",
//   "Gobi Tours",
//   "Central Mongolian Tours",
//   "Ulaanbaatar Tours",
// ];
