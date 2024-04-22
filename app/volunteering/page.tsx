"use client";
import { createClient } from "@/utils/supabase/client";
import { LabelIcon, MainLayout, VolunteeringIntro } from "@components";
import Image from "next/image";
import { useEffect, useState } from "react";

const Volunteering = () => {
  const supabase = createClient();
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
    <MainLayout>
      <div className="flex-1 pt-16 md:pt-14  flex flex-col gap-12">
        <VolunteeringIntro />
        <div className="flex flex-row gap-12 items-center justify-center">
          <Image
            src="/static/eejii.png"
            width={64 * 1.2}
            height={64 * 1.2}
            className="object-contain mix-blend-luminosity"
            alt="eejii"
          />
          <Image
            src="/static/amarbayasgalanthiid.png"
            width={115 * 1.2}
            height={92 * 1.2}
            className="object-contain mix-blend-luminosity"
            alt="eejii"
          />
          <Image
            src="/static/lotuschildrenscentre.png"
            width={64 * 1.2}
            height={64 * 1.2}
            className="object-contain mix-blend-luminosity"
            alt="eejii"
          />
        </div>
        <div className="flex flex-col md:flex-row container gap-6 mx-auto just px-8 md:px-24 items-center">
          <div className="flex-1 flex-col gap-4 hidden md:flex">
            <div className="flex flex-row gap-4">
              <div className="h-72 bg-quinary flex-1 rounded-lg relative overflow-hidden">
                {pictures[0] && (
                  <Image
                    src={pictures[0]}
                    fill
                    alt="ourAgencyPicture0"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="h-72 bg-quinary flex-1 rounded-lg rounded-tr-[128px] relative overflow-hidden">
                {pictures[1] && (
                  <Image
                    src={pictures[1]}
                    fill
                    alt="ourAgencyPicture0"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row  gap-4">
              <div className="h-72 bg-quinary flex-1 rounded-lg rounded-bl-[128px] relative overflow-hidden">
                {pictures[2] && (
                  <Image
                    src={pictures[2]}
                    fill
                    alt="ourAgencyPicture2"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="h-72 bg-quinary flex-1 rounded-lg relative overflow-hidden">
                {pictures[3] && (
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
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <LabelIcon />
              <div className="text-3xl font-semibold">About</div>
            </div>
            <div className="flex flex-col text-base md:text-lg gap-2">
              <p>
                Embark on an extraordinary journey with us, forged in
                partnership with the esteemed NGO EEJII. Our project is a fusion
                of travel and altruism, offering you an immersive experience
                where you'll not only immerse yourself in the vibrant tapestry
                of nomadic culture but also actively contribute to local causes
                that matter.
              </p>
              <p>
                From lending your support at the Mazaalai Wildlife Care Center
                to sharing your knowledge with young monks through English
                lessons, and rallying behind initiatives like the "a Billion
                trees" campaign led by the Shambala 2056 team – there are
                countless ways for you to leave a lasting impact.
              </p>
              <p>
                By joining our journey, you're not just signing up for an
                adventure; you're becoming a part of something bigger. Every
                tour profit you contribute goes directly to the EEJII NGO,
                fueling their ongoing efforts to initiate projects and organize
                charity events that uplift communities in need.
              </p>
              <p>
                Join us as we embark on a transformative voyage, where every
                step you take leaves a positive footprint on the world around
                you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default Volunteering;