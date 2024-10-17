"use client";
import { CategoryType, deleteImageInS3 } from "@/utils";
import { supabase } from "@/utils/supabase/client";
import { ArrowRight, StorageImage, TrashIcon } from "@components";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const deleteCategory = async (
    categoryId: number | undefined,
    image: string | null
  ) => {
    if (categoryId == undefined) return;
    if (image) {
      await deleteImageInS3(image);
    }
    const { error } = await supabase
      .from("tourCategories")
      .delete()
      .eq("id", categoryId);
    if (error) {
      toast.error("Error While Deleting");
      console.error(error);
      return;
    }
    const { data: toursToUpdate, error: err } = await supabase
      .from("tours")
      .select("*")
      .contains("categories", [categoryId]);

    if (err) {
      toast.error("Error While Updating");
      console.error(err);
      return;
    }
    for (const tour of toursToUpdate) {
      const updatedCategories = tour.categories.filter(
        (id: number) => id !== categoryId
      );
      const { error: er } = await supabase
        .from("tours")
        .update({ categories: updatedCategories })
        .eq("id", tour.id);
      if (er) {
        toast.error("Error While Updating");
        console.error(er);
        return;
      }
    }

    setCategories([...categories.filter(({ id }) => id !== categoryId)]);
    toast.success("Successfully Deleted");
  };
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const { data, error } = await supabase
          .from("tourCategories")
          .select("*");
        if (error) {
          throw error;
        }
        setCategories(data);
      } catch (error: any) {
        console.error("Error fetching tour intro:", error.message);
      }
    };

    fetchIntro();
  }, []);
  return (
    <div className="p-4 flex-1">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">Category</div>
        <Link
          href={"/admin/categories/new"}
          className="cursor-pointer ripple bg-primary px-4 py-2 flex-row text-tertiary  rounded hidden md:flex"
        >
          Add Category
        </Link>
      </div>
      <table className="border overflow-scroll w-full bg-white rounded-md">
        <tr>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-[300px]">
            Image
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-80">
            Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
        </tr>
        {categories.map(({ name, image, id }, i) => (
          <tr
            className="hover:bg-black/5 table-row hover:bg-grey/50 cursor-pointer"
            key={i}
          >
            <td className="max-w-12 w-12">
              <button
                className="font-bold rounded-full ripple p-3"
                onClick={() => deleteCategory(id, image)}
              >
                <TrashIcon />
              </button>
            </td>
            <td className="py-2 px-3 font-semibold w-[300px]">
              <div
                className={`w-[256px] h-[128px] relative bg-quinary flex items-center justify-center`}
              >
                {image ? (
                  <StorageImage src={image} fill alt={name + i} />
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
                  href={`/admin/categories/${id}`}
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

export default AdminCategories;
