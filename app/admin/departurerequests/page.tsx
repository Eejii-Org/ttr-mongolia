"use client";
import { supabase } from "@/utils/supabase/client";
import { ArrowRight } from "@components";
import Link from "next/link";
import { useEffect, useState } from "react";

const AdminDepartureRequests = () => {
  const [departureRequests, setDepartureRequests] = useState<
    DepartureRequestType[]
  >([]);
  useEffect(() => {
    const fetchDepartureRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("departureRequests")
          .select("*");
        if (error) {
          throw error;
        }
        setDepartureRequests(data);
      } catch (error: any) {
        console.error("Error fetching departureRequests:", error.message);
      }
    };

    fetchDepartureRequests();
  }, []);
  return (
    <div className="p-4 flex-1">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">
          Departure Requests
        </div>
      </div>
      <table className="border overflow-scroll w-full bg-white rounded-md">
        <tr>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Status
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Tour Date
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-40">
            Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Email
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Nationality
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            People Count
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
        </tr>
        {departureRequests.map(
          (
            {
              id,
              firstName,
              lastName,
              email,
              nationality,
              peopleCount,
              status,
              startingDate,
              tourId,
            },
            i
          ) => (
            <tr
              className="hover:bg-black/5 table-row hover:bg-grey/50 cursor-pointer"
              key={i}
            >
              <td className="text-left px-3 py-2 font-semibold md:text-lg">
                {status == "Approved" ? (
                  <div
                    className={`border border-green-500 bg-green-500/10 w-min px-3 py-1 text-sm rounded text-green-500`}
                  >
                    Approved
                  </div>
                ) : status == "Pending" ? (
                  <div
                    className={`border border-yellow-500 bg-yellow-500/10 w-min px-3 py-1 text-sm rounded text-yellow-500`}
                  >
                    Pending
                  </div>
                ) : (
                  <div
                    className={`border border-red-500 bg-red-500/10 w-min px-3 py-1 text-sm rounded text-red-500`}
                  >
                    Denied
                  </div>
                )}
              </td>
              <td className="px-3 py-2 font-semibold">{startingDate}</td>
              <td className="py-2 px-3 ">{firstName + " " + lastName}</td>
              <td className="px-3 py-2">{email}</td>
              <td className="px-3 py-2">{nationality}</td>
              <td className="px-3 py-2">{peopleCount}</td>
              <td className="flex justify-end max-w-12 w-12">
                <Link
                  className="font-bold rounded-full ripple p-3"
                  href={`/admin/departurerequests/${id}`}
                >
                  <ArrowRight color="black" />
                </Link>
              </td>
            </tr>
          )
        )}
      </table>
    </div>
  );
};

export default AdminDepartureRequests;
