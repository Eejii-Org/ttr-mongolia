"use client";
import { createClient } from "@/utils/supabase/client";
import { ArrowCircleIcon, ArrowDown, ScrollCorner } from "@components";
import Image from "next/image";
import { useEffect, useState } from "react";
export const Intro = () => {
  const supabase = createClient();
  const [intro, setIntro] = useState<IntroType[]>([]);
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const { data, error } = await supabase
          .from("intro")
          .select("*")
          .eq("status", "active");
        if (error) {
          throw error;
        }
        setIntro(data);
      } catch (error: any) {
        console.error("Error fetching intro:", error.message);
      }
    };

    fetchIntro();
  }, []);

  const [index, setIndex] = useState(0);
  const carouselClick = (direction: "left" | "right") => {
    if (direction == "left") {
      setIndex((prev) => (prev == 0 ? intro.length - 1 : prev - 1));
    } else {
      setIndex((prev) => (prev + 1 == intro.length ? 0 : prev + 1));
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1 == intro?.length ? 0 : prev + 1));
    }, 20000);
    return () => clearInterval(interval);
  }, [index, intro?.length]);
  return (
    <div
      className="w-fill relative overflow-hidden flex items-center justify-center intro-section"
      style={{
        height: "calc(80vh - 73px)",
      }}
    >
      <div className="z-20 gip text-white flex flex-col gap-4 text-center items-center  -mt-8">
        <div className="font-bold text-3xl md:text-4xl lg:text-7xl md:font-semibold">
          {intro?.[index]?.title}
        </div>
        <div className="font-normal text-xl text-center md:w-2/3">
          {intro?.[index]?.description}
        </div>
      </div>
      <div className="absolute bottom-8 z-20 gip items-center text-white flex-col gap-1 md:left-8">
        <div className="font-light text-base">Scroll Down</div>
        <div className="ripple text-black bg-white/30 py-3 px-8 gip rounded-full cursor-pointer backdrop-blur-sm">
          <ArrowDown />
        </div>
      </div>
      <div className="absolute bottom-0 w-full justify-center z-10 gip hidden text-white gap-2 md:flex">
        <div className="relative gap-6 flex flex-row items-center bg-white p-4 rounded-t-2xl">
          <div className="absolute bottom-0 -left-4">
            <ScrollCorner side="left" />
          </div>
          <div className="absolute bottom-0 -right-4">
            <ScrollCorner side="right" />
          </div>
          <div
            className="ripple cursor-pointer rounded-full"
            onClick={() => carouselClick("left")}
          >
            <ArrowCircleIcon
              hover="false"
              direction="left"
              color="black"
              filled="true"
            />
          </div>
          <div className="flex fles-row gap-3">
            {intro?.map((_, ind) => (
              <div
                className={`rounded-full  ${
                  ind == index ? "w-6 h-3 bg-primary" : "w-3 h-3 bg-gray-300"
                }`}
                style={{
                  transition: "all 200ms",
                }}
                key={ind}
              ></div>
            ))}
          </div>
          <div
            className="ripple cursor-pointer rounded-full"
            onClick={() => carouselClick("right")}
          >
            <ArrowCircleIcon
              hover="false"
              direction="right"
              color="black"
              filled="true"
            />
          </div>
        </div>
      </div>
      {intro?.map((item, i) => (
        <div
          key={i}
          className={`absolute w-full h-full select-none ${
            i == index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transition: "all 400ms",
            top: 0,
          }}
        >
          <Image
            src={item.image || ""}
            fill
            alt={item.title}
            priority
            // unoptimized={true}
            className={`object-cover select-none ${
              i == index ? "introImageAnimation" : ""
            }`}
          />
        </div>
      ))}
    </div>
  );
};

// console.log(intro);
// const data = [
//   {
//     src: "#" + randomColor(),
//     title: "Unveil Nature's Wonders",
//     description:
//       "Discover the breathtaking beauty of Mongolia's vast steppe under the radiant daylight ",
//   },
//   {
//     src: "#" + randomColor(),
//     title: "Explore the sights of Mongolia",
//     description: "Untamed landscapes. Lose yourself under a million stars.",
//   },
//   {
//     src: "#" + randomColor(),
//     title: "Unveil Nature's Wonders",
//     description:
//       "Discover the breathtaking beauty of Mongolia's vast steppe under the radiant daylight ",
//   },
//   {
//     src: "#" + randomColor(),
//     title: "Explore the sights of Mongolia",
//     description: "Untamed landscapes. Lose yourself under a million stars.",
//   },
//   {
//     src: "#" + randomColor(),
//     title: "Journey into the Sands",
//     description: "Embark on an unforgettable adventure across desert dunes.",
//   },
// ];
