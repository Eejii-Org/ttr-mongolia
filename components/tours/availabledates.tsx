"use client";
import { useEffect, useMemo, useState } from "react";
import { CloseIcon } from "../icons";
import Link from "next/link";
import { CombinedAvailableToursDataType } from "@/app/tours/page";
import { useRouter, useSearchParams } from "next/navigation";

export const AvailableDates = ({
  combinedAvailableToursData,
}: {
  combinedAvailableToursData: CombinedAvailableToursDataType[];
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  // const [tableIndex, setTableIndex] = useState(0);
  const availableTours = useMemo(() => {
    return combinedAvailableToursData.filter((t) => t.tourData !== null);
  }, [combinedAvailableToursData]);
  const availableDatesOpen = searchParams.get("availableDatesOpen");
  useEffect(() => {
    if (availableDatesOpen) {
      document.body.style.cssText = `overflow: hidden`;
      setOpen(availableDatesOpen == "true");
    }
  }, [availableDatesOpen]);
  return (
    <>
      <div className="relative flex md:flex-none">
        <button
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          className="cursor-pointer ripple flex-1 md:flex-auto bg-primary px-4 py-3 rounded flex-row text-tertiary md:flex relative"
          onClick={() => {
            if (!open) {
              document.body.style.cssText = `overflow: hidden`;
            } else {
              document.body.style.cssText = `overflow: auto`;
            }
            setOpen(!open);
          }}
        >
          Check Next Tour Departures
        </button>
        <span className="  bg-red-500 w-4 h-4 absolute -right-[6px] -top-[6px] border-2 border-white rounded-full" />
      </div>

      <div
        className={`absolute z-50 top-0 left-0 bottom-0 right-0 w-screen h-screen overflow-scroll backdrop-blur-sm bg-black/50 items-center justify-center ${
          open ? "flex" : "hidden"
        }`}
      >
        <div className="w-full h-full overflow-scroll bg-white/75">
          <div>
            <div className="flex flex-row justify-between items-start p-6">
              <div className="text-xl lg:text-2xl font-semibold ">
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
              <table className="table-fixed md:table-auto border w-[calc(100vw-24px)] lg:w-full bg-white rounded-md text-xs md:text-base">
                <thead>
                  <tr>
                    {/* <th className="px-3 border-b"></th> */}
                    <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
                      Tour
                    </th>
                    <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
                      Duration
                    </th>
                    <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
                      Starting Date
                    </th>
                    <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
                      Price
                    </th>
                    {/* <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b flex justify-end">
                      Booking
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {availableTours.map((availableTour, i) => (
                    <tr
                      className="hover:bg-black/5 cursor-pointer"
                      onClick={() =>
                        router.push(`/tours/${availableTour.tourId}`)
                      }
                      key={i}
                    >
                      {/* <td className="px-3  items-center">{i + 1}</td> */}
                      <td className="flex-1 py-2 px-3 font-semibold">
                        {/* <Link
                          href={`/tours/${availableTour.tourId}`}
                          className=" flex-1"
                        > */}
                        {availableTour.tourData?.title}
                        {/* </Link> */}
                      </td>
                      <td className="px-3 py-2">
                        {availableTour.tourData?.days} days
                      </td>
                      <td className="px-3 font-semibold py-2">
                        {new Date(availableTour.date)
                          .toDateString()
                          .split(" ")
                          .slice(1)
                          .join(" ")}
                      </td>
                      <td className="px-3 font-bold py-2">
                        <span
                          className={`${
                            availableTour.salePrice ? "line-through" : ""
                          }`}
                        >
                          ${availableTour.tourData?.displayPrice}
                        </span>
                        {availableTour.salePrice && (
                          <>
                            /
                            <span className="text-primary">
                              ${availableTour.salePrice}
                            </span>
                          </>
                        )}
                      </td>
                      {/* <td className="px-3 py-2 flex justify-end">
                        <Link
                          className="bg-primary px-4 py-2 whitespace-nowrap font-semibold rounded"
                          href={{
                            pathname: "/book",
                            query: {
                              availableTourId: availableTour.id,
                            },
                          }}
                        >
                          Book
                        </Link>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <div className="flex flex-row justify-end pt-4 gap-3">
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
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
