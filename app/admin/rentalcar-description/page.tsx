"use client";

import { supabase } from "@/utils/supabase/client";
import {
  ArrowLeft,
  Tiptap,
} from "@components";
import { useRouter, usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { TextContentType } from "@/utils";

const AdminRentalCarsDescription = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [textContent, setTextContent] = useState<TextContentType | null>(null);
  const [newTextContent, setNewTextContent] = useState<TextContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const save = async () => {
    setSaveLoading(true);
    if (!textContent && newTextContent !== null) {
      // new
      const {data, error } = await supabase
        .from("textContents")
        .insert({
          page: pathname,
          content: newTextContent.content
        })
        .select();
      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      toast.success("Successfully Saved");
      setSaveLoading(false);
      router.push(`/admin/rentalcar-description`);
      return;
    }

    const { error } = await supabase
      .from("textContents")
      .update({
        content: newTextContent?.content
      })
      .eq("id", textContent?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setTextContent(newTextContent);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };

  const isChanged = useMemo(() => {
    if (textContent == null) return false;
    else return true;
  }, [textContent]);

  const leave = async () => {
    router.push("/admin/rentalcars");
    return;
  };

  useEffect(() => {
    const fetchRentalCarDescription = async () => {
      try {
        const { data, error } = await supabase
          .from("textContents")
          .select("*")
          .eq("page", pathname);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setTextContent(null);
          setLoading(false);
          return;
        }
        setTextContent(data[0]);
      } catch (error: any) {
        console.error("Error fetching rentalCar description:", error);
      }
      setLoading(false);
    };
    fetchRentalCarDescription();
  }, []);

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
          Rental Cars Page - Bottom Description
        </div>
      </div>
        <>
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <label className="pl-2 font-medium">Description:</label>
                      <Tiptap
                        className="min-h-48 w-full p-2 border rounded-2xl"
                        content={textContent?.content || ''}
                        setContent={(s) => {
                          setNewTextContent({...textContent, content: s})
                        }}
                      />
                    </div>
                  </div>
              </div>
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
    </div>
  );
}

export default AdminRentalCarsDescription
