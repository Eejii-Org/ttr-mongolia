"use client";
import {
  ArrowCircleIcon,
  CloseIcon,
  DayIcon,
  Footer,
  Header,
  NightIcon,
  PriceIcon,
  // SearchIcon,
  TourCategoriesFilter,
} from "@components";
import {
  useState,
  useEffect,
  FC,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

const Tours = ({ searchParams }: { searchParams: { category: string } }) => {
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tours, setTours] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledOpened, setScheduledOpened] = useState(false);
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
        <Modal
          open={scheduledOpened}
          setOpen={setScheduledOpened}
          tours={tours}
        />
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
              <button
                data-modal-target="default-modal"
                data-modal-toggle="default-modal"
                className="cursor-pointer ripple bg-primary px-4 py-3 flex-row text-tertiary  rounded-2xl hidden md:flex"
                onClick={() => {
                  if (!scheduledOpened) {
                    document.body.style.cssText = `overflow: hidden`;
                  } else {
                    document.body.style.cssText = `overflow: auto`;
                  }
                  setScheduledOpened(!scheduledOpened);
                }}
              >
                Check Available Tour Schedules
              </button>

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
    dates,
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
    const lowerPriceItems = dates.filter((priceItem) => {
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
        <Link href={"/tours/" + props.id}>
          <Image
            src={images[0]}
            alt={title}
            className="rounded-3xl object-cover"
            fill
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <Link href={"/tours/" + props.id}>
          {sale && (
            <div className="font-bold text-primary text-xl">
              On Sale before {sale.date.toDateString()}
            </div>
          )}
          <div className="font-bold text-xl lg:text-3xl">{title}</div>
          <div className="text-base lg:text-xl">
            {overview.split(" ").slice(0, 50).join(" ")}...
          </div>
        </Link>
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
          <Link
            href={"/tours/" + props.id}
            className="ripple flex-1 py-2 md:py-3 bg-quaternary text-center font-bold rounded-xl"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

interface TourDateType extends TravelDate {
  title: string;
  overview: string;
  days: number;
  nights: number;
  date: string;
  originalPrice: number;
}

const Modal = ({
  open,
  setOpen,
  tours,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  tours: TourType[];
}) => {
  const [tableIndex, setTableIndex] = useState(0);
  const availableTours = useMemo(() => {
    const a: TourDateType[] = [];
    tours.forEach((tour) => {
      a.push(
        ...tour.dates.map((tourDate) => ({
          ...tourDate,
          title: tour.title,
          overview: tour.overview,
          days: tour.days,
          nights: tour.nights,
          originalPrice: tour.originalPrice,
        }))
      );
    });
    return a;
  }, [tours]);
  console.log(tableIndex);
  return (
    <div
      className={`absolute z-50 top-0 bottom-0 w-screen h-screen overflow-scroll backdrop-blur-sm bg-black/50 items-center justify-center ${
        open ? "flex" : "hidden"
      }`}
    >
      <div className="w-full h-full overflow-scroll lg:h-auto lg:w-3/4 bg-white/75 lg:rounded-3xl">
        <div>
          <div className="flex flex-row justify-between items-start p-6">
            <div className="text-3xl lg:text-5xl font-semibold ">
              Available Tour Schedules
            </div>
            <button
              onClick={() => {
                document.body.style.cssText = `overflow: auto`;
                setOpen(false);
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="p-3 lg:p-8 pt-0 lg:pt-0 md:w-full">
            <table className="flex flex-1 flex-col border overflow-scroll w-[calc(100vw-24px)] lg:min-h-[calc(560px)] lg:w-full bg-white rounded-md">
              <tbody>
                <tr className="flex">
                  <th className="px-3 border-b min-w-10"></th>
                  <th className="flex-1 min-w-36 md:min-w-min text-left px-3 py-2 font-semibold md:text-lg  border-b">
                    Tour
                  </th>
                  <th className="flex-1 min-w-36 md:min-w-min text-left px-3 py-2 font-semibold md:text-lg  border-b">
                    Duration
                  </th>
                  <th className="flex-1 min-w-36 md:min-w-min text-left px-3 py-2 font-semibold md:text-lg  border-b">
                    Tour Date
                  </th>
                  <th className="flex-1 min-w-36 md:min-w-min text-left px-3 py-2 font-semibold md:text-lg  border-b">
                    Price
                  </th>
                  <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
                    Booking
                  </th>
                </tr>
                {availableTours.map((availableTour, i) => (
                  <tr className="hover:bg-black/5 flex md:hidden" key={i}>
                    <td className="px-3 flex items-center min-w-10">
                      {tableIndex * 8 + i + 1}
                    </td>
                    <td className="flex-1 flex min-w-36 md:min-w-min py-2 px-3 font-semibold ">
                      <Link href={"a"} className=" flex-1">
                        {availableTour.title} asdf asdf asdf
                      </Link>
                    </td>
                    <td className="flex-1 min-w-36 md:min-w-min px-3 py-2">
                      {availableTour.days} days / {availableTour.nights} nights
                    </td>
                    <td className="flex-1 min-w-36 md:min-w-min px-3 font-semibold py-2">
                      {new Date(availableTour.date).toDateString()}
                    </td>
                    <td className="flex-1 min-w-36 md:min-w-min px-3 font-bold py-2">
                      ${availableTour.originalPrice}/ ${availableTour.price}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        className="bg-primary px-4 py-2 whitespace-nowrap font-bold rounded-xl"
                        onClick={() => console.log("book")}
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
                {availableTours
                  .slice(tableIndex * 8, (tableIndex + 1) * 8)
                  .map((availableTour, i) => (
                    <tr className="hover:bg-black/5 hidden md:flex" key={i}>
                      <td className="px-3 flex items-center min-w-10">
                        {tableIndex * 8 + i + 1}
                      </td>
                      <td className="flex-1 flex min-w-36 md:min-w-min py-2 px-3 font-semibold ">
                        <Link href={"a"} className=" flex-1">
                          {availableTour.title} asdf asdf asdf
                        </Link>
                      </td>
                      <td className="flex-1 min-w-36 md:min-w-min px-3 py-2">
                        {availableTour.days} days / {availableTour.nights}{" "}
                        nights
                      </td>
                      <td className="flex-1 min-w-36 md:min-w-min px-3 font-semibold py-2">
                        {new Date(availableTour.date).toDateString()}
                      </td>
                      <td className="flex-1 min-w-36 md:min-w-min px-3 font-bold py-2">
                        ${availableTour.originalPrice}/ ${availableTour.price}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          className="bg-primary px-4 py-2 whitespace-nowrap font-bold rounded-xl"
                          onClick={() => console.log("book")}
                        >
                          Book Now
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex flex-row justify-end pt-4 gap-3">
              <div
                className="ripple rounded-full"
                onClick={() =>
                  setTableIndex(tableIndex == 0 ? tableIndex : tableIndex - 1)
                }
              >
                <ArrowCircleIcon direction="left" filled="true" />
              </div>
              <div
                className="ripple rounded-full"
                onClick={() =>
                  setTableIndex(
                    tableIndex + 1 == Math.ceil(availableTours.length / 8)
                      ? tableIndex
                      : tableIndex + 1
                  )
                }
              >
                <ArrowCircleIcon direction="right" filled="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;
