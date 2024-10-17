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
import { MemberType, updateImageInS3, uploadImageToS3 } from "@/utils";

const Member = () => {
  const router = useRouter();
  const [member, setMember] = useState<MemberType | null>(null);
  const [originalMember, setOriginalMember] = useState<MemberType | null>(null);
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { memberid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    if (isNew) {
      // new
      const newMember = member;
      if (imageFile) {
        const filePath = await uploadImageToS3(imageFile, "memberImages");
        if (newMember) {
          newMember.image = filePath;
        }
      }
      const { data, error } = await supabase
        .from("members")
        .insert({ ...newMember })
        .select();

      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }

      setMember(data[0] as MemberType);
      setOriginalMember(data[0] as MemberType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      setImageFile(null);
      router.push(`/admin/members/${data[0].id}`);
      return;
    }
    let newMember = member;
    if (imageFile) {
      const filePath = await updateImageInS3(
        imageFile,
        member?.image as string
      );
      if (newMember) {
        newMember.image = filePath;
      }
    }
    const { error } = await supabase
      .from("members")
      .update(newMember)
      .eq("id", originalMember?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setImageFile(null);
    setOriginalMember(newMember);
    setMember(newMember);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };

  const isChanged = useMemo(() => {
    if (member == null) return false;
    if (originalMember == null || imageFile !== null) return true;
    return !_.isEqual(originalMember, member);
  }, [originalMember, member, imageFile]);

  const leave = async () => {
    router.push("/admin/members");
    return;
  };

  useEffect(() => {
    const fetchMember = async () => {
      if (memberid == "new") {
        setMember({
          order: 0,
          image: null,
          firstName: "",
          lastName: "",
          position: "",
          positionType: "Administrative Staff",
        });
        setOriginalMember({
          order: 0,
          image: null,
          firstName: "",
          lastName: "",
          position: "",
          positionType: "Administrative Staff",
        });
        setIsNew(true);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("id", memberid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setOriginalMember(data[0] as MemberType);
        setMember(data[0] as MemberType);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
      setLoading(false);
    };
    fetchMember();
  }, [memberid]);

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
          {isNotFound
            ? "Tour not found"
            : member?.firstName + " " + member?.lastName}
        </div>
      </div>
      {member && (
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <Detail
                member={member}
                setMember={setMember}
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
  member,
  setMember,
  imageFile,
  setImageFile,
}: {
  member: MemberType;
  setMember: Dispatch<SetStateAction<MemberType | null>>;
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">FirstName:</label>
          <Input
            type="text"
            placeholder="FirstName"
            value={member.firstName}
            onChange={(e) =>
              setMember({ ...member, firstName: e.target.value })
            }
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">LastName:</label>
          <Input
            type="text"
            placeholder="LastName"
            value={member.lastName}
            onChange={(e) => setMember({ ...member, lastName: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Position:</label>
          <Input
            type="text"
            placeholder="Position"
            value={member.position}
            onChange={(e) => setMember({ ...member, position: e.target.value })}
          />
        </div>
        <div className="min-w-80 flex flex-col">
          <label className="pl-2 font-medium">PositionType:</label>
          <select
            value={member.positionType}
            onChange={(e) =>
              setMember({ ...member, positionType: e.target.value })
            }
            className="px-4 h-[50px] border bg-tertiary rounded"
          >
            <option value="Administrative Staff">Administrative Staff</option>
            <option value="Guide">Guide</option>
            <option value="Driver">Driver</option>
          </select>
        </div>
      </div>
      <div>
        <label className="pl-2 font-medium">Images:</label>
        <MemberImage
          member={member}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      </div>
    </div>
  );
};

const MemberImage = ({
  member,
  imageFile,
  setImageFile,
}: {
  member: MemberType;
  imageFile: Blob | null;
  setImageFile: Dispatch<SetStateAction<Blob | null>>;
}) => {
  const inputRef = useRef(null);
  const imageSrc = useMemo(() => {
    return imageFile ? URL.createObjectURL(imageFile) : member.image || "";
  }, [imageFile, member]);
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center">
        {imageSrc ? (
          <StorageImage
            noPrefix={imageFile ? true : false}
            src={imageSrc}
            fill
            alt={member.position + member.id}
            className="object-contain"
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
            {member.image ? (
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
        }}
        accept="image/*"
        className="w-[0px] h-[0px] absolute left-0 top-0 opacity-0"
      />
    </div>
  );
};

export default Member;
