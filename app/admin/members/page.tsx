"use client";
import { deleteImageInS3, MemberType } from "@/utils";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowRight,
  CaretDownIcon,
  CaretUpIcon,
  StorageImage,
  TrashIcon,
} from "@components";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const AdminMembers = () => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [newMembers, setNewMembers] = useState<MemberType[]>([]);
  const isSame = useMemo(() => {
    return _.isEqual(members, newMembers);
  }, [newMembers, members]);
  const deleteMember = async (
    memberId: number | undefined,
    image: string | null
  ) => {
    if (memberId == undefined) return;
    if (image) {
      await deleteImageInS3(image);
    }
    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", memberId);
    if (error) {
      toast.error("Error While Deleting");
      console.error(error);
      return;
    }
    setNewMembers([...members.filter(({ id }) => id !== memberId)]);
    setMembers([...members.filter(({ id }) => id !== memberId)]);
    toast.success("Successfully Deleted");
  };
  const moveList = (index: number, direction: "up" | "down") => {
    let list = [...newMembers];
    if (direction == "up") {
      if (index == 0) return;
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      setNewMembers([...list]);
      return;
    }
    if (index == newMembers.length - 1) return;
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    setNewMembers([...list]);
  };
  const orderSave = async () => {
    const differentMembers: {
      id: number;
      order: number;
    }[] = [];
    newMembers.forEach((memberItem, index) => {
      if (!_.isEqual(memberItem, members[index])) {
        differentMembers.push({ id: memberItem.id || 0, order: index });
      }
    });

    const { data, error } = await supabase
      .from("members")
      .upsert([...differentMembers]);
    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
    setMembers([...newMembers]);
    toast.success("Successfully updated order");
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .order("order", { ascending: true });
        if (error) {
          throw error;
        }
        setNewMembers(data);
        setMembers(data);
      } catch (error: any) {
        console.error("Error fetching members:", error.message);
      }
    };

    fetchMembers();
  }, []);
  return (
    <div className="p-4 flex-1">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">Members</div>
        <Link
          href={"/admin/members/new"}
          className="cursor-pointer ripple bg-primary px-4 py-2 flex-row text-tertiary  rounded hidden md:flex"
        >
          Add Member
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
          {/* <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-20">
            Status
          </th> */}
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-[300px]">
            Image
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-80">
            Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Position
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Position Type
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
        </tr>
        {newMembers.map(
          ({ firstName, lastName, image, position, positionType, id }, i) => (
            <tr
              className="hover:bg-black/5 table-row hover:bg-grey/50 cursor-pointer"
              key={i}
            >
              <td className="max-w-12 w-12">
                <button
                  className="font-bold rounded-full ripple p-3"
                  onClick={() => deleteMember(id, image)}
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
                    i == members.length - 1 ? "opacity-50" : "ripple"
                  }`}
                  onClick={() => moveList(i, "down")}
                >
                  <CaretDownIcon color="black" />
                </button>
              </td>
              {/* <td className="text-left px-3 py-2 font-semibold md:text-lg w-20">
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
              </td> */}
              <td className="py-2 px-3 font-semibold w-[300px]">
                <div className="w-[256px] h-[128px] relative">
                  <StorageImage
                    src={image ? image : ""}
                    fill
                    alt={firstName + i}
                    className="object-contain bg-quinary"
                  />
                </div>
              </td>
              <td className="py-2 px-3 font-semibold w-80">
                {firstName} {lastName}
              </td>
              <td className="px-3 py-2">{position}</td>
              <td className="px-3 py-2">{positionType}</td>
              <td className="max-w-12 w-12">
                <div className="flex items-center justify-center">
                  <Link
                    className="font-bold rounded-full ripple p-3 max-w-12 max-h-12"
                    href={`/admin/members/${id}`}
                  >
                    <ArrowRight color="black" />
                  </Link>
                </div>
              </td>
            </tr>
          )
        )}
      </table>
    </div>
  );
};

export default AdminMembers;
