import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export const TourIntro = ({ tour }: { tour: TourType }) => {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const images = useMemo<string[]>(() => {
    if (!tour || tour?.images?.length == 0) return [];

    // scrollRef.current?.sc( );
    return tour?.images;
  }, [tour]);
  useEffect(() => {
    scrollRef.current?.scroll({
      left: 16 + (window.innerWidth - 32) / 3,
    });
  }, []);
  return (
    <>
      <div className="w-fill mt-0 relative overflow-hidden flex items-center justify-center h-80 md:h-[calc(512px)]">
        <div className="z-30 gip text-white flex flex-col gap-4 text-center items-center justify-center">
          <div className="font-bold text-2xl md:text-3xl lg:text-7xl md:font-semibold">
            {tour?.title}
          </div>
          <div className=" w-16 h-1 bg-white/40 rounded" />
          <div className="font-medium text-base md:text-lg text-center flex flex-row items-center justify-center gap-3 bg-black/25 px-3 py-1 rounded-full">
            <div className="text-xl">{tour.reviews.length} Reviews</div>
            <div className="flex flex-row items-center justify-center gap-3">
              {tour.categories.map((category, index) => (
                <div
                  className="flex flex-row items-center justify-center gap-3"
                  key={index}
                >
                  <div className="w-[calc(2px)] h-4 bg-white rounded" />
                  <div>{category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {images?.map((image, i) => (
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
      <div
        className="flex flex-row gap-4 overflow-x-scroll snap-x overflow-y-hidden snap-mandatory no-scroll-bar"
        ref={scrollRef}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          target.scrollWidth;
          setIndex(
            Math.round(target.scrollLeft / ((window.innerWidth - 32) / 3 + 16))
          );
        }}
        // ref={scrollRef}
      >
        <div
          className={`min-w-[calc((100vw-32px)/3)] h-24 md:h-48 relative snap-end transition-all overflow-hidden`}
        ></div>
        {images?.map((image, i) => (
          <div
            key={i}
            className={`min-w-[calc((100vw-32px)/3)] h-24 md:h-48 relative snap-end transition-all overflow-hidden rounded`}
          >
            <div
              className={`bg-black/30 w-full h-full absolute top-0 left-0 z-10 ${
                i == index ? "hidden" : "flex"
              }`}
            ></div>
            <Image
              src={image}
              fill
              alt={image}
              priority
              // unoptimized={true}
              className={`object-cover select-none ${
                i == index ? "introImageAnimation" : "mix-blend-luminosity"
              }`}
            />
          </div>
        ))}
        <div
          className={`min-w-[calc((100vw-32px)/3)] h-24 md:h-48 relative snap-end transition-all overflow-hidden`}
        ></div>
      </div>
    </>
  );
};
