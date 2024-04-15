"use client";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, TrashIcon } from "@components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminIntro = () => {
  // const [intro, setIntro] = useState<IntroType[]>([]);
  const supabase = createClient();
  const router = useRouter();
  const [intro, setIntro] = useState<IntroType[]>([]);
  const deleteIntro = async (
    introId: number | undefined,
    image: string | null
  ) => {
    if (introId == undefined) return;
    const { error } = await supabase.from("intro").delete().eq("id", introId);
    if (error) {
      toast.error("Error While Deleting");
      console.error(error);
      return;
    }
    if (image) {
      const name = image?.split("/").pop();
      if (name) {
        const { error: err } = await supabase.storage
          .from("introImages")
          .remove([name]);
        if (err) {
          toast.error("Error While Deleting");
          console.error(err);
          return;
        }
      }
    }
    setIntro([...intro.filter(({ id }) => id !== introId)]);
    toast.success("Successfully Deleted");
  };
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const { data, error } = await supabase.from("intro").select("*");
        if (error) {
          throw error;
        }
        setIntro(data);
      } catch (error: any) {
        console.error("Error fetching tour intro:", error.message);
      }
    };

    fetchIntro();
  }, []);
  return (
    <div className="p-4 flex-1">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">Intro</div>
        <Link
          href={"/admin/intro/new"}
          className="cursor-pointer ripple bg-primary px-4 py-2 flex-row text-tertiary  rounded-xl hidden md:flex"
        >
          Add Intro
        </Link>
      </div>
      <table className="border overflow-scroll w-full bg-white rounded-md">
        <tr>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-20">
            Status
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-[300px]">
            Image
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-80">
            Title
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Description
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
        </tr>
        {intro.map(({ title, description, image, status, id }, i) => (
          <tr
            className="hover:bg-black/5 table-row hover:bg-grey/50 cursor-pointer"
            key={i}
          >
            <td className="max-w-12 w-12">
              <button
                className="font-bold rounded-full ripple p-3"
                onClick={() => deleteIntro(id, image)}
              >
                <TrashIcon />
              </button>
            </td>
            <td className="text-left px-3 py-2 font-semibold md:text-lg w-20">
              {status == "active" ? (
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
            <td className="py-2 px-3 font-semibold w-[300px]">
              <div className="w-[256px] h-[128px] relative">
                <Image src={image ? image : ""} fill alt={title + i} />
              </div>
            </td>
            <td className="py-2 px-3 font-semibold w-80">{title}</td>
            <td className="px-3 py-2">{description}</td>
            <td className="max-w-12 w-12">
              <div className="flex items-center justify-center">
                <Link
                  className="font-bold rounded-full ripple p-3 max-w-12 max-h-12"
                  href={`/admin/intro/${id}`}
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

export default AdminIntro;
