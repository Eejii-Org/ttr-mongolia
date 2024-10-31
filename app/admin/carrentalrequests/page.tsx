"use client";
import { CarRentalRequestType } from "@/utils";
import { supabase } from "@/utils/supabase/client";
import { ArrowRight } from "@components";
import Link from "next/link";
import { useEffect, useState } from "react";

const AdminDepartureRequests = () => {
  const [carRentalRequests, setCarRentalRequests] = useState<CarRentalRequestType[]>([]);
  useEffect(() => {
    const fetchCarRentalRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("carRentalRequests")
          .select("*");
        if (error) {
          throw error;
        }

        console.log("fetchCarRentalRequests: ")
        console.log(data)
        setCarRentalRequests(data);
      } catch (error: any) {
        console.error("Error fetching carRentalRequests:", error.message);
      }
    };

    fetchCarRentalRequests();
  }, []);
  return (
    <div className="p-4 flex-1">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">
          Car Rental Requests
        </div>
      </div>
      <table className="border overflow-scroll w-full bg-white rounded-md">
        <tr>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Status
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Start-End Date
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-40">
            Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Email
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Phone
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Vehicle Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            With Driver
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
        </tr>
        {carRentalRequests.map(
          (
            {
              id,
              firstName,
              lastName,
              email,
              phoneNumber,
              startDate,
              endDate,
              rentalCarName,
              withDriver,
              status
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
              <td className="px-3 py-2 font-semibold">{startDate} - {endDate}</td>
              <td className="py-2 px-3 ">{firstName + " " + lastName}</td>
              <td className="px-3 py-2">{email}</td>
              <td className="px-3 py-2">{phoneNumber}</td>
              <td className="px-3 py-2">{rentalCarName}</td>
              <td className="px-3 py-2">{withDriver ? 'YES' : 'NO'}</td>
              <td className="flex justify-end max-w-12 w-12">
                <Link
                  className="font-bold rounded-full ripple p-3"
                  href={`/admin/carrentalrequests/${id}`}
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
