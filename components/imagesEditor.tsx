import { useMemo } from "react";
import { CloseIcon, PlusIcon } from "./icons";
import StorageImage from "./storageimage";

export const ImagesEditor = ({
  images,
  setImages,
}: {
  images: (string | Blob)[];
  setImages: (images: (string | Blob)[]) => void;
}) => {
  const deleteImage = (index: number) => {
    if (images.length <= index || index < 0) {
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {images.map((image: string | Blob, index: number) => (
        <ImageItem
          image={image}
          index={index}
          deleteImage={() => deleteImage(index)}
          key={"imageItem" + index}
        />
      ))}
      <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center gap-1 flex-col">
        <input
          type="file"
          onChange={(e) => {
            if (!e.target.files || e.target.files?.length == 0) return;
            setImages([...images, e.target.files[0]]);
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

const ImageItem = ({
  image,
  index,
  deleteImage,
}: {
  image: string | Blob;
  index: number;
  deleteImage: () => void;
}) => {
  const isImage = useMemo(() => {
    return typeof image === "string" || image instanceof String;
  }, [image]);
  const imageSrc = useMemo(() => {
    return isImage ? (image as string) : URL.createObjectURL(image as Blob);
  }, [isImage, image]);
  return (
    <div className=" w-[300px] h-[200px] relative">
      <StorageImage
        noPrefix={!isImage}
        src={imageSrc}
        fill
        alt={index + "reviewImage"}
      />
      <div className="absolute top-2 right-2">
        <button
          className="bg-white/50 rounded-full ripple p-1 backdrop-blur border"
          onClick={deleteImage}
        >
          <CloseIcon width={24} height={24} color="black" />
        </button>
      </div>
    </div>
  );
};
