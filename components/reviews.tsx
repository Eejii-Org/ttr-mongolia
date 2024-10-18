"use client";
import { supabase } from "@/utils/supabase/client";
import { FC, useEffect, useMemo, useState } from "react";
import { CloseIcon, StarsIcon } from "./icons";
import StorageImage from "./storageimage";
import { ReviewType } from "@/utils";

export const Reviews: FC = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [openedImageUrl, setOpenedImageUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("date", { ascending: false });
        if (error) {
          throw error;
        }
        setReviews(data);
      } catch (error: any) {
        console.error("Error fetching reviews:", error.message);
      }
    };

    fetchReviews();
  }, []);
  const openImage = (imageUrl: string) => {
    setOpenedImageUrl(imageUrl);
  };
  const closeImage = () => {
    setOpenedImageUrl(null);
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="mx-3 md:mx-6 text-2xl md:text-4xl font-semibold">
        What our travelers say about us
      </div>
      <div className="flex flex-row gap-4 overflow-x-scroll no-scroll-bar w-full pl-3 pr-3 md:pl-6 md:pr-6">
        {reviews.map((review, index) => (
          <Review {...review} openImage={openImage} key={index} />
        ))}
      </div>
      <Modal
        open={openedImageUrl ? true : false}
        close={closeImage}
        image={openedImageUrl}
      />
    </div>
  );
};

interface ReviewItemType extends ReviewType {
  openImage: (imageUrl: string) => void;
}

export const Review: FC<ReviewItemType> = ({
  firstName,
  lastName,
  date,
  review,
  rating,
  images,
  openImage,
}) => {
  const dateText = useMemo(() => {
    const dt = new Date(date);

    return (
      dt.toLocaleString("default", { month: "long" }) +
      " " +
      dt.getDate() +
      " " +
      dt.getFullYear()
    );
  }, [date]);
  return (
    <div className="p-4 bg-quinary relative flex flex-row gap-4 review-item">
      {images.length != 0 && (
        <div className="min-w-24 flex flex-col gap-3">
          {images?.slice(0, 3)?.map((image, index) => (
            <div
              onClick={() => openImage(image)}
              className="flex flex-1 relative cursor-pointer"
              key={index}
            >
              <StorageImage
                src={image}
                alt={firstName + " " + lastName + index}
                className="object-cover"
                fill
              />
            </div>
          ))}
        </div>
      )}
      {/* <div className="absolute text-primary text-5xl top-6 left-6">"</div> */}
      <div className="flex flex-col gap-2">
        <div className="text-lg md:text-xl font-semibold">
          {firstName + " " + lastName}
        </div>
        <div className="flex flex-row">
          <div
            className={` overflow-hidden`}
            style={{
              maxWidth: 24 * rating + "px",
            }}
          >
            <StarsIcon />
          </div>
          <div
            className={`overflow-hidden`}
            style={{
              maxWidth: 24 * (5 - rating) + "px",
              WebkitTransform: "scaleX(-1)",
              transform: "scaleX(-1)",
            }}
          >
            <StarsIcon color={"#c1c1c1"} />
          </div>
        </div>
        <div className="text-base lg:text-lg text-ellipsis h-64 overflow-y-scroll">
          {review}
        </div>
        <div className="font-semibold text-[#6D6D6D] text-end">{dateText}</div>
      </div>
    </div>
  );
};

const Modal = ({
  open,
  close,
  image,
}: {
  open: boolean;
  close: () => void;
  image: string | null;
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
      <button className="absolute top-8 right-8" onClick={close}>
        <CloseIcon />
      </button>
      {image && (
        <div className="w-[calc(100vw-32px)] md:container relative h-3/4 bg-white/75">
          <StorageImage
            src={image || ""}
            className="object-contain"
            fill
            alt={"modalimage"}
          />
        </div>
      )}
    </div>
  );
};
