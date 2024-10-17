"use client";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowLeft,
  CloseIcon,
  ImagesEditor,
  Input,
  PlusIcon,
} from "@components";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { deleteImagesInS3, ReviewType, uploadImagesToS3 } from "@/utils";

type ModifiedReviewType = Omit<ReviewType, "images"> & {
  images: (Blob | string)[];
};

const Review = () => {
  const router = useRouter();
  const [review, setReview] = useState<ModifiedReviewType | null>(null);
  const [originalReview, setOriginalReview] = useState<ReviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { reviewid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const save = async () => {
    setSaveLoading(true);
    let newReview = review;
    if (isNew) {
      // new
      const paths = await uploadImagesToS3(
        review?.images as Blob[],
        "reviewImages"
      );
      if (newReview) {
        newReview.images = paths as string[];
      }
      const { data, error } = await supabase
        .from("reviews")
        .insert(newReview)
        .select();
      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      setOriginalReview(newReview as ReviewType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      router.push(`/admin/reviews/${data[0].id}`);
      return;
    }
    const uploadablePictures = review?.images.filter((image) =>
      typeof image === "string" || image instanceof String ? false : true
    );
    const deletedPictures = originalReview?.images.filter(
      (image) => !review?.images.includes(image)
    );
    if (deletedPictures && deletedPictures.length > 0) {
      await deleteImagesInS3(deletedPictures);
    }
    const paths = await uploadImagesToS3(
      uploadablePictures as Blob[],
      "reviewImages"
    );
    let newImages = [];
    if (review?.images) {
      for (let i = 0, j = 0; i < review?.images.length; i++) {
        if (
          typeof review.images[i] === "string" ||
          review.images[i] instanceof String
        ) {
          newImages.push(review.images[i]);
        } else {
          if (paths?.[j]) {
            newImages.push(paths[j]);
            j++;
          }
        }
      }
    }
    if (newReview) {
      newReview.images = newImages;
    }
    const { error } = await supabase
      .from("reviews")
      .update(newReview)
      .eq("id", originalReview?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setReview(newReview);
    setOriginalReview(newReview as ReviewType);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };
  const isChanged = useMemo(() => {
    if (review == null) return false;
    if (originalReview == null) return true;
    return !_.isEqual(originalReview, review);
  }, [originalReview, review]);

  useEffect(() => {
    const fetchReview = async () => {
      if (reviewid == "new") {
        setReview({
          firstName: "",
          lastName: "",
          date: "",
          review: "",
          rating: 5,
          images: [],
        });
        setOriginalReview({
          firstName: "",
          lastName: "",
          date: "",
          review: "",
          rating: 5,
          images: [],
        });
        setIsNew(true);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("id", reviewid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setOriginalReview(data[0] as ReviewType);
        setReview(data[0] as ReviewType);
      } catch (error: any) {
        console.error("Error fetching reviews:", error.message);
      }
      setLoading(false);
    };
    fetchReview();
  }, [reviewid]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/admin/reviews"
          className="flex p-2 ripple rounded-full bg-tertiary border"
        >
          <ArrowLeft color="black" />
        </Link>
        <div className="text-2xl md:text-4xl font-semibold">
          {isNotFound ? "Review not found" : "Review"}
        </div>
      </div>
      {review && (
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <Detail review={review} setReview={setReview} />
            </div>
            <div className="p-4 flex items-end justify-end bg-white border-t">
              <button
                disabled={!isChanged || saveLoading}
                className={`px-12 py-2 font-semibold rounded-xl hover:bg-opacity-50 ${
                  saveLoading
                    ? "bg-quinary text-secondary"
                    : isChanged
                    ? "bg-primary text-tertiary ripple"
                    : "bg-quinary text-secondary"
                }`}
                onClick={save}
              >
                {saveLoading ? "Loading" : "Save"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Detail = ({
  review,
  setReview,
}: {
  review: ModifiedReviewType;
  setReview: Dispatch<SetStateAction<ModifiedReviewType | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">FirstName:</label>
          <Input
            type="text"
            placeholder="John"
            value={review.firstName}
            onChange={(e) =>
              setReview({ ...review, firstName: e.target.value })
            }
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">LastName:</label>
          <Input
            type="text"
            placeholder="Doe"
            value={review.lastName}
            onChange={(e) => setReview({ ...review, lastName: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-row gap-8">
        <div className="min-w-20">
          <label className="pl-2 font-medium">Rating:</label>
          <Input
            type="number"
            placeholder="5"
            min={0}
            max={5}
            value={review.rating}
            onChange={(e) =>
              setReview({ ...review, rating: Number(e.target.value) })
            }
          />
        </div>
        <div className="max-w-80">
          <label className="pl-2 font-medium">Review Date:</label>
          <Input
            type="date"
            placeholder="Review Date"
            value={review.date}
            onChange={(e) => setReview({ ...review, date: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Review:</label>
        <textarea
          placeholder="Overview"
          className=" min-h-48 w-full p-4 border"
          value={review.review}
          onChange={(e) => {
            setReview({ ...review, review: e.target.value });
          }}
        ></textarea>
      </div>
      <div>
        <label className="pl-2 font-medium">Images:</label>
        <ImagesEditor
          images={review.images}
          setImages={(newImages) => setReview({ ...review, images: newImages })}
        />
      </div>
    </div>
  );
};

export default Review;
