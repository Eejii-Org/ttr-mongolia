"use client";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowLeft,
  CaretDownIcon,
  CaretUpIcon,
  ChevronDownIcon,
  CloseIcon,
  DayIcon,
  Input,
  MinusIcon,
  NightIcon,
  PlusIcon,
  PriceIcon,
  ReloadIcon,
} from "@components";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  FC,
  LegacyRef,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import Image from "next/image";

const Category = () => {
  const supabase = createClient();
  const router = useRouter();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [originalCategory, setOriginalCategory] = useState<CategoryType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { categoryid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    const newCategory = category;
    if (isNew) {
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
      setOriginalCategory(newCategory as CategoryType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      router.push(`/admin/categories/${data[0].id}`);
      return;
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
    setOriginalCategory({
      ...originalCategory,
      ...(newCategory as CategoryType),
    });
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };
  const isChanged = useMemo(() => {
    if (category == null) return false;
    if (originalCategory == null) return true;
    return !_.isEqual(originalCategory, category);
  }, [originalCategory, category]);
  const leave = async () => {
    const imageName = category?.image?.split("/").pop();
    if (!imageName) {
      router.push("/admin/categories");
      return;
    }
    const { data, error } = await supabase.storage
      .from("images")
      .remove([imageName]);
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
                originalCategory={originalCategory}
                setCategory={setCategory}
              />
            </div>
            <div className="p-4 flex items-end justify-end bg-white border-t">
              <button
                disabled={!isChanged}
                className={`px-12 py-2 font-semibold rounded-xl hover:bg-opacity-50 ${
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

const Detail = ({
  category,
  originalCategory,
  setCategory,
}: {
  category: CategoryType;
  originalCategory: CategoryType | null;
  setCategory: Dispatch<SetStateAction<CategoryType | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Cateogory Name:</label>
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
          originalCategory={originalCategory}
          setCategory={setCategory}
        />
      </div>
    </div>
  );
};

const CategoryImage = ({
  category,
  originalCategory,
  setCategory,
}: {
  category: CategoryType;
  originalCategory: CategoryType | null;
  setCategory: Dispatch<SetStateAction<CategoryType | null>>;
}) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef(null);
  const imageName = useMemo(() => {
    const name = category.image?.split("/").pop();
    return name ? name : null;
  }, [category]);
  const uploadImage = async (file: File) => {
    setLoading(true);
    if (imageName) {
      const { data, error } = await supabase.storage
        .from("images")
        .remove([imageName]);
      if (error) {
        toast.error("Error Updating Image");
        console.error(error);
        setLoading(false);
        return;
      }
    }
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const fileType = file.type.split("/").pop();
    const fileName = `${uniqueId}.${fileType}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        upsert: false,
        cacheControl: "300",
      });
    const { data: publicData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);
    if (error) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    // if (originalIntro == null) {
    //   const { error: err } = await supabase
    //     .from("intro")
    //     .insert({ ...intro, image: publicData.publicUrl })
    //   console.log(publicData.publicUrl, err);
    //   if (err) {
    //     toast.error("Error Updating ImageUrl after Uploading");
    //     console.error(error);
    //     setLoading(false);
    //     return;
    //   }
    //   toast.success("Successfully Uploaded an Image");
    // } else {
    //   const { error: err } = await supabase
    //     .from("intro")
    //     .update({ image: publicData.publicUrl })
    //     .eq("id", originalIntro?.id);
    //   console.log(publicData.publicUrl, err);
    //   if (err) {
    //     toast.error("Error Updating ImageUrl after Uploading");
    //     console.error(error);
    //     setLoading(false);
    //     return;
    //   }

    // }
    toast.success("Successfully Uploaded an Image");
    setCategory({ ...category, image: publicData.publicUrl });
    setImageFile(null);
    setLoading(false);
  };
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <div className=" w-[300px] h-[200px] relative">
        <Image
          src={
            imageFile ? URL.createObjectURL(imageFile) : category.image || ""
          }
          fill
          alt={category.name}
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
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          if (!e.target.files || e.target.files?.length == 0) return;
          setImageFile(e.target.files[0]);
          uploadImage(e.target.files[0]);
        }}
        accept="image/*"
        className="w-[0px] h-[0px] absolute left-0 top-0 opacity-0"
      />

      {/* <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center gap-1 flex-col">
        
        <div className="p-2 bg-white rounded-full">
          <PlusIcon color="black" width={32} height={32} />
        </div>
        <div>Add Image</div>
      </div> */}
    </div>
  );
};

export default Category;
