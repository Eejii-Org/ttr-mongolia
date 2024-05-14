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
import { updateImage, uploadImage } from "@/utils";

const Intro = () => {
  const router = useRouter();
  const [intro, setIntro] = useState<IntroType | null>(null);
  const [originalIntro, setOriginalIntro] = useState<IntroType | null>(null);
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { introid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    if (isNew) {
      const newIntro = intro;
      if (imageFile) {
        const filePath = await uploadImage(imageFile, "introImages");
        if (newIntro) {
          newIntro.image = filePath;
        }
      }
      const { data, error } = await supabase
        .from("intro")
        .insert({ ...newIntro })
        .select();

      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      setIntro(newIntro);
      setOriginalIntro(newIntro as IntroType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      setImageFile(null);
      router.push(`/admin/intro/${data[0].id}`);
      return;
    }
    let newIntro = intro;
    if (imageFile) {
      const filePath = await updateImage(imageFile, intro?.image as string);
      if (newIntro) {
        newIntro.image = filePath;
      }
    }
    const { data, error } = await supabase
      .from("intro")
      .update(newIntro)
      .eq("id", originalIntro?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setImageFile(null);
    setOriginalIntro(data);
    setIntro(data);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };
  const isChanged = useMemo(() => {
    if (intro == null) return false;
    if (originalIntro == null || imageFile !== null) return true;
    return !_.isEqual(originalIntro, intro);
  }, [originalIntro, intro, imageFile]);

  const leave = async () => {
    router.push("/admin/intro");
    return;
  };

  useEffect(() => {
    const fetchIntro = async () => {
      if (introid == "new") {
        setIntro({
          image: null,
          title: "",
          description: "",
          status: "active",
          order: 0,
        });
        setOriginalIntro({
          image: null,
          title: "",
          description: "",
          status: "active",
          order: 0,
        });
        setIsNew(true);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("intro")
          .select("*")
          .eq("id", introid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setOriginalIntro(data[0] as IntroType);
        setIntro(data[0] as IntroType);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
      setLoading(false);
    };
    fetchIntro();
  }, [introid]);

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
          {isNotFound ? "Tour not found" : intro?.title}
        </div>
      </div>
      {intro && (
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <Detail
                intro={intro}
                originalIntro={originalIntro}
                setIntro={setIntro}
                imageFile={imageFile}
                setImageFile={setImageFile}
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
  intro,
  originalIntro,
  setIntro,
  imageFile,
  setImageFile,
}: {
  intro: IntroType;
  originalIntro: IntroType | null;
  setIntro: Dispatch<SetStateAction<IntroType | null>>;
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Intro Title:</label>
          <Input
            type="text"
            placeholder="Gobi Tour"
            value={intro.title}
            onChange={(e) => setIntro({ ...intro, title: e.target.value })}
          />
        </div>
        <div className="max-w-80 flex flex-col">
          <label className="pl-2 font-medium">Status:</label>
          <select
            value={intro.status}
            className="px-4 py-3 border bg-tertiary rounded-xl"
            onChange={(e) =>
              setIntro({
                ...intro,
                status: e.target.value == "active" ? "active" : "inactive",
              })
            }
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Description:</label>
        <textarea
          placeholder="Overview"
          className=" min-h-48 w-full p-4 border rounded-xl"
          value={intro.description}
          onChange={(e) => {
            setIntro({ ...intro, description: e.target.value });
          }}
        ></textarea>
      </div>
      <div>
        <label className="pl-2 font-medium">Images:</label>
        <IntroImages
          intro={intro}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      </div>
    </div>
  );
};

const IntroImages = ({
  intro,
  imageFile,
  setImageFile,
}: {
  intro: IntroType;
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
}) => {
  const inputRef = useRef(null);
  const imageSrc = useMemo(() => {
    return imageFile ? URL.createObjectURL(imageFile) : intro.image || "";
  }, [imageFile, intro]);
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <div className=" w-[300px] h-[200px] relative">
        <StorageImage
          noPrefix={imageFile ? true : false}
          src={imageSrc}
          fill
          alt={intro.title}
        />
        <div className="absolute top-2 right-2">
          <button
            className="bg-white/50 rounded-full ripple p-1 backdrop-blur border"
            onClick={() => {
              if (inputRef.current) {
                (inputRef.current as HTMLElement).click();
              }
            }}
          >
            {intro.image ? (
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

      {/* <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center gap-1 flex-col">
        
        <div className="p-2 bg-white rounded-full">
          <PlusIcon color="black" width={32} height={32} />
        </div>
        <div>Add Image</div>
      </div> */}
    </div>
  );
};

export default Intro;
