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
} from "@components";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import Image from "next/image";

const Tour = () => {
  const supabase = createClient();
  const router = useRouter();
  const [tour, setTour] = useState<TourType | null>(null);
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
      // new
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
      router.push(`/admin/intro/${data[0].id}`);
      return;
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
    setOriginalTour({ ...originalTour, ...(newTour as TourType) });
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
          originalPrice: 0,
          days: 0,
          nights: 0,
          minimumRequired: 0,
          categories: [],
          included: [],
          excluded: [],
          itinerary: [],
          reviews: [],
          status: "active",
        });
        setOriginalTour({
          images: [],
          title: "",
          overview: "",
          originalPrice: 0,
          days: 0,
          nights: 0,
          minimumRequired: 0,
          categories: [],
          included: [],
          excluded: [],
          itinerary: [],
          reviews: [],
          status: "active",
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
                <Detail
                  tour={tour}
                  originalTour={originalTour}
                  setTour={setTour}
                />
              ) : (
                <ScheduledTours tourId={Number(tourid)} />
              )}
            </div>
            {selectedTab == "detail" && (
              <div className="p-4 flex items-end justify-end bg-white border-t">
                <button
                  disabled={!isChanged}
                  className={`px-12 py-2 font-semibold hover:bg-opacity-50 ${
                    isChanged
                      ? "bg-primary text-tertiary ripple"
                      : "bg-quinary text-secondary"
                  }`}
                  onClick={save}
                >
                  Save
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
  originalTour,
  setTour,
}: {
  tour: TourType;
  originalTour: TourType | null;
  setTour: Dispatch<SetStateAction<TourType | null>>;
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
          <label className="pl-2 font-medium">Price:</label>
          <Input
            type="number"
            placeholder="1000"
            value={tour.originalPrice}
            icon={<PriceIcon />}
            onChange={(e) =>
              setTour({ ...tour, originalPrice: Number(e.target.value) })
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
          <label className="pl-2 font-medium">Tour Nights:</label>
          <Input
            type="number"
            placeholder="3"
            min={0}
            value={tour.nights}
            icon={<NightIcon />}
            onChange={(e) =>
              setTour({ ...tour, nights: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Overview:</label>
        <textarea
          placeholder="Overview"
          className=" min-h-48 w-full p-4 border"
          value={tour.overview}
          onChange={(e) => {
            setTour({ ...tour, overview: e.target.value });
          }}
        ></textarea>
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
        <List
          listData={tour.itinerary}
          setListData={(listData) => setTour({ ...tour, itinerary: listData })}
          labelName="title"
          descriptionName="description"
        />
      </div>
      <div>
        <label className="pl-2 font-medium">Images:</label>
        <TourImages tour={tour} originalTour={originalTour} setTour={setTour} />
      </div>
    </div>
  );
};

type TourPlanType = {
  listData: any;
  setListData: Dispatch<SetStateAction<any>>;
  labelName: string;
  descriptionName: string;
};
const List: FC<TourPlanType> = (props) => {
  const { setListData, listData, labelName, descriptionName } = props;
  const removeListData = (index: number) => {
    setListData([...listData.filter((_: any, ind: number) => ind != index)]);
  };
  const addListData = () => {
    setListData([
      ...listData,
      {
        [labelName]: "",
        [descriptionName]: "",
      },
    ]);
  };
  const moveList = (index: number, direction: "up" | "down") => {
    let list = listData;
    if (direction == "up") {
      if (index == 0) return;
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      setListData(list);
      return;
    }
    if (index == listData.length - 1) return;
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    setListData(list);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="font-medium text-xl flex-1">
        {listData.map((nodeData: any, index: number) => (
          <ListItem
            {...nodeData}
            updateListData={(label, description) => {
              setListData([
                ...listData.map((data: any, ind: number) =>
                  ind == index
                    ? {
                        [labelName]: label,
                        [descriptionName]: description,
                      }
                    : data
                ),
              ]);
            }}
            moveList={moveList}
            addListData={addListData}
            removeListData={removeListData}
            listLength={listData.length}
            label={nodeData[labelName]}
            description={nodeData[descriptionName]}
            index={index}
            key={index}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <button
          className="px-3 py-2 bg-quinary ripple font-medium"
          onClick={addListData}
        >
          Add Row
        </button>
      </div>
    </div>
  );
};

interface DayType extends TourPlanType {
  index: number;
  label: string;
  description: string;
  listLength: number;
  updateListData: (label: string, description: string) => void;
  removeListData: (index: number) => void;
  moveList: (index: number, direction: "up" | "down") => void;
}

const ListItem = ({
  updateListData,
  label,
  description,
  index,
  listLength,
  removeListData,
  moveList,
}: DayType) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border ${index == 0 ? "" : "border-t-0"} ${
        index == 0 ? "rounded-tl rounded-tr" : ""
      } ${index == listLength - 1 ? "rounded-bl rounded-br" : ""}`}
    >
      <div
        className={`text-lg md:text-xl p-3 gap-4 flex flex-row justify-between items-center ${
          open ? "border-b" : ""
        }`}
      >
        <div className="flex flex-col">
          <button
            className={`${index == 0 ? "opacity-50" : "ripple"}`}
            disabled={index == 0}
            onClick={() => moveList(index, "up")}
          >
            <CaretUpIcon color="black" />
          </button>
          <button
            className={`${index == listLength - 1 ? "opacity-50" : "ripple"}`}
            onClick={() => moveList(index, "down")}
          >
            <CaretDownIcon color="black" />
          </button>
        </div>
        <div className="flex flex-row items-center flex-1">
          {/* <span className="font-bold text-primary pr-2">DAY {index + 1}</span> */}
          <Input
            value={label}
            type="text"
            onChange={(e) => updateListData(e.target.value, description)}
          />
        </div>
        <button
          className={`transition-all ripple rounded-full p-1 `}
          onClick={() => setOpen(!open)}
        >
          <div className={`${open ? "rotate-180" : ""}`}>
            <ChevronDownIcon />
          </div>
        </button>
        <button
          className={`transition-all ripple rounded-full p-1 `}
          onClick={() => removeListData(index)}
        >
          <div className={`${open ? "rotate-180" : ""}`}>
            <MinusIcon color={"red"} />
          </div>
        </button>
      </div>
      <div className={`${open ? "flex" : "hidden"} text-base p-3 font-normal`}>
        <textarea
          placeholder="Overview"
          className=" min-h-48 w-full p-4 border rounded-xl"
          value={description}
          onChange={(e) => updateListData(label, e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

type ToursPropsType = {
  selectedCategories: string[];
  setSelectedCategories: (newCategories: string[]) => void;
};

const SelectTourCategories = ({
  selectedCategories,
  setSelectedCategories,
}: ToursPropsType) => {
  const supabase = createClient();
  const [tourCategories, setTourCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    const fetchTourCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("tourCategories")
          .select("*");
        if (error) {
          throw error;
        }
        setTourCategories(data);
      } catch (error: any) {
        console.error("Error fetching tour categories:", error.message);
      }
    };

    fetchTourCategories();
  }, []);
  return (
    <div className="flex flex-row gap-4 overflow-scroll w-full">
      {tourCategories?.map((category, index) => (
        <div
          className={`ripple px-4 py-2 rounded whitespace-nowrap cursor-pointer ${
            selectedCategories.includes(category.name)
              ? "bg-primary text-tertiary"
              : "bg-quaternary"
          } hover:bg-primary hover:text-tertiary transition-all min-w-min`}
          onClick={() =>
            selectedCategories.includes(category.name)
              ? setSelectedCategories(
                  selectedCategories.filter((cat) => cat != category.name)
                )
              : setSelectedCategories([...selectedCategories, category.name])
          }
          key={index}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

const TourImages = ({
  tour,
  originalTour,
  setTour,
}: {
  tour: TourType;
  originalTour: TourType | null;
  setTour: Dispatch<SetStateAction<TourType | null>>;
}) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const uploadImage = async (file: File) => {
    setLoading(true);
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const fileType = file.type.split("/").pop();
    const fileName = `${uniqueId}.${fileType}`;
    const { data, error } = await supabase.storage
      .from("tourImages")
      .upload(fileName, file, {
        upsert: false,
      });
    const { data: publicData } = supabase.storage
      .from("tourImages")
      .getPublicUrl(fileName);
    if (error) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    const { error: err } = await supabase
      .from("tours")
      .update({ images: [...tour.images, publicData.publicUrl] })
      .eq("id", originalTour?.id);
    if (err) {
      toast.error("Error Uploading Image");
      console.error(error);
      setLoading(false);
      return;
    }
    toast.success("Successfully Uploaded an Image");
    setTour({ ...tour, images: [...tour.images, publicData.publicUrl] });
    setImageFile(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {tour.images.map((imageUrl, index) => (
        <TourImage
          imageUrl={imageUrl}
          originalTour={originalTour}
          tour={tour}
          setTour={setTour}
          key={index}
        />
      ))}
      {imageFile && (
        <div className=" w-[300px] h-[200px] relative">
          <img
            src={URL.createObjectURL(imageFile)}
            alt={"selectedImage"}
            className="object-contain w-[300px] h-[200px]"
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
                  setImageFile(null);
                }}
              >
                <CloseIcon width={24} height={24} color="black" />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="w-[300px] h-[200px] relative bg-quinary flex items-center justify-center gap-1 flex-col">
        <input
          type="file"
          onChange={(e) => {
            if (!e.target.files || e.target.files?.length == 0) return;
            setImageFile(e.target.files[0]);
            uploadImage(e.target.files[0]);
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

const TourImage = ({
  imageUrl,
  setTour,
  originalTour,
  tour,
}: {
  imageUrl: string;
  tour: TourType;
  originalTour: TourType | null;
  setTour: Dispatch<SetStateAction<TourType | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const imageName = useMemo(() => {
    const name = imageUrl.split("/").pop();
    return name ? name : "Unidentified Image";
  }, [imageUrl]);
  const supabase = createClient();
  const deleteImage = async () => {
    setLoading(true);
    if (!imageName) {
      toast.error("Error Deleting Image");
      setLoading(false);
      return;
    }
    const { error: err } = await supabase
      .from("tours")
      .update({ images: tour.images.filter((url) => url !== imageUrl) })
      .eq("id", originalTour?.id);
    if (err) {
      toast.error("Error Updating Tour");
      console.error(err);
      setLoading(false);
      return;
    }
    const { error } = await supabase.storage
      .from("tourImages")
      .remove([imageName]);
    if (error) {
      toast.error("Error");
      console.error(error);
      setLoading(false);
      return;
    }
    setTour({ ...tour, images: tour.images.filter((url) => url !== imageUrl) });
    setLoading(false);
  };
  return (
    <div className=" w-[300px] h-[200px] relative">
      <Image src={imageUrl} fill alt={imageName} />
      {loading ? (
        <div className="z-20 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/20 backdrop-blur">
          <div className="font-medium text-lg">Deleting</div>
        </div>
      ) : (
        <div className="absolute top-2 right-2">
          <button
            className="bg-white/50 rounded-full ripple p-1 backdrop-blur border"
            onClick={deleteImage}
          >
            <CloseIcon width={24} height={24} color="black" />
          </button>
        </div>
      )}
    </div>
  );
};

const ScheduledTours = ({ tourId }: { tourId: number }) => {
  const supabase = createClient();
  const [availableTours, setAvailableTours] = useState<TravelDate[]>([]);
  const addDeparture = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;
    setAvailableTours([
      {
        date: todayString,
        price: 1000,
        status: "active",
        tourId: tourId,
      },
      ...availableTours,
    ]);
  };
  const saveDeparture = async (departure: TravelDate) => {
    if (departure.id) {
      const { error } = await supabase
        .from("availableTours")
        .update({
          ...departure,
        })
        .eq("id", departure?.id);
      if (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }
      setAvailableTours(
        availableTours.map((availableTour) =>
          availableTour.id == departure.id ? departure : availableTour
        )
      );
      toast.success("Successfully saved departure");
      return;
    }
    const { data, error } = await supabase
      .from("availableTours")
      .insert({
        ...departure,
        tourId: tourId,
      })
      .select();
    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
    let newAvailableTours = availableTours;
    newAvailableTours.shift();
    setAvailableTours([data[0], ...newAvailableTours]);
    toast.success("Successfully saved departure");
  };
  const updateDeparture = async (departure: TravelDate) => {
    const { error } = await supabase
      .from("availableTours")
      .update({
        status: departure?.status == "active" ? "inactive" : "active",
      })
      .eq("id", departure?.id);
    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
    setAvailableTours(
      availableTours.map((availableTour) =>
        availableTour.id == departure.id
          ? {
              ...departure,
              status: departure?.status == "active" ? "inactive" : "active",
            }
          : availableTour
      )
    );
    toast.success("Successfully updated departure");
  };
  useEffect(() => {
    const getAvailableTours = async () => {
      if (!tourId) return;
      const { data, error } = await supabase
        .from("availableTours")
        .select("*")
        .eq("tourId", tourId)
        .order("date", { ascending: true });
      if (error) {
        console.error(error.message);
        return;
      }
      setAvailableTours(data);
    };
    getAvailableTours();
  }, [tourId]);
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="text-lg md:text-2xl font-semibold">
          Scheduled Departures
        </div>
        <button
          className="px-3 py-2 bg-quinary ripple font-medium"
          onClick={addDeparture}
        >
          Add Departure
        </button>
      </div>
      {availableTours.map((departure, index) => (
        <ScheduledTour
          departure={departure}
          index={index}
          scheduleLength={availableTours.length}
          saveDeparture={saveDeparture}
          updateDeparture={updateDeparture}
          key={index}
        />
      ))}
    </div>
  );
};

interface ScheduledTourType {
  index: number;
  departure: TravelDate;
  scheduleLength: number;
  saveDeparture: (departure: TravelDate) => Promise<void>;
  updateDeparture: (departure: TravelDate) => Promise<void>;
}

const ScheduledTour = ({
  departure,
  index,
  scheduleLength,
  saveDeparture,
  updateDeparture,
}: ScheduledTourType) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [dep, setDep] = useState<TravelDate | null>();
  const updateable = useMemo<boolean>(() => {
    // dep?.id == null
    //   ? loading
    //   : (dep?.price == departure.price && dep?.date == dep.date) ||
    return loading;
  }, [dep, departure, loading]);
  const update = async () => {
    if (!dep) return;
    setLoading(true);
    await updateDeparture(dep);
    setLoading(false);
  };
  const save = async () => {
    if (!dep) return;
    setSaveLoading(true);
    await saveDeparture(dep);
    setSaveLoading(false);
  };

  useEffect(() => {
    setDep(departure);
  }, [departure]);

  if (!dep) return <></>;
  return (
    <div
      className={`border ${index == 0 ? "" : "border-t-0"} ${
        index == 0 ? "rounded-tl rounded-tr" : ""
      } ${index == scheduleLength - 1 ? "rounded-bl rounded-br" : ""}`}
    >
      <div
        className={`text-lg md:text-xl p-3 gap-4 flex flex-row justify-between items-center`}
      >
        {dep.status == "active" ? (
          <div
            className={`border border-green-500 bg-green-500/10 w-min px-3 py-1 text-sm rounded text-green-500`}
          >
            Active
          </div>
        ) : (
          <div
            className={`border border-red-500 bg-red-500/10 w-min px-3 py-1 text-sm rounded text-red-500`}
          >
            InActive
          </div>
        )}
        <Input
          value={dep.date}
          type="date"
          disabled={dep.id != null}
          placeholder="Departure Date"
          onChange={(e) => setDep({ ...dep, date: e.target.value })}
        />
        <Input
          value={dep.price}
          type="number"
          placeholder="Price"
          onChange={(e) => setDep({ ...dep, price: Number(e.target.value) })}
        />
        <button
          className={`px-3 py-2 min-w-32 bg-quinary ripple text-lg font-medium`}
          onClick={update}
          disabled={loading || updateable}
        >
          {loading ? "Loading" : dep.status == "active" ? "Hold" : "Resume"}
        </button>
        <button
          className={`px-3 py-2 min-w-32  text-lg font-medium ${
            dep.price === departure.price || saveLoading
              ? "bg-quinary text-white border-primary ripple"
              : "bg-primary text-white"
          }`}
          onClick={save}
          disabled={saveLoading || dep.price === departure.price}
        >
          {saveLoading ? "Loading" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Tour;
