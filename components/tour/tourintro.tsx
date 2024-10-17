"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import StorageImage from "../storageimage";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { CategoryType, TourType } from "@/utils";

export const TourIntro = ({
  tour,
  categories,
}: {
  tour: TourType;
  categories: CategoryType[];
}) => {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const images = useMemo<string[]>(() => {
    if (!tour || tour?.images?.length == 0) return [];
    return tour?.images;
  }, [tour]);
  const onLeft = () => {
    if (index == 0) return;
    const scrollP =
      window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 3;
    setIndex(index - 1);
    scrollRef.current?.scroll({
      left: scrollRef.current.scrollLeft - scrollP,
      behavior: "smooth",
    });
  };
  const onRight = () => {
    if (index == images.length - 3) return;
    const scrollP =
      window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 3;
    setIndex(index + 1);
    scrollRef.current?.scroll({
      left: scrollRef.current.scrollLeft + scrollP,
      behavior: "smooth",
    });
  };
  // useEffect(() => {
  //   scrollRef.current?.scroll({
  //     left: 16 + (window.innerWidth - 32) / 3,
  //   });
  // }, []);
  return (
    <div className="w-fill mt-0 relative overflow-hidden flex items-center justify-center intro-section">
      <button
        className={`absolute top-1/2 -translate-y-1/2 left-2 bg-black/20 z-40 rounded-full backdrop-blur-sm p-2 transition-all ${
          index == 0 ? "opacity-50 bg-white/20 cursor-default" : "flex"
        }`}
        onClick={onLeft}
      >
        <ChevronLeftIcon color="white" />
      </button>
      <button
        className={`absolute top-1/2 -translate-y-1/2 right-2 bg-black/10 z-40 rounded-full backdrop-blur-sm p-2 transition-all ${
          index == images.length - 3
            ? "opacity-50 bg-white/20 cursor-default"
            : "flex"
        }`}
        onClick={onRight}
      >
        <ChevronRightIcon color="white" />
      </button>
      <div className="z-30 gip text-white flex flex-col gap-4 text-center items-center justify-center">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-7xl md:font-semibold">
          {tour?.title}
        </h1>
        <div className=" w-16 h-1 bg-white/40 rounded" />
        <div className="font-medium text-base md:text-lg text-center flex flex-row items-center justify-center gap-3 bg-black/25 px-3 py-1 rounded-full">
          {/* <div className="text-xl">{tour.reviews.length} Reviews</div> */}
          <div className="flex flex-row items-center justify-center gap-3">
            {categories.map((category, index) => (
              <div
                className="flex flex-row items-center justify-center gap-3"
                key={index}
              >
                {index != 0 && (
                  <div className="w-[calc(2px)] h-4 bg-white rounded" />
                )}
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="absolute w-full h-full flex flex-row overflow-x-scroll select-none snap-x snap-mandatory no-scroll-bar"
        ref={scrollRef}
      >
        {images?.map((image, i) => (
          <div
            key={i}
            className={`relative min-w-[100vw] md:min-w-[calc(100vw/3)]  h-full select-none snap-end`}
          >
            <StorageImage
              src={image}
              fill
              alt={image + i}
              priority
              // unoptimized={true}
              className={`object-cover select-none ${
                i == (index + 1) % images.length ? "introImageAnimation" : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
