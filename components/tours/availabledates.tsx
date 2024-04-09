import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { ArrowCircleIcon, CloseIcon } from "../icons";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface TourDateType extends TravelDate {
  title: string;
  overview: string;
  days: number;
  nights: number;
  date: string;
  originalPrice: number;
}

export const AvailableDates = ({
  open,
  setOpen,
  tours,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  tours: TourType[];
}) => {
  const supabase = createClient();
  const [tableIndex, setTableIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<TravelDate[]>([]);
  const availableTours = useMemo(() => {
    let obj: { [key: number]: TourType } = {};
    tours.map((tour) => {
      if (tour.id) obj[tour.id] = tour;
    });
    return availableDates.map((availableDate) => ({
      ...availableDate,
      ...obj[availableDate.id],
    }));
  }, [tours, availableDates]);

  useEffect(() => {
    const getAvailableDates = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("availableTours")
          .select("*")
          .gte("date", new Date().toISOString());
        if (error) {
          throw error;
        }
        setAvailableDates(data);
      } catch (error: any) {
        console.error("Error fetching availableTours:", error.message);
      }
      setLoading(false);
    };
    getAvailableDates();
  }, []);

  // const availableTours = useMemo(() => {
  //   const a: TourDateType[] = [];
  //   tours.forEach((tour) => {
  //     a.push(
  //       ...tour.dates.map((tourDate) => ({
  //         ...tourDate,
  //         title: tour.title,
  //         overview: tour.overview,
  //         days: tour.days,
  //         nights: tour.nights,
  //         originalPrice: tour.originalPrice,
  //       }))
  //     );
  //   });
  //   return a;
  // }, [tours]);
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
                        {availableTour.title}
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
                      <Link
                        className="bg-primary px-4 py-2 whitespace-nowrap font-bold rounded-xl"
                        // onClick={() => console.log("book")}
                        href={{
                          pathname: "/book",
                          query: {
                            availableTourId: availableTour.id,
                          },
                        }}
                      >
                        Book Now
                      </Link>
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
                        <Link
                          className="bg-primary px-4 py-2 whitespace-nowrap font-bold rounded-xl"
                          href={{
                            pathname: "/book",
                            query: {
                              availableTourId: availableTour.id,
                            },
                          }}
                        >
                          Book Now
                        </Link>
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
