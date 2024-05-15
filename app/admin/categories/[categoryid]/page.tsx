"use client";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowLeft,
  Input,
  PlusIcon,
  ReloadIcon,
  StorageImage,
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
import { updateImageInS3, uploadImageToS3 } from "@/utils";

const Category = () => {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [originalCategory, setOriginalCategory] = useState<CategoryType | null>(
    null
  );
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { categoryid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    if (isNew) {
      const newCategory = category;
      if (imageFile) {
        const filePath = await uploadImageToS3(imageFile, "images");
        if (newCategory) {
          newCategory.image = filePath;
        }
      }
      // new
      const { data, error } = await supabase
        .from("tourCategories")
        .insert(newCategory)
        .select();
      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      setCategory(newCategory);
      setOriginalCategory(newCategory as CategoryType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      setImageFile(null);
      router.push(`/admin/categories/${data[0].id}`);
      return;
    }

    let newCategory = category;
    if (imageFile) {
      const filePath = await updateImageInS3(
        imageFile,
        category?.image as string
      );
      if (newCategory) {
        newCategory.image = filePath;
      }
    }
    const { error } = await supabase
      .from("tourCategories")
      .update(newCategory)
      .eq("id", category?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setImageFile(null);
    setOriginalCategory(newCategory);
    setCategory(newCategory);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };
  const isChanged = useMemo(() => {
    if (category == null) return false;
    if (originalCategory == null || imageFile !== null) return true;
    return !_.isEqual(originalCategory, category);
  }, [originalCategory, category, imageFile]);

  const leave = async () => {
    router.push("/admin/categories");
    return;
  };
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryid == "new") {
        setCategory({
          image: null,
          name: "",
        });
        setOriginalCategory({
          image: null,
          name: "",
        });
        setIsNew(true);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("tourCategories")
          .select("*")
          .eq("id", categoryid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setOriginalCategory(data[0] as CategoryType);
        setCategory(data[0] as CategoryType);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
      setLoading(false);
    };
    fetchCategory();
  }, [categoryid]);

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
          {isNotFound ? "Tour not found" : category?.name}
        </div>
      </div>
      {category && (
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <Detail
                category={category}
                imageFile={imageFile}
                setImageFile={setImageFile}
                setCategory={setCategory}
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
  category,
  setCategory,
  imageFile,
  setImageFile,
}: {
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
  category: CategoryType;
  setCategory: Dispatch<SetStateAction<CategoryType | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Category Name:</label>
          <Input
            type="text"
            placeholder="Gobi Tour"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="pl-2 font-medium">Images:</label>
        <CategoryImage
          category={category}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      </div>
    </div>
  );
};

const CategoryImage = ({
  category,
  imageFile,
  setImageFile,
}: {
  category: CategoryType;
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
}) => {
  const inputRef = useRef(null);
  const imageSrc = useMemo(() => {
    return imageFile ? URL.createObjectURL(imageFile) : category.image || "";
  }, [imageFile, category]);
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center">
        {imageSrc ? (
          <StorageImage
            noPrefix={imageFile ? true : false}
            src={imageSrc}
            fill
            alt={category.name}
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
            {category.image ? (
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

export default Category;
