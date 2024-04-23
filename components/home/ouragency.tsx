"use client";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

export const OurAgency: FC = () => {
  const [pictures, setPictures] = useState<string[]>([]);
  useEffect(() => {
    const getPictures = async () => {
      const list = await supabase.storage.from("ourAgencyImages").list();
      if (!list.data) {
        return;
      }
      const publicUrls = list.data.map((file) => {
        return supabase.storage.from("ourAgencyImages").getPublicUrl(file.name);
      });
      const images = await Promise.all(publicUrls);
      setPictures(images.map((image) => image.data.publicUrl));
    };
    getPictures();
  }, []);

  return (
    <div className="relative mx-3 md:mx-6 flex flex-col gap-4">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 md:p-8  backdrop-blur-sm bg-white/70 rounded-3xl text-center flex flex-col gap-4 z-10"
        style={{
          maxWidth: "704px",
          width: "calc(100% - 32px)",
        }}
      >
        <div className="font-bold text-lg md:text-2xl uppercase">
          At our agency, every step you take is a step towards
          <span className="text-primary"> positive change</span>.
        </div>
        <div className="text-base md:text-xl font-medium">
          With experienced guides leading the way, immerse yourself in
          <span className="text-primary"> unforgettable experiences</span> that
          not only enrich your soul but also{" "}
          <span className="text-primary">uplift communities in need</span>. For
          every adventure you embark upon, know that{" "}
          <span className="text-primary"> 10% of our profits</span> are
          dedicated to supporting{" "}
          <span className="text-primary"> education</span>,{" "}
          <span className="text-primary">healthcare</span>, and{" "}
          <span className="text-primary">various vital fields</span>. Join us as
          we navigate towards a brighter future, where every trip taken becomes
          a <span className="text-primary">beacon of hope</span> and opportunity
          for those who need it most.
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          {pictures[0] && (
            <Image
              src={pictures[0]}
              fill
              alt="ourAgencyPicture0"
              className="object-cover"
            />
          )}
        </div>
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          {pictures[1] && (
            <Image
              src={pictures[1]}
              fill
              alt="ourAgencyPicture1"
              className="object-cover"
            />
          )}
        </div>
      </div>
      <div className="flex flex-row  gap-4">
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          {pictures[2] && (
            <Image
              src={pictures[2]}
              fill
              alt="ourAgencyPicture2"
              className="object-cover"
            />
          )}
        </div>
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          {pictures[2] && (
            <Image
              src={pictures[3]}
              fill
              alt="ourAgencyPicture3"
              className="object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};
