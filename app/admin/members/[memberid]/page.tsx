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

const Member = () => {
  const supabase = createClient();
  const router = useRouter();
  const [member, setMember] = useState<MemberType | null>(null);
  const [originalMember, setOriginalMember] = useState<MemberType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { memberid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    const newMember = member;
    if (isNew) {
      // new
      const { data, error } = await supabase
        .from("members")
        .insert(newMember)
        .select();
      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      setOriginalMember(newMember as MemberType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      router.push(`/admin/members/${data[0].id}`);
      return;
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
    setOriginalMember({ ...originalMember, ...(newMember as MemberType) });
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };
  const isChanged = useMemo(() => {
    if (member == null) return false;
    if (originalMember == null) return true;
    return !_.isEqual(originalMember, member);
  }, [originalMember, member]);
  const leave = async () => {
    // const imageName = intro?.image?.split("/").pop();
    // if (!imageName) {
    //   router.push("/admin/intro");
    //   return;
    // }
    // const { data, error } = await supabase.storage
    //   .from("introImages")
    //   .remove([imageName]);
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
                originalMember={originalMember}
                setMember={setMember}
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
  member,
  originalMember,
  setMember,
}: {
  member: MemberType;
  originalMember: MemberType | null;
  setMember: Dispatch<SetStateAction<MemberType | null>>;
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
            className="px-4 h-[50px] border bg-tertiary"
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
          originalMember={originalMember}
          setMember={setMember}
        />
      </div>
    </div>
  );
};

const MemberImage = ({
  member,
  originalMember,
  setMember,
}: {
  member: MemberType;
  originalMember: MemberType | null;
  setMember: Dispatch<SetStateAction<MemberType | null>>;
}) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef(null);
  const imageName = useMemo(() => {
    const name = member.image?.split("/").pop();
    return name ? name : null;
  }, [member]);
  const uploadImage = async (file: File) => {
    setLoading(true);
    if (imageName) {
      const { data, error } = await supabase.storage
        .from("memberImages")
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
      .from("memberImages")
      .upload(fileName, file, {
        upsert: false,
      });
    const { data: publicData } = supabase.storage
      .from("memberImages")
      .getPublicUrl(fileName);
    if (error) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    // if (originalMember == null) {
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
    //     .eq("id", originalMember?.id);
    //   console.log(publicData.publicUrl, err);
    //   if (err) {
    //     toast.error("Error Updating ImageUrl after Uploading");
    //     console.error(error);
    //     setLoading(false);
    //     return;
    //   }

    // }
    toast.success("Successfully Uploaded an Image");
    setMember({ ...member, image: publicData.publicUrl });
    setImageFile(null);
    setLoading(false);
  };
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <div className=" w-[300px] h-[200px] relative bg-black/5">
        {member.image && (
          <Image
            src={
              imageFile ? URL.createObjectURL(imageFile) : member.image || ""
            }
            fill
            alt={"memberImage" + member.id}
            className="object-contain bg-quinary"
          />
        )}

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
              {member.image ? (
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

export default Member;
