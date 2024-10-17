"use client";
import { deleteImageInS3 } from "@/utils";
import { supabase } from "@/utils/supabase/client";
import { RentalCarType } from "@/utils/types";
import { ArrowRight, StorageImage, TrashIcon } from "@components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminRentalCars = () => {
  const [rentalCars, setRentalCars] = useState<RentalCarType[]>([]);
  const deleteRentalCar = async (
    carId: number | undefined,
    image: string | null
  ) => {
    if (carId == undefined) return;
    if (image) {
      await deleteImageInS3(image);
    }
    const { error } = await supabase
      .from("rentalCars")
      .delete()
      .eq("id", carId);
    if (error) {
      toast.error("Error While Deleting");
      console.error(error);
      return;
    }

    setRentalCars([...rentalCars.filter(({ id }) => id !== carId)]);
    toast.success("Successfully Deleted");
  };
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const { data, error } = await supabase.from("rentalCars").select("*");
        if (error) {
          throw error;
        }
        setRentalCars(data);
      } catch (error: any) {
        console.error("Error fetching rentalCars:", error.message);
      }
    };

    fetchIntro();
  }, []);
  return (
    <div className="p-4 flex-1">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">Rental Cars</div>
        <Link
          href={"/admin/rentalcars/new"}
          className="cursor-pointer ripple bg-primary px-4 py-2 flex-row text-tertiary  rounded hidden md:flex"
        >
          Add Car
        </Link>
      </div>
      <table className="border overflow-scroll w-full bg-white rounded-md">
        <tr>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-[300px]">
            Main Image
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-80">
            Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
        </tr>
        {rentalCars.map(({ name, mainImage, id }, i) => (
          <tr
            className="hover:bg-black/5 table-row hover:bg-grey/50 cursor-pointer"
            key={i}
          >
            <td className="max-w-12 w-12">
              <button
                className="font-bold rounded-full ripple p-3"
                onClick={() => deleteRentalCar(id, mainImage)}
              >
                <TrashIcon />
              </button>
            </td>
            <td className="py-2 px-3 font-semibold w-[300px]">
              <div
                className={`w-[256px] h-[128px] relative bg-quinary flex items-center justify-center`}
              >
                {mainImage ? (
                  <StorageImage src={mainImage} fill alt={name + i} />
                ) : (
                  "No Image"
                )}
              </div>
            </td>
            <td className="py-2 px-3 font-semibold w-80">{name}</td>
            <td className="max-w-12 w-12 h-full">
              <div className="flex items-center justify-center">
                <Link
                  className="font-bold rounded-full ripple p-3"
                  href={`/admin/rentalcars/${id}`}
                >
                  <ArrowRight color="black" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default AdminRentalCars;
