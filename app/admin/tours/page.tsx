"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { ArrowRight, TrashIcon } from "@components";
import Link from "next/link";
import { toast } from "react-toastify";

const AdminTours = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const [tours, setTours] = useState<TourType[]>([]);
  const deleteTour = async (tourId?: number) => {
    if (tourId == undefined) return;
    const { error } = await supabase.from("tours").delete().eq("id", tourId);
    if (error) {
      toast.error("Error While Deleting");
      console.error(error);
      return;
    }
    setTours([...tours.filter(({ id }) => id !== tourId)]);
    toast.success("Successfully Deleted A Tour");
  };
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
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4">
        <div className="flex flex-row justify-between pb-4">
          <div className="text-2xl md:text-4xl font-semibold">Tours</div>
          <Link
            href={"/admin/tours/new"}
            className="cursor-pointer ripple bg-primary px-4 py-2 flex-row text-tertiary  rounded-xl hidden md:flex"
          >
            Add Tour
          </Link>
        </div>
        <table className="border overflow-scroll w-full bg-white rounded-md">
          <tr>
            <td className="max-w-12 w-12 border-b"></td>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Status
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Tour
            </th>

            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Description
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Duration
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Price
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
          </tr>
          {tours.map((tour, i) => (
            <tr className="hover:bg-black/5 table-row" key={i}>
              <td className="max-w-12 w-12">
                <button
                  className="font-bold rounded-full ripple p-3"
                  onClick={() => deleteTour(tour.id)}
                >
                  <TrashIcon />
                </button>
              </td>
              <td className="text-left px-3 py-2 font-semibold md:text-lg">
                {tour.status == "active" ? (
                  <div
                    className={`border border-green-500 bg-green-500/10 w-min px-3 py-1 text-sm rounded text-green-500`}
                  >
                    Active
                  </div>
                ) : (
                  <div
                    className={`border border-red-500 bg-red-500/10 w-min px-3 py-1 text-sm rounded text-red-500`}
                  >
                    InActive
                  </div>
                )}
              </td>
              <td className="py-2 px-3 font-semibold ">{tour.title}</td>
              <td className="px-3 py-2 whitespace-nowrap text-ellipsis max-w-64 overflow-hidden">
                {tour.overview}
              </td>
              <td className="px-3 py-2">
                {tour.days} days / {tour.nights} nights
              </td>
              <td className=" px-3 font-bold py-2">${tour.originalPrice}</td>
              <td className="flex justify-end max-w-12 w-12">
                <Link
                  className="font-bold rounded-full ripple p-3"
                  href={`/admin/tours/${tour.id}`}
                >
                  <ArrowRight color="black" />
                </Link>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};
export default AdminTours;
