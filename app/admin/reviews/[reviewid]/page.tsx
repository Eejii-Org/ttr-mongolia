"use client";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, CloseIcon, Input, PlusIcon } from "@components";
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
import Image from "next/image";

const Review = () => {
  const supabase = createClient();
  const router = useRouter();
  const [review, setReview] = useState<ReviewType | null>(null);
  const [originalReview, setOriginalReview] = useState<ReviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { reviewid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    const newReview = review;
    if (isNew) {
      // new
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
    console.log(newReview);
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
    setOriginalReview({ ...originalReview, ...(newReview as ReviewType) });
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
              <Detail
                review={review}
                originalReview={originalReview}
                setReview={setReview}
              />
            </div>
            <div className="p-4 flex items-end justify-end bg-white border-t">
              <button
                disabled={!isChanged}
                className={`px-12 py-2 font-semibold hover:bg-opacity-50 ${
                  isChanged
                    ? "bg-primary text-tertiary ripple"
                    : "bg-quinary text-secondary"
                }`}
                onClick={save}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Tabs = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
}) => {
  const tabs = ["detail", "reviews"];
  return (
    <div className="flex flex-row">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`capitalize text-lg px-6 py-2 ${
            selectedTab == tab
              ? "text-secondary border-b-2 border-primary"
              : " text-[#c1c1c1]"
          }`}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const Detail = ({
  review,
  originalReview,
  setReview,
}: {
  review: ReviewType;
  originalReview: ReviewType | null;
  setReview: Dispatch<SetStateAction<ReviewType | null>>;
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
        <ReviewImages
          review={review}
          originalReview={originalReview}
          setReview={setReview}
        />
      </div>
    </div>
  );
};

const ReviewImages = ({
  review,
  originalReview,
  setReview,
}: {
  review: ReviewType;
  originalReview: ReviewType | null;
  setReview: Dispatch<SetStateAction<ReviewType | null>>;
}) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const uploadImage = async (file: File) => {
    setLoading(true);
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const fileType = file.type.split("/").pop();
    const fileName = `${uniqueId}.${fileType}`;
    const { data, error } = await supabase.storage
      .from("reviewImages")
      .upload(fileName, file, {
        upsert: false,
      });
    const { data: publicData } = supabase.storage
      .from("reviewImages")
      .getPublicUrl(fileName);
    if (error) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    const { error: err } = await supabase
      .from("reviews")
      .update({ images: [...review.images, publicData.publicUrl] })
      .eq("id", originalReview?.id);
    if (err) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    toast.success("Successfully Uploaded an Image");
    setReview({ ...review, images: [...review.images, publicData.publicUrl] });
    setImageFile(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {review?.images.map((imageUrl, index) => (
        <ReviewImage
          imageUrl={imageUrl}
          originalReview={originalReview}
          review={review}
          setReview={setReview}
          key={index}
        />
      ))}
      {imageFile && (
        <div className=" w-[300px] h-[200px] relative">
          <img
            src={URL.createObjectURL(imageFile)}
            alt={"selectedImage"}
            className="object-contain w-[300px] h-[200px]"
          />
          {loading ? (
            <div className="z-20 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/20 backdrop-blur">
              <div className="font-medium text-lg">Uploading</div>
            </div>
          ) : (
            <div className="absolute top-2 right-2">
              <button
                className="bg-white/50 rounded-full ripple p-1 backdrop-blur border"
                onClick={() => {
                  setImageFile(null);
                }}
              >
                <CloseIcon width={24} height={24} color="black" />
              </button>
            </div>
          )}
        </div>
      )}
      {review?.images.length < 3 && (
        <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center gap-1 flex-col">
          <input
            type="file"
            onChange={(e) => {
              if (!e.target.files || e.target.files?.length == 0) return;
              setImageFile(e.target.files[0]);
              uploadImage(e.target.files[0]);
            }}
            accept="image/*"
            className="w-[300px] h-[200px] absolute left-0 top-0 opacity-0"
          />

          <div className="p-2 bg-white rounded-full">
            <PlusIcon color="black" width={32} height={32} />
          </div>
          <div>Add Image</div>
        </div>
      )}
    </div>
  );
};

const ReviewImage = ({
  imageUrl,
  setReview,
  originalReview,
  review,
}: {
  imageUrl: string;
  review: ReviewType;
  originalReview: ReviewType | null;
  setReview: Dispatch<SetStateAction<ReviewType | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const imageName = useMemo(() => {
    const name = imageUrl.split("/").pop();
    return name ? name : "Unidentified Image";
  }, [imageUrl]);
  const supabase = createClient();
  const deleteImage = async () => {
    setLoading(true);
    if (!imageName) {
      toast.error("Error Deleting Image");
      setLoading(false);
      return;
    }
    const { error: err } = await supabase
      .from("reviews")
      .update({ images: review.images.filter((url) => url !== imageUrl) })
      .eq("id", originalReview?.id);
    if (err) {
      toast.error("Error Updating Review");
      console.error(err);
      setLoading(false);
      return;
    }
    const { error } = await supabase.storage
      .from("reviewImages")
      .remove([imageName]);
    if (error) {
      toast.error("Error");
      console.error(error);
      setLoading(false);
      return;
    }
    setReview({
      ...review,
      images: review.images.filter((url) => url !== imageUrl),
    });
    setLoading(false);
  };
  return (
    <div className=" w-[300px] h-[200px] relative">
      <Image src={imageUrl} fill alt={imageName} />
      {loading ? (
        <div className="z-20 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/20 backdrop-blur">
          <div className="font-medium text-lg">Deleting</div>
        </div>
      ) : (
        <div className="absolute top-2 right-2">
          <button
            className="bg-white/50 rounded-full ripple p-1 backdrop-blur border"
            onClick={deleteImage}
          >
            <CloseIcon width={24} height={24} color="black" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Review;
