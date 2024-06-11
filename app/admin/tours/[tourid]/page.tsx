"use client";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowLeft,
  DayIcon,
  ImagesEditor,
  Input,
  PriceIcon,
  Tiptap,
} from "@components";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { ScheduledTours } from "./scheduledtours";
import { List } from "./list";
import { SelectTourCategories } from "./selecttourcategories";
import { Prices } from "./prices";
import { deleteImagesInS3, uploadImagesToS3 } from "@/utils";
import { Itinierary } from "./itinerary";

type ModifiedTourType = Omit<TourType, "images"> & {
  images: (Blob | string)[];
};

const Tour = () => {
  const router = useRouter();
  const [tour, setTour] = useState<ModifiedTourType | null>(null);
  const [originalTour, setOriginalTour] = useState<TourType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const params = useParams();
  const { tourid } = params;
  const [isNew, setIsNew] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [selectedTab, setSelectedTab] = useState("detail");

  const save = async () => {
    setSaveLoading(true);
    const newTour = tour;
    if (isNew) {
      const paths = await uploadImagesToS3(
        tour?.images as Blob[],
        "tourImages"
      );
      if (newTour) {
        newTour.images = paths as string[];
      }
      const { data, error } = await supabase
        .from("tours")
        .insert(newTour)
        .select();
      if (error) {
        toast.error("Error");
        console.error(error);
        setSaveLoading(false);
        return;
      }
      setOriginalTour(newTour as TourType);
      toast.success("Successfully Saved");
      setSaveLoading(false);
      router.push(`/admin/tours/${data[0].id}`);
      return;
    }
    const uploadablePictures =
      tour?.images?.filter((image) =>
        typeof image === "string" || image instanceof String ? false : true
      ) || [];
    const deletedPictures =
      originalTour?.images?.filter((image) => !tour?.images.includes(image)) ||
      [];
    if (deletedPictures && deletedPictures.length > 0) {
      await deleteImagesInS3(deletedPictures);
    }
    const paths = await uploadImagesToS3(
      uploadablePictures as Blob[],
      "tourImages"
    );
    let newImages = [];
    if (tour?.images) {
      for (let i = 0, j = 0; i < tour?.images.length; i++) {
        if (
          typeof tour.images[i] === "string" ||
          tour.images[i] instanceof String
        ) {
          newImages.push(tour.images[i]);
        } else {
          if (paths?.[j]) {
            newImages.push(paths[j]);
            j++;
          }
        }
      }
    }
    if (newTour) {
      newTour.images = newImages;
    }
    const { error } = await supabase
      .from("tours")
      .update(newTour)
      .eq("id", originalTour?.id);

    if (error) {
      toast.error("Error");
      console.error(error);
      setSaveLoading(false);
      return;
    }
    setTour(newTour);
    setOriginalTour(newTour as TourType);
    toast.success("Successfully Saved");
    setSaveLoading(false);
  };
  const isChanged = useMemo(() => {
    if (tour == null) return false;
    if (originalTour == null) return true;
    return !_.isEqual(originalTour, tour);
  }, [originalTour, tour]);

  useEffect(() => {
    const fetchTour = async () => {
      if (tourid == "new") {
        setTour({
          images: [],
          title: "",
          overview: "",
          originalPrice: [],
          days: 0,
          minimumRequired: 0,
          categories: [],
          included: [],
          excluded: [],
          itinerary: [],
          reviews: [],
          status: "active",
          displayPrice: 1000,
          map: "",
        });
        setOriginalTour({
          images: [],
          title: "",
          overview: "",
          originalPrice: [],
          days: 0,
          minimumRequired: 0,
          categories: [],
          included: [],
          excluded: [],
          itinerary: [],
          reviews: [],
          status: "active",
          displayPrice: 1000,
          map: "",
        });
        setIsNew(true);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .eq("id", tourid);

        if (error) {
          throw error;
        }
        if (data.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setOriginalTour(data[0] as TourType);
        setTour(data[0] as TourType);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
      setLoading(false);
    };
    fetchTour();
  }, [tourid]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/admin/tours"
          className="flex p-2 ripple rounded-full bg-tertiary border"
        >
          <ArrowLeft color="black" />
        </Link>
        <div className="text-2xl md:text-4xl font-semibold">
          {isNotFound ? "Tour not found" : tour?.title}
        </div>
      </div>
      {tour && (
        <>
          <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
            <div className="flex-1 p-4">
              {selectedTab == "detail" ? (
                <Detail tour={tour} setTour={setTour} />
              ) : (
                <ScheduledTours tourId={Number(tourid)} />
              )}
            </div>
            {selectedTab == "detail" && (
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Tabs = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
}) => {
  const tabs = ["detail", "schedules"];
  return (
    <div className="flex flex-row">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`capitalize text-lg px-6 py-2 ${
            selectedTab == tab
              ? "text-secondary border-b-2 border-primary"
              : " text-[#c1c1c1]"
          }`}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const Detail = ({
  tour,
  setTour,
}: {
  tour: ModifiedTourType;
  setTour: Dispatch<SetStateAction<ModifiedTourType | null>>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Tour Name:</label>
          <Input
            type="text"
            placeholder="Gobi Tour"
            value={tour.title}
            onChange={(e) => setTour({ ...tour, title: e.target.value })}
          />
        </div>
        <div className="max-w-80 flex flex-col">
          <label className="pl-2 font-medium">Status:</label>
          <select
            value={tour.status}
            className="px-4 py-3 border bg-tertiary rounded-xl"
            onChange={(e) =>
              setTour({
                ...tour,
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
        <div className="max-w-80">
          <label className="pl-2 font-medium">Display Price:</label>
          <Input
            type="number"
            placeholder="1000"
            value={tour.displayPrice}
            icon={<PriceIcon />}
            onChange={(e) =>
              setTour({ ...tour, displayPrice: Number(e.target.value) })
            }
          />
        </div>
        <div className="max-w-80">
          <label className="pl-2 font-medium">Tour Days:</label>
          <Input
            type="number"
            placeholder="3"
            value={tour.days}
            icon={<DayIcon />}
            min={0}
            onChange={(e) => setTour({ ...tour, days: Number(e.target.value) })}
          />
        </div>
        <div className="max-w-80">
          <label className="pl-2 font-medium">Map:</label>
          <Input
            type="text"
            placeholder="Map Link"
            value={tour.map || ""}
            onChange={(e) => setTour({ ...tour, map: e.target.value })}
          />
        </div>
      </div>
      <Prices
        prices={tour.originalPrice}
        setPrices={(newPrices: PriceType[]) => {
          setTour({
            ...tour,
            originalPrice: newPrices,
          });
        }}
      />
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Overview:</label>
        <Tiptap
          className="min-h-48 w-full p-2 border rounded-2xl"
          content={tour.overview}
          setContent={(s) => {
            setTour({ ...tour, overview: s });
          }}
        />
        {/* <textarea
          placeholder="Overview"
          value={tour.overview}
          onChange={(e) => {
            setTour({ ...tour, overview: e.target.value });
          }}
        ></textarea> */}
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Category:</label>
        <SelectTourCategories
          selectedCategories={tour.categories}
          setSelectedCategories={(newCategories) =>
            setTour({ ...tour, categories: newCategories })
          }
        />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <label className="pl-2 font-medium">Included:</label>
          <List
            listData={tour.included}
            setListData={(listData) => setTour({ ...tour, included: listData })}
            labelName="name"
            descriptionName="explanation"
          />
        </div>
        <div className="flex-1">
          <label className="pl-2 font-medium">Excluded:</label>
          <List
            listData={tour.excluded}
            setListData={(listData) => setTour({ ...tour, excluded: listData })}
            labelName="name"
            descriptionName="explanation"
          />
        </div>
      </div>
      <div>
        <label className="pl-2 font-medium">Tour Plan:</label>
        <Itinierary
          listData={tour.itinerary}
          setListData={(listData) => setTour({ ...tour, itinerary: listData })}
        />
      </div>
      <div>
        <label className="pl-2 font-medium">Images:</label>
        <ImagesEditor
          images={tour.images}
          setImages={(newImages) => setTour({ ...tour, images: newImages })}
        />
      </div>
    </div>
  );
};

export default Tour;
