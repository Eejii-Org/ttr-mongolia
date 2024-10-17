"use client";

import { ChevronLeftIcon, ChevronRightIcon, StorageImage } from "@components";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IntroType } from "@/utils";

export const Intro = ({ intro }: { intro: IntroType[] }) => {
  const [index, setIndex] = useState(0);
  const carouselClick = (direction: "left" | "right") => {
    if (direction == "left") {
      setIndex((prev) => (prev == 0 ? intro?.length - 1 : prev - 1));
    } else {
      setIndex((prev) => (prev + 1 == intro?.length ? 0 : prev + 1));
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1 == intro?.length ? 0 : prev + 1));
    }, 20000);
    return () => clearInterval(interval);
  }, [index, intro?.length]);
  return (
    <div className="w-fill relative overflow-hidden flex items-center justify-center intro-section">
      <div className="z-20 gip text-white flex flex-col gap-4 text-center items-center  -mt-8">
        <div className="font-bold text-3xl md:text-4xl lg:text-7xl md:font-semibold">
          {intro?.[index]?.title}
        </div>
        <div className="font-normal text-xl text-center md:w-2/3">
          {intro?.[index]?.description}
        </div>
      </div>
      {/* <div className="absolute bottom-8 z-20 gip items-center text-white flex-col gap-1 md:left-8">
        <div className="font-light text-base">Scroll Down</div>
        <div className="ripple text-black bg-white/30 py-3 px-8 gip rounded-full cursor-pointer backdrop-blur-sm">
          <ArrowDown />
        </div>
      </div> */}
      <div className="absolute bottom-6 w-full justify-end z-20 pr-6 gip text-white gap-2 flex">
        <div className="container relative">
          <div className="absolute right-0 bottom-0 w-[152px] items-center bg-white text-black flex flex-row justify-between rounded-lg">
            <button
              className="p-3 ripple"
              onClick={() => carouselClick("left")}
            >
              <ChevronLeftIcon />
            </button>
            <div className="font-medium">
              {index + 1} / {intro?.length}
            </div>
            <button
              className="p-3 ripple"
              onClick={() => carouselClick("right")}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        {/* <div className="relative gap-6 flex flex-row items-center  p-4 rounded-t-2xl">
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
        </div> */}
      </div>
      <div
        className="absolute z-10 w-full h-full"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 25%), linear-gradient(0deg, rgba(0,0,0,0) 75%, rgba(0,0,0,0.4) 100%)",
        }}
      ></div>
      {/* <div
        key={0}
        className={`absolute w-full h-full select-none ${
          0 == index ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition: "all 400ms",
          top: 0,
        }}
      ></div> */}
      {/* <div
        className={`absolute w-full h-full select-none ${
          0 == index ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition: "all 400ms",
          top: 0,
        }}
      >
        <Image
          src={"/static/intro.webp"}
          fill
          alt={"Intro"}
          priority
          // unoptimized={true}
          className={`object-cover select-none${
            0 == index ? "introImageAnimation" : ""
          }`}
        />
      </div> */}

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
          <StorageImage
            src={item.image || ""}
            fill
            alt={item.title}
            priority
            // unoptimized={true}
            className={`object-cover select-none${
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
