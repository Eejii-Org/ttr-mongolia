"use client";
import { supabase } from "@/utils/supabase/client";
import { MainLayout, AboutIntro } from "@components";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const Volunteering = () => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const administrativeStaffs = useMemo<MemberType[]>(() => {
    return members.filter(
      (member) => member.positionType == "Administrative Staff"
    );
  }, [members]);
  const guides = useMemo<MemberType[]>(() => {
    return members.filter((member) => member.positionType == "Guide");
  }, [members]);
  const drivers = useMemo<MemberType[]>(() => {
    return members.filter((member) => member.positionType == "Driver");
  }, [members]);
  useEffect(() => {
    const getMembers = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("order", { ascending: true });
      if (error) {
        console.error(error);
        return;
      }
      setMembers(data);
    };
    getMembers();
  }, []);
  return (
    <MainLayout>
      <div className="flex-1 pt-16 md:pt-14 flex flex-col gap-12">
        <AboutIntro />
        <div className="container mx-auto flex flex-col gap-4 justify-center px-8 items-center">
          <div className="text-2xl md:text-4xl font-semibold">
            Administrative Staff
          </div>
          <div className="flex flex-row flex-wrap gap-6">
            {administrativeStaffs.map((member, index) => (
              <div
                className="w-64 flex flex-col shadow rounded-lg overflow-hidden"
                key={index}
              >
                <div className="h-64 relative">
                  <Image
                    src={member.image || ""}
                    alt={"image" + member.id}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="font-semibold text-xl">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="font-semibold text-[#6d6d6d]">
                    {member.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {guides.length !== 0 && (
          <div className="container mx-auto flex flex-col gap-4 justify-center px-8 items-center">
            <div className="text-2xl md:text-4xl font-semibold">Guides</div>
            <div className="flex flex-row flex-wrap gap-6">
              {guides.map((member, index) => (
                <div
                  className="w-64 flex flex-col shadow rounded-lg overflow-hidden"
                  key={index}
                >
                  <div className="h-64 relative">
                    <Image
                      src={member.image || ""}
                      alt={"image" + member.id}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="font-semibold text-xl">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="font-semibold text-[#6d6d6d]">
                      {member.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {drivers.length !== 0 && (
          <div className="container mx-auto flex flex-col gap-4 justify-center px-8 items-center">
            <div className="text-2xl md:text-4xl font-semibold">Drivers</div>
            <div className="flex flex-row flex-wrap gap-6">
              {drivers.map((member, index) => (
                <div
                  className="w-64 flex flex-col shadow rounded-lg overflow-hidden"
                  key={index}
                >
                  <div className="h-64 relative">
                    <Image
                      src={member.image || ""}
                      alt={"image" + member.id}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="font-semibold text-xl">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="font-semibold text-[#6d6d6d]">
                      {member.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
export default Volunteering;
