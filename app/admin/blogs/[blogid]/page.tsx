"use client";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowLeft,
  Input,
  PlusIcon,
  ReloadIcon,
  StorageImage,
  Tiptap,
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

const Blog = () => {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [originalBlog, setOriginalBlog] = useState<BlogType | null>(null);
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { blogid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    if (isNew) {
      const newBlog = blog;
      if (imageFile) {
        const filePath = await uploadImageToS3(imageFile, "blogImages");
        if (newBlog) {
          newBlog.image = filePath;
        }
      }
      // new
      const { data, error } = await supabase
        .from("blogs")
        .insert(newBlog)
        .select();
      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      setBlog(newBlog);
      setOriginalBlog(newBlog as BlogType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      setImageFile(null);
      router.push(`/admin/blogs/${data[0].id}`);
      return;
    }

    let newBlog = blog;
    if (imageFile) {
      const filePath = await updateImageInS3(imageFile, blog?.image as string);
      if (newBlog) {
        newBlog.image = filePath;
      }
    }
    const { error } = await supabase
      .from("blogs")
      .update(newBlog)
      .eq("id", blog?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setImageFile(null);
    setOriginalBlog(newBlog);
    setBlog(newBlog);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };
  const isChanged = useMemo(() => {
    if (blog == null) return false;
    if (originalBlog == null || imageFile !== null) return true;
    return !_.isEqual(originalBlog, blog);
  }, [originalBlog, blog, imageFile]);

  const leave = async () => {
    router.push("/admin/blogs");
    return;
  };
  useEffect(() => {
    const fetchBlog = async () => {
      if (blogid == "new") {
        setBlog({
          image: null,
          title: "",
          description: "",
        });
        setOriginalBlog({
          image: null,
          title: "",
          description: "",
        });
        setIsNew(true);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", blogid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setOriginalBlog(data[0] as BlogType);
        setBlog(data[0] as BlogType);
      } catch (error: any) {
        console.error("Error fetching blogs:", error);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [blogid]);

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
          {isNotFound ? "Blog not found" : blog?.title}
        </div>
      </div>
      {blog && (
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <Detail
                blog={blog}
                imageFile={imageFile}
                setImageFile={setImageFile}
                setBlog={setBlog}
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
  blog,
  setBlog,
  imageFile,
  setImageFile,
}: {
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
  blog: BlogType;
  setBlog: Dispatch<SetStateAction<BlogType | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Blog Title:</label>
          <Input
            type="text"
            placeholder="Gobi Tour"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Description:</label>
        <Tiptap
          className="min-h-48 w-full p-2 border rounded-2xl"
          content={blog.description}
          setContent={(s) => {
            setBlog({ ...blog, description: s });
          }}
        />
      </div>
      <div>
        <label className="pl-2 font-medium">Blog Image:</label>
        <BlogImage
          blog={blog}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      </div>
    </div>
  );
};

const BlogImage = ({
  blog,
  imageFile,
  setImageFile,
}: {
  blog: BlogType;
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
}) => {
  const inputRef = useRef(null);
  const imageSrc = useMemo(() => {
    return (imageFile ? URL.createObjectURL(imageFile) : blog.image) || "";
  }, [imageFile, blog]);
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center">
        {imageSrc ? (
          <StorageImage
            noPrefix={imageFile ? true : false}
            src={imageSrc}
            fill
            alt={blog.title}
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
            {blog.image ? (
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

export default Blog;
