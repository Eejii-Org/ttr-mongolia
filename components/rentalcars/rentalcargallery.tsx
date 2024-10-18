"use client";
import { RentalCarType } from "@/utils";
import StorageImage from "../storageimage";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "../icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const RentalCarGallery = ({
  rentalCar,
}: {
  rentalCar: RentalCarType;
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<null | number>(
    null
  );
  return (
    <div className="flex items-center flex-col gap-8">
      <div className="text-xl md:text-2xl font-semibold">Gallery</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {rentalCar.otherImages.map((otherImage, index) => (
          <div
            className="aspect-video relative cursor-pointer"
            onClick={() => {
              setSelectedImageIndex(index);
            }}
            key={"galleryImage" + index}
          >
            <StorageImage
              src={otherImage}
              alt={"otherImage" + index}
              className="bg-quaternary object-contain"
              fill
            />
          </div>
        ))}
      </div>
      <Modal
        open={selectedImageIndex != null}
        close={() => setSelectedImageIndex(null)}
        images={rentalCar.otherImages}
        index={selectedImageIndex}
        setIndex={setSelectedImageIndex}
      />
    </div>
  );
};

const Modal = ({
  open,
  index,
  close,
  setIndex,
  images,
}: {
  open: boolean;
  close: () => void;
  index: number | null;
  setIndex: Dispatch<SetStateAction<number | null>>;
  images: string[];
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.cssText = `overflow: hidden`;
    } else {
      document.body.style.cssText = `overflow: auto`;
    }
  }, [open]);
  return (
    <div
      className={`fixed z-50 top-0 bottom-0 w-screen h-screen overflow-hidden backdrop-blur-sm bg-black/50 items-center justify-center ${
        open ? "flex" : "hidden"
      }`}
    >
      <button
        className={`absolute top-1/2 -translate-y-1/2 left-2 bg-black/20 z-40 rounded-full backdrop-blur-sm p-2 transition-all ${
          index == 0 ? "opacity-50 bg-white/20 cursor-default" : "flex"
        }`}
        onClick={() => {
          if (index != 0 && index != null) {
            setIndex(index - 1);
          }
        }}
      >
        <ChevronLeftIcon color="white" />
      </button>
      <button
        className={`absolute top-1/2 -translate-y-1/2 right-2 bg-black/10 z-40 rounded-full backdrop-blur-sm p-2 transition-all ${
          index == images.length - 1
            ? "opacity-50 bg-white/20 cursor-default"
            : "flex"
        }`}
        onClick={() => {
          if (index != images.length - 1 && index != null) {
            setIndex(index + 1);
          }
        }}
      >
        <ChevronRightIcon color="white" />
      </button>
      <button className="absolute top-8 right-8" onClick={close}>
        <CloseIcon />
      </button>
      {index != null && (
        <div className="w-[calc(100vw-32px)] md:container relative h-3/4 bg-white/75">
          <StorageImage
            src={images[index]}
            className="object-contain"
            fill
            alt={"modalimage"}
          />
        </div>
      )}
    </div>
  );
};
