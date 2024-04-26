import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ArrowCircleIcon, CloseIcon } from "../icons";
import Link from "next/link";
import { CombinedAvailableToursDataType } from "@/app/tours/page";

export const AvailableDates = ({
  open,
  setOpen,
  combinedAvailableToursData,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  combinedAvailableToursData: CombinedAvailableToursDataType[];
}) => {
  const [tableIndex, setTableIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const availableTours = useMemo(() => {
    return combinedAvailableToursData.filter((t) => t.tourData !== null);
  }, [combinedAvailableToursData]);
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
                {availableTours
                  .slice(tableIndex * 8, (tableIndex + 1) * 8)
                  .map((availableTour, i) => (
                    <tr className="hover:bg-black/5 hidden md:flex" key={i}>
                      <td className="px-3 flex items-center min-w-10">
                        {tableIndex * 8 + i + 1}
                      </td>
                      <td className="flex-1 flex min-w-36 md:min-w-min py-2 px-3 font-semibold ">
                        <Link
                          href={`/tours/${availableTour.tourId}`}
                          className=" flex-1"
                        >
                          {availableTour.tourData?.title}
                        </Link>
                      </td>
                      <td className="flex-1 min-w-36 md:min-w-min px-3 py-2">
                        {availableTour.tourData?.days} days /{" "}
                        {availableTour.tourData?.nights} nights
                      </td>
                      <td className="flex-1 min-w-36 md:min-w-min px-3 font-semibold py-2">
                        {new Date(availableTour.date).toDateString()}
                      </td>
                      <td className="flex-1 min-w-36 md:min-w-min px-3 font-bold py-2">
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
                      <td className="px-3 py-2">
                        <Link
                          className="bg-primary px-4 py-2 whitespace-nowrap font-bold"
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
