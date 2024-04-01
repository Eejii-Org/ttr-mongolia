import { createClient } from "@/utils/supabase/client";
import { FC, useEffect, useState } from "react";

export const Reviews: FC = () => {
  const supabase = createClient();
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase.from("reviews").select("*");
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
      <div className="mx-3 md:mx-6 text-3xl md:text-5xl font-semibold">
        What our travelers say about us
      </div>
      <div className="flex flex-row gap-4 overflow-x-scroll w-full pl-3 md:pl-6">
        {reviews.map((review, index) => (
          <Review {...review} key={index} />
        ))}
      </div>
    </div>
  );
};
export const Review: FC<ReviewType> = ({ firstName, lastName, review }) => {
  return (
    <div className="p-8 pt-16 bg-quinary relative flex flex-col gap-4 rounded-3xl review-item">
      <div className="absolute text-primary text-5xl top-6 left-6">"</div>
      <div className="text-base md:text-lg text-ellipsis h-64 overflow-scroll">
        {review}
      </div>
      <div className="text-lg md:text-xl font-semibold">
        {firstName + " " + lastName}
      </div>
    </div>
  );
};
