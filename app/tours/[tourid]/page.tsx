"use client";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowRight,
  DayIcon,
  Footer,
  Header,
  NightIcon,
  PriceIcon,
  Reviews,
  SaleIcon,
  TourPlan,
} from "@components";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
const TourPage = () => {
  const supabase = createClient();
  const [tour, setTour] = useState<TourType | null>(null);
  const scrollToElement = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { tourid } = params;
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const images = useMemo<string[]>(() => {
    if (!tour || tour?.images?.length == 0) return [];
    return tour?.images;
  }, [tour]);

  const checkAvailableDate = () => scrollToElement.current?.scrollIntoView();

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .eq("id", tourid);

        if (error) {
          throw error;
        }
        setTour(data[0] as TourType);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
      setLoading(false);
    };
    fetchTour();
  }, [tourid]);

  const sale = useMemo(() => {
    if (!tour) return null;
    const currentDate = new Date();
    const lowerPriceItems = tour.dates.filter((priceItem) => {
      const priceDate = new Date(priceItem.date);
      return priceDate > currentDate && priceItem.price < tour.originalPrice;
    });
    if (lowerPriceItems.length === 0) return null;
    const sortedLowerPriceItems = lowerPriceItems
      .map((priceItem) => ({ ...priceItem, date: new Date(priceItem.date) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return sortedLowerPriceItems[0];
  }, [tour]);

  if (!tour) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col  min-h-screen justify-between">
      <div className="flex flex-col gap-16 pb-16">
        <Header transparent={true} />
        <div className="flex flex-col gap-4">
          <div
            className="w-fill mt-0 relative overflow-hidden flex items-center justify-center intro-section"
            style={{
              height: "calc(512px)",
            }}
          >
            <div className="z-40 gip text-white flex flex-col gap-4 text-center items-center justify-center">
              <div className="font-bold text-3xl md:text-4xl lg:text-7xl md:font-semibold">
                {tour?.title}
              </div>
              <div className=" w-16 h-1 bg-white/40 rounded" />
              <div className="font-medium text-xl text-center flex flex-row items-center justify-center gap-3 bg-black/25 px-3 py-1 rounded-full">
                <div className="text-xl">{tour.reviews.length} Reviews</div>
                <div className="flex flex-row items-center justify-center gap-3">
                  {tour.categories.map((category, index) => (
                    <div
                      className="flex flex-row items-center justify-center gap-3"
                      key={index}
                    >
                      <div className="w-[calc(2px)] h-4 bg-white rounded" />
                      <div>{category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {images?.map((image, i) => (
              <div
                key={i}
                className={`absolute w-full h-full select-none ${
                  i == index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transition: "all 400ms",
                  top: 0,
                }}
              >
                <Image
                  src={image}
                  fill
                  alt={image + i}
                  priority
                  // unoptimized={true}
                  className={`object-cover select-none ${
                    i == (index + 1) % images.length
                      ? "introImageAnimation"
                      : ""
                  }`}
                />
              </div>
            ))}
          </div>
          <div
            className="flex flex-row gap-4 overflow-x-scroll snap-x overflow-y-hidden snap-mandatory no-scroll-bar"
            onScroll={(e) => {
              const target = e.target as HTMLDivElement;
              target.scrollWidth;
              setIndex(
                Math.round(
                  target.scrollLeft / ((window.innerWidth - 32) / 3 + 16)
                )
              );
              console.log(
                target.scrollLeft / ((window.innerWidth - 32) / 3 + 16)
              );
            }}
            ref={scrollRef}
          >
            <div
              className={`min-w-[calc((100vw-32px)/3)] h-48 relative snap-end transition-all overflow-hidden`}
            ></div>
            {images?.map((image, i) => (
              <div
                key={i}
                className={`min-w-[calc((100vw-32px)/3)] h-48 relative snap-end transition-all overflow-hidden rounded`}
              >
                <div
                  className={`bg-black/30 w-full h-full absolute top-0 left-0 z-10 ${
                    i == index ? "hidden" : "flex"
                  }`}
                ></div>
                <Image
                  src={image}
                  fill
                  alt={image}
                  priority
                  // unoptimized={true}
                  className={`object-cover select-none ${
                    i == index ? "introImageAnimation" : "mix-blend-luminosity"
                  }`}
                />
              </div>
            ))}
            <div
              className={`min-w-[calc((100vw-32px)/3)] h-48 relative snap-end transition-all overflow-hidden`}
            ></div>
          </div>
          <div className=" w-screen px-3 xl:px-0 xl:w-auto xl:max-w-[calc(1280px)] mx-auto flex flex-col-reverse md:flex-row">
            <div className="w-full md:w-2/3 flex flex-col gap-8">
              <Overview tour={tour} />
              <Included tour={tour} />
              <NotIncluded tour={tour} />
              <div className=" z-10">
                <TourPlan itinerary={tour.itinerary} />
              </div>
              <div ref={scrollToElement} className="pt-24 -mt-24">
                <Availability tour={tour} />
              </div>
            </div>
            <div className="bg-white pb-4 md:p-0 md:bg-transparent w-full md:w-1/3 md:pl-8 md:relative">
              <div className="flex sticky top-16 justify-center md:justify-normal flex-col gap-2">
                {sale && (
                  <div className="font-bold text-primary md:text-xl">
                    On Sale before {sale.date.toDateString()}
                  </div>
                )}
                <div className="flex flex-row md:flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <PriceIcon />
                    <div className="text-xl lg:text-3xl">
                      <span
                        className={`font-bold text-secondary ${
                          sale ? "line-through" : ""
                        }`}
                      >
                        ${tour.originalPrice}
                      </span>
                      {sale && (
                        <>
                          <span>/</span>
                          <span className="font-bold text-primary">
                            {" "}
                            ${sale.price}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <DayIcon />
                    <div className="text-base lg:text-xl">
                      <span className="font-bold">{tour.days}</span> days
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <NightIcon />
                    <div className="text-base lg:text-xl">
                      <span className="font-bold">{tour.nights}</span> nights
                    </div>
                  </div>
                </div>

                <button
                  className="md:max-w-60 mt-5 ripple flex-1 py-3 bg-primary text-center font-bold text-secondary rounded-xl"
                  onClick={checkAvailableDate}
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
          <div className=" mt-32">
            <Reviews />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default TourPage;

const Overview = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl md:text-4xl font-semibold">Overview</div>
      <div className="md:text-xl">{tour?.overview}</div>
    </div>
  );
};

const Included = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Included</div>
      <div className="md:text-xl">
        <ul>
          {tour.included.map(({ name, explanation }, index) => (
            <li key={index}>
              <div>
                <span className="font-bold pr-4">•</span>
                {name}
              </div>
              {explanation && explanation !== "" && (
                <ul className="pl-4">
                  <li>
                    <span className="font-bold pr-4">-</span>
                    {explanation}
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const NotIncluded = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Not Included</div>
      <div className="md:text-xl">
        <ul>
          {tour.excluded.map(({ name, explanation }, index) => (
            <li key={index}>
              <div>
                <span className="font-bold pr-4">•</span> {name}
              </div>
              {explanation && explanation !== "" && (
                <ul className="pl-4">
                  <li>
                    <span className="font-bold pr-4">-</span>
                    {explanation}
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Availability = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Availability</div>
      <div className="flex flex-col gap-4">
        {tour.dates.map((tourDate, index) => (
          <AvailabilityItem
            {...tourDate}
            originalPrice={tour.originalPrice}
            days={tour.days}
            nights={tour.nights}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

interface AvailabilityItemPropsType extends TravelDate {
  originalPrice: number;
  days: number;
  nights: number;
}

const AvailabilityItem: FC<AvailabilityItemPropsType> = ({
  date,
  price,
  originalPrice,
  days,
  nights,
}) => {
  const isOnSale = useMemo(() => {
    return price < originalPrice;
  }, [originalPrice, price]);
  return (
    <div className="shadow-md p-4 flex flex-col md:flex-row flex-wrap lg:flex-row rounded border border-quinary gap-4 md:gap-8">
      <div className="flex flex-row gap-8 items-center">
        <div>
          <div className="font-medium text-base text-[#c1c1c1]">Monday</div>
          <div className="font-bold text-xl">July 1 2024</div>
        </div>
        <ArrowRight />
        <div>
          <div className="font-medium text-base text-[#c1c1c1]">Monday</div>
          <div className="font-bold text-xl">July 1 2024</div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center flex-col">
        <div className="flex flex-row md:flex-col gap-4 md:gap-0 items-center md:items-start">
          <div className="flex flex-row items-center gap-1">
            <SaleIcon />
            <div className="font-bold text-primary text-lg md:text-xl">
              On Sale
            </div>
          </div>
          <div className="text-lg lg:text-xl">
            <span
              className={`font-bold text-secondary ${
                isOnSale ? "line-through" : ""
              }`}
            >
              ${originalPrice}
            </span>
            {isOnSale && (
              <>
                <span>/</span>
                <span className="font-bold text-primary"> ${price}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button className="ripple py-3 px-8 bg-primary text-center font-bold text-secondary rounded-xl flex-1 md:flex-auto">
          Book Now
        </button>
      </div>
    </div>
  );
};

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
