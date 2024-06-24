"use client";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { ArrowRight, StarsIcon, TrashIcon } from "@components";
import Link from "next/link";
import { toast } from "react-toastify";
import { deleteImagesInS3, toDateText } from "@/utils";

const AdminReviews = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const deleteReview = async (reviewId?: number, images?: string[]) => {
    if (reviewId == undefined) return;
    if (images) await deleteImagesInS3(images);
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);
    if (error) {
      toast.error("Error While Deleting");
      console.error(error);
      return;
    }
    setReviews([...reviews.filter(({ id }) => id !== reviewId)]);
    toast.success("Successfully Deleted");
  };
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("reviews").select("*");
        if (error) {
          throw error;
        }
        setReviews(data);
      } catch (error: any) {
        console.error("Error fetching reviews:", error.message);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4">
        <div className="flex flex-row justify-between pb-4">
          <div className="text-2xl md:text-4xl font-semibold">Reviews</div>
          <Link
            href={"/admin/reviews/new"}
            className="cursor-pointer ripple bg-primary px-4 py-2 flex-row text-tertiary  rounded hidden md:flex"
          >
            Add Review
          </Link>
        </div>
        <table className="border overflow-scroll w-full bg-white rounded-md">
          <tr>
            <th className="max-w-12 w-12 border-b"></th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Name
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Date
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Rating
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
              Review
            </th>
            <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
          </tr>
          {reviews.map((review, i) => (
            <tr className="hover:bg-black/5 table-row" key={i}>
              <td className="max-w-12 w-12">
                <button
                  className="font-bold rounded-full ripple p-3"
                  onClick={() => deleteReview(review.id, review.images)}
                >
                  <TrashIcon />
                </button>
              </td>
              <td className="py-2 px-3 font-semibold ">
                {review.firstName + " " + review.lastName}
              </td>
              <td className="px-3 py-2">{toDateText(review.date)}</td>
              <td className="px-3 py-2">
                <div className="flex flex-row">
                  <div
                    className={` overflow-hidden`}
                    style={{
                      maxWidth: 24 * review.rating + "px",
                    }}
                  >
                    <StarsIcon />
                  </div>
                  <div
                    className={`overflow-hidden`}
                    style={{
                      maxWidth: 24 * (5 - review.rating) + "px",
                      WebkitTransform: "scaleX(-1)",
                      transform: "scaleX(-1)",
                    }}
                  >
                    <StarsIcon color={"#c1c1c1"} />
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-ellipsis max-w-64 overflow-hidden">
                {review.review}
              </td>
              <td className="flex justify-end max-w-12 w-12">
                <Link
                  className="font-bold rounded-full ripple p-3"
                  href={`/admin/reviews/${review.id}`}
                >
                  <ArrowRight color="black" />
                </Link>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};
export default AdminReviews;
