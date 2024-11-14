"use client";
import { supabase } from "@/utils/supabase/client";
import {
  ACIcon,
  ArrowLeft,
  EngineIcon,
  ImagesEditor,
  Input,
  PersonIcon,
  PlusIcon,
  PriceIcon,
  ReloadIcon,
  StorageImage,
  Tiptap,
  TransmissionIcon,
} from "@components";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  deleteImagesInS3,
  updateImageInS3,
  uploadImagesToS3,
  uploadImageToS3,
} from "@/utils";
import { RentalCarType } from "@/utils/types";

type ModifiedRentalCarType = Omit<RentalCarType, "otherImages"> & {
  otherImages: (Blob | string)[];
};

const RentalCar = () => {
  const router = useRouter();
  const [rentalCar, setRentalCar] = useState<ModifiedRentalCarType | null>(
    null
  );
  const [originalRentalCar, setOriginalRentalCar] =
    useState<RentalCarType | null>(null);
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { rentalcarid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    if (isNew) {
      const newRentalCar = rentalCar;
      const pathsForImages = await uploadImagesToS3(
        rentalCar?.otherImages as Blob[],
        "rentalCarImages"
      );
      if (newRentalCar) {
        newRentalCar.otherImages = pathsForImages as string[];
      }
      if (imageFile) {
        const filePath = await uploadImageToS3(imageFile, "rentalCarImages");
        if (newRentalCar) {
          newRentalCar.mainImage = filePath;
        }
      }
      const paths = await uploadImagesToS3(
        rentalCar?.otherImages as Blob[],
        "rentalCarImages"
      );
      if (newRentalCar) {
        newRentalCar.otherImages = paths as string[];
      }
      // new
      const { data, error } = await supabase
        .from("rentalCars")
        .insert(newRentalCar)
        .select();
      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      setRentalCar(newRentalCar);
      setOriginalRentalCar(newRentalCar as RentalCarType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      setImageFile(null);
      router.push(`/admin/rentalCars/${data[0].id}`);
      return;
    }

    let newRentalCar = rentalCar;

    if (imageFile) {
      const filePath = await updateImageInS3(
        imageFile,
        "rentalCarImages"
      );

      if (newRentalCar) {
        newRentalCar.mainImage = filePath;
      }
    }
    const uploadablePictures =
      rentalCar?.otherImages?.filter((image) =>
        typeof image === "string" || image instanceof String ? false : true
      ) || [];
    const deletedPictures =
      originalRentalCar?.otherImages?.filter(
        (image) => !rentalCar?.otherImages.includes(image)
      ) || [];
    if (deletedPictures && deletedPictures.length > 0) {
      await deleteImagesInS3(deletedPictures);
    }

    const paths = await uploadImagesToS3(
      uploadablePictures as Blob[],
      "rentalCarImages"
    );
    let newImages = [];
    if (rentalCar?.otherImages) {
      for (let i = 0, j = 0; i < rentalCar?.otherImages.length; i++) {
        if (
          typeof rentalCar.otherImages[i] === "string" ||
          rentalCar.otherImages[i] instanceof String
        ) {
          newImages.push(rentalCar.otherImages[i]);
        } else {
          if (paths?.[j]) {
            newImages.push(paths[j]);
            j++;
          }
        }
      }
    }
    if (newRentalCar) {
      newRentalCar.otherImages = newImages;
    }
    const { error } = await supabase
      .from("rentalCars")
      .update(newRentalCar)
      .eq("id", rentalCar?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setImageFile(null);
    setOriginalRentalCar(newRentalCar as RentalCarType);
    setRentalCar(newRentalCar);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };

  const isChanged = useMemo(() => {
    if (rentalCar == null) return false;
    if (originalRentalCar == null || imageFile !== null) return true;
    return !_.isEqual(originalRentalCar, rentalCar);
  }, [originalRentalCar, rentalCar, imageFile]);

  const leave = async () => {
    router.push("/admin/rentalcars");
    return;
  };

  useEffect(() => {
    const fetchRentalCar = async () => {
      if (rentalcarid == "new") {
        setRentalCar({
          name: "",
          subDescription: "",
          description: "",
          mainImage: "",
          otherImages: [],
          status: "active",
          carDetail: {
            numberOfSeats: "",
            transmission: "",
            engine: "",
            ac: "",
            pricePerDay: "",
          },
        });
        setOriginalRentalCar({
          name: "",
          subDescription: "",
          description: "",
          mainImage: "",
          otherImages: [],
          status: "active",
          carDetail: {
            numberOfSeats: "",
            transmission: "",
            engine: "",
            ac: "",
            pricePerDay: "",
          },
        });
        setIsNew(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("rentalCars")
          .select("*")
          .eq("id", rentalcarid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setOriginalRentalCar(data[0] as RentalCarType);
        setRentalCar(data[0] as RentalCarType);
      } catch (error: any) {
        console.error("Error fetching rentalCar:", error);
      }
      setLoading(false);
    };
    fetchRentalCar();
  }, [rentalcarid]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <div className="flex flex-row items-center gap-4">
        <button
          onClick={leave}
          className="flex p-2 ripple rounded-full bg-tertiary border"
        >
          <ArrowLeft color="black" />
        </button>
        <div className="text-2xl md:text-4xl font-semibold">
          {isNotFound ? "Rental car not found" : rentalCar?.name}
        </div>
      </div>
      {rentalCar && (
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <Detail
                rentalCar={rentalCar}
                imageFile={imageFile}
                setImageFile={setImageFile}
                setRentalCar={setRentalCar}
              />
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
  rentalCar,
  setRentalCar,
  imageFile,
  setImageFile,
}: {
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
  rentalCar: ModifiedRentalCarType;
  setRentalCar: Dispatch<SetStateAction<ModifiedRentalCarType | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Rental Car Name:</label>
          <Input
            type="text"
            placeholder="Land 200"
            value={rentalCar.name}
            onChange={(e) =>
              setRentalCar({ ...rentalCar, name: e.target.value })
            }
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">
            Rental Car Sub Description:
          </label>
          <Input
            type="text"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
            value={rentalCar.subDescription}
            onChange={(e) =>
              setRentalCar({ ...rentalCar, subDescription: e.target.value })
            }
          />
        </div>
        <div className="max-w-80 flex flex-col">
          <label className="pl-2 font-medium">Status:</label>
          <select
            value={rentalCar.status}
            className="px-4 py-3 border bg-tertiary rounded-xl"
            onChange={(e) =>
              setRentalCar({
                ...rentalCar,
                status: e.target.value == "active" ? "active" : "inactive",
              })
            }
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
      </div>

      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Price Per Day:</label>
          <Input
            type="text"
            placeholder="$200"
            icon={<PriceIcon />}
            value={rentalCar.carDetail.pricePerDay}
            onChange={(e) =>
              setRentalCar({
                ...rentalCar,
                carDetail: {
                  ...rentalCar.carDetail,
                  pricePerDay: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">Number Of Seats:</label>
          <Input
            type="text"
            placeholder="4"
            icon={<PersonIcon />}
            value={rentalCar.carDetail.numberOfSeats}
            onChange={(e) =>
              setRentalCar({
                ...rentalCar,
                carDetail: {
                  ...rentalCar.carDetail,
                  numberOfSeats: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      {/* 
    transmission: string;
    engine: string;
    ac: string; */}
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Transmission:</label>
          <Input
            type="text"
            placeholder="Automatic"
            icon={<TransmissionIcon />}
            value={rentalCar.carDetail.transmission}
            onChange={(e) =>
              setRentalCar({
                ...rentalCar,
                carDetail: {
                  ...rentalCar.carDetail,
                  transmission: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">Engine:</label>
          <Input
            type="text"
            placeholder="Petrol"
            icon={<EngineIcon />}
            value={rentalCar.carDetail.engine}
            onChange={(e) =>
              setRentalCar({
                ...rentalCar,
                carDetail: {
                  ...rentalCar.carDetail,
                  engine: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">A/C:</label>
          <Input
            type="text"
            placeholder="Yes"
            icon={<ACIcon />}
            value={rentalCar.carDetail.ac}
            onChange={(e) =>
              setRentalCar({
                ...rentalCar,
                carDetail: {
                  ...rentalCar.carDetail,
                  ac: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Description:</label>
        <Tiptap
          className="min-h-48 w-full p-2 border rounded-2xl"
          content={rentalCar.description}
          setContent={(s) => {
            setRentalCar({ ...rentalCar, description: s });
          }}
        />
      </div>
      <div>
        <label className="pl-2 font-medium">Rental Car Main Image:</label>
        <RentalCarImage
          rentalCar={rentalCar}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      </div>
      <div>
        <label className="pl-2 font-medium">Other Images:</label>
        <ImagesEditor
          images={rentalCar.otherImages}
          setImages={(newImages) =>
            setRentalCar({ ...rentalCar, otherImages: newImages })
          }
        />
      </div>
    </div>
  );
};

const RentalCarImage = ({
  rentalCar,
  imageFile,
  setImageFile,
}: {
  rentalCar: ModifiedRentalCarType;
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
}) => {
  const inputRef = useRef(null);
  const imageSrc = useMemo(() => {
    return (
      (imageFile ? URL.createObjectURL(imageFile) : rentalCar.mainImage) || ""
    );
  }, [imageFile, rentalCar]);
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center">
        {imageSrc ? (
          <StorageImage
            noPrefix={imageFile ? true : false}
            src={imageSrc}
            fill
            alt={rentalCar.name}
          />
        ) : (
          "No Image"
        )}

        <div className="absolute top-2 right-2">
          <button
            className="bg-white/50 rounded-full ripple p-1 backdrop-blur border"
            onClick={() => {
              if (inputRef.current) {
                (inputRef.current as HTMLElement).click();
              }
            }}
          >
            {rentalCar.name ? (
              <ReloadIcon width={24} height={24} color="black" />
            ) : (
              <PlusIcon width={24} height={24} color="black" />
            )}
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          if (!e.target.files || e.target.files?.length == 0) return;
          setImageFile(e.target.files[0]);
          // uploadImage(e.target.files[0]);
        }}
        accept="image/*"
        className="w-[0px] h-[0px] absolute left-0 top-0 opacity-0"
      />
    </div>
  );
};

export default RentalCar;
