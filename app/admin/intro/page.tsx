"use client";
import { deleteImageInS3, IntroType } from "@/utils";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowRight,
  CaretDownIcon,
  CaretUpIcon,
  TrashIcon,
  StorageImage,
} from "@components";
import _ from "lodash";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const AdminIntro = () => {
  const [intro, setIntro] = useState<IntroType[]>([]);
  const [newIntro, setNewIntro] = useState<IntroType[]>([]);
  const isSame = useMemo(() => {
    return _.isEqual(intro, newIntro);
  }, [newIntro, intro]);
  const deleteIntro = async (
    introId: number | undefined,
    image: string | null
  ) => {
    if (introId == undefined) return;
    if (image) {
      await deleteImageInS3(image);
    }
    const { error } = await supabase.from("intro").delete().eq("id", introId);
    if (error) {
      toast.error("Error While Deleting");
      console.error(error);
      return;
    }
    setNewIntro([...intro.filter(({ id }) => id !== introId)]);
    setIntro([...intro.filter(({ id }) => id !== introId)]);
    toast.success("Successfully Deleted");
  };
  const moveList = (index: number, direction: "up" | "down") => {
    let list = [...newIntro];
    if (direction == "up") {
      if (index == 0) return;
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      setNewIntro([...list]);
      return;
    }
    if (index == newIntro?.length - 1) return;
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    setNewIntro([...list]);
  };
  const orderSave = async () => {
    const differentIntros: {
      id: number;
      order: number;
    }[] = [];
    newIntro.forEach((introItem, index) => {
      if (!_.isEqual(introItem, intro[index])) {
        differentIntros.push({ id: introItem.id || 0, order: index });
      }
    });

    const { data, error } = await supabase
      .from("intro")
      .upsert([...differentIntros]);
    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
    setIntro([...newIntro]);
    toast.success("Successfully updated order");
  };

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const { data, error } = await supabase
          .from("intro")
          .select("*")
          .order("order", { ascending: true });
        if (error) {
          throw error;
        }
        setNewIntro(data);
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
          className="cursor-pointer ripple bg-primary px-4 py-2 flex-row text-tertiary  rounded hidden md:flex"
        >
          Add Intro
        </Link>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => orderSave()}
          className={`cursor-pointer ripple  px-8 py-2 flex-row text-lg rounded hidden md:flex ${
            isSame
              ? "bg-quaternary cursor-default"
              : "bg-primary text-tertiary pointer"
          }`}
          disabled={isSame}
        >
          Save
        </button>
      </div>
      <table className="border overflow-scroll w-full bg-white rounded-md">
        <tr>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
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
        {newIntro.map(({ title, description, image, status, id }, i) => (
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
            <td className="max-w-12 w-12">
              <button
                className={`${i == 0 ? "opacity-50" : "ripple"}`}
                disabled={i == 0}
                onClick={() => moveList(i, "up")}
              >
                <CaretUpIcon color="black" />
              </button>
              <button
                className={`${
                  i == intro?.length - 1 ? "opacity-50" : "ripple"
                }`}
                onClick={() => moveList(i, "down")}
              >
                <CaretDownIcon color="black" />
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
                <StorageImage src={image ? image : ""} fill alt={title + i} />
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
