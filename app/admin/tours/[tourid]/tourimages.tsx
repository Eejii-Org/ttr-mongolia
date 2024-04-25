import { CloseIcon, PlusIcon } from "@components";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

export const TourImages = ({
  tour,
  originalTour,
  setTour,
}: {
  tour: TourType;
  originalTour: TourType | null;
  setTour: Dispatch<SetStateAction<TourType | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const uploadImage = async (file: File) => {
    setLoading(true);
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const fileType = file.type.split("/").pop();
    const fileName = `${uniqueId}.${fileType}`;
    const { data, error } = await supabase.storage
      .from("tourImages")
      .upload(fileName, file, {
        upsert: false,
      });
    const { data: publicData } = supabase.storage
      .from("tourImages")
      .getPublicUrl(fileName);
    if (error) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    const { error: err } = await supabase
      .from("tours")
      .update({ images: [...tour.images, publicData.publicUrl] })
      .eq("id", originalTour?.id);
    if (err) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    toast.success("Successfully Uploaded an Image");
    setTour({ ...tour, images: [...tour.images, publicData.publicUrl] });
    setImageFile(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {tour.images.map((imageUrl, index) => (
        <TourImage
          imageUrl={imageUrl}
          originalTour={originalTour}
          tour={tour}
          setTour={setTour}
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
    </div>
  );
};

const TourImage = ({
  imageUrl,
  setTour,
  originalTour,
  tour,
}: {
  imageUrl: string;
  tour: TourType;
  originalTour: TourType | null;
  setTour: Dispatch<SetStateAction<TourType | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const imageName = useMemo(() => {
    const name = imageUrl.split("/").pop();
    return name ? name : "Unidentified Image";
  }, [imageUrl]);

  const deleteImage = async () => {
    setLoading(true);
    if (!imageName) {
      toast.error("Error Deleting Image");
      setLoading(false);
      return;
    }
    const { error: err } = await supabase
      .from("tours")
      .update({ images: tour.images.filter((url) => url !== imageUrl) })
      .eq("id", originalTour?.id);
    if (err) {
      toast.error("Error Updating Tour");
      console.error(err);
      setLoading(false);
      return;
    }
    const { error } = await supabase.storage
      .from("tourImages")
      .remove([imageName]);
    if (error) {
      toast.error("Error");
      console.error(error);
      setLoading(false);
      return;
    }
    setTour({ ...tour, images: tour.images.filter((url) => url !== imageUrl) });
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
