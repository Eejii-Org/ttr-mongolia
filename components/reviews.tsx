import { createClient } from "@/utils/supabase/client";
import { FC, useEffect, useMemo, useState } from "react";
import { StarsIcon } from "./icons";
import Image from "next/image";

export const Reviews: FC = () => {
  const supabase = createClient();
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("date", { ascending: true })
          .limit(5);
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
  return (
    <div className="flex flex-col gap-6">
      <div className="mx-3 md:mx-6 text-2xl md:text-4xl font-semibold">
        What our travelers say about us
      </div>
      <div className="flex flex-row gap-4 overflow-x-scroll no-scroll-bar w-full pl-3 pr-3 md:pl-6 md:pr-6">
        {reviews.map((review, index) => (
          <Review {...review} key={index} />
        ))}
      </div>
    </div>
  );
};
export const Review: FC<ReviewType> = ({
  firstName,
  lastName,
  date,
  review,
  rating,
  images,
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
          {images.map((image, index) => (
            <div className="flex flex-1 relative" key={index}>
              <Image
                src={image}
                alt={firstName + " " + lastName + index}
                objectFit="cover"
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
        <div className="text-base lg:text-lg text-ellipsis h-64 overflow-scroll">
          {review}
        </div>
        <div className="font-semibold text-[#6D6D6D] text-end">{dateText}</div>
      </div>
    </div>
  );
};
