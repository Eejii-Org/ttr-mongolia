"use client";
import { ArrowCircleIcon, ArrowDown, ScrollCorner } from "@components";
import Image from "next/image";
import { useEffect, useState } from "react";
export const Intro = () => {
  const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
  const data = [
    {
      src: "#" + randomColor(),
      title: "Unveil Nature's Wonders",
      description:
        "Discover the breathtaking beauty of Mongolia's vast steppe under the radiant daylight ",
    },
    {
      src: "#" + randomColor(),
      title: "Explore the sights of Mongolia",
      description: "Untamed landscapes. Lose yourself under a million stars.",
    },
    {
      src: "#" + randomColor(),
      title: "Unveil Nature's Wonders",
      description:
        "Discover the breathtaking beauty of Mongolia's vast steppe under the radiant daylight ",
    },
    {
      src: "#" + randomColor(),
      title: "Explore the sights of Mongolia",
      description: "Untamed landscapes. Lose yourself under a million stars.",
    },
    {
      src: "#" + randomColor(),
      title: "Journey into the Sands",
      description: "Embark on an unforgettable adventure across desert dunes.",
    },
  ];
  const [index, setIndex] = useState(0);
  const carouselClick = (direction: "left" | "right") => {
    if (direction == "left") {
      setIndex((prev) => (prev == 0 ? data.length - 1 : prev - 1));
    } else {
      setIndex((prev) => (prev + 1 == data.length ? 0 : prev + 1));
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1 == data.length ? 0 : prev + 1));
    }, 20000);
    return () => clearInterval(interval);
  }, [index, data.length]);
  return (
    <div
      className="w-fill m-3 md:m-4 mt-0 relative rounded-3xl overflow-hidden flex items-center justify-center intro-section"
      style={{
        height: "calc(80vh - 73px - 16px)",
      }}
    >
      <div className="z-40 gip text-white flex flex-col gap-4 text-center items-center  -mt-8">
        <div className="font-bold text-3xl md:text-4xl lg:text-7xl md:font-semibold">
          {data[index].title}
        </div>
        <div className="font-normal text-xl text-center md:w-2/3">
          {data[index].description}
        </div>
        {/* <div className="ripple bg-white text-black py-3 px-8 gip rounded-full mt-6 cursor-pointer font-semibold">
          Book Now
        </div> */}
      </div>
      <div className="absolute bottom-8 z-50 gip items-center text-white flex-col gap-1 md:left-8">
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
              hover={false}
              direction="left"
              color="black"
              filled
            />
          </div>
          <div className="flex fles-row gap-3">
            {data.map((_, ind) => (
              <div
                className={`rounded-full  ${
                  ind == index ? "w-6 h-3 bg-primary" : "w-3 h-3 bg-gray-300"
                }`}
                style={{
                  transition: "all 200ms",
                }}
              ></div>
            ))}
          </div>
          <div
            className="ripple cursor-pointer rounded-full"
            onClick={() => carouselClick("right")}
          >
            <ArrowCircleIcon
              hover={false}
              direction="right"
              color="black"
              filled
            />
          </div>
        </div>
      </div>
      {data.map((item, i) => (
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
          <div
            className="object-cover w-full h-full"
            style={{
              background: item.src,
            }}
          ></div>
          {/* <Image
            src={item.src}
            fill
            alt="Mongolia Image"
            // priority
            // unoptimized={true}
            className={`object-cover select-none ${
              i == index ? "introImageAnimation" : ""
            }`}
          /> */}
        </div>
      ))}
    </div>
  );
};
