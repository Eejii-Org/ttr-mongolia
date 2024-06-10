import { Input } from "@components";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "@/utils/supabase/client";
import _ from "lodash";

export const ScheduledTours = ({ tourId }: { tourId: number }) => {
  const [availableTours, setAvailableTours] = useState<AvailableTourType[]>([]);
  const addDeparture = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;
    setAvailableTours([
      {
        date: todayString,
        salePrice: null,
        status: "active",
        tourId: tourId,
        bookable: true,
      },
      ...availableTours,
    ]);
  };
  const saveDeparture = async (departure: AvailableTourType) => {
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
  const updateDeparture = async (departure: AvailableTourType) => {
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
  departure: AvailableTourType;
  scheduleLength: number;
  saveDeparture: (departure: AvailableTourType) => Promise<void>;
  updateDeparture: (departure: AvailableTourType) => Promise<void>;
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
  const [dep, setDep] = useState<AvailableTourType | null>();
  const isSaveDisabled = useMemo(() => {
    if (!dep?.id) return false;
    if (dep.bookable !== departure.bookable) {
      return false;
    }
    return dep?.salePrice === departure.salePrice;
  }, [dep, departure]);
  // const updateable = useMemo<boolean>(() => {
  //   return dep?.salePrice !== departure.salePrice;
  // }, [dep, departure, loading]);
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
        <div className="flex flex-col h-12 items-start justify-center gap-2">
          <span className="text-base">Make Sale:</span>
          <input
            type="checkbox"
            checked={dep.salePrice !== null}
            className=" w-4 h-4"
            onChange={(e) =>
              setDep({ ...dep, salePrice: e.target.checked ? 1000 : null })
            }
          />
        </div>
        <Input
          disabled={dep.salePrice == null}
          value={dep.salePrice == null ? "" : dep.salePrice}
          type="number"
          placeholder="Price"
          onChange={(e) =>
            setDep({ ...dep, salePrice: Number(e.target.value) })
          }
        />
        <div className="flex flex-col h-12 items-start justify-center gap-2">
          <span className="text-base">Bookable:</span>
          <input
            type="checkbox"
            checked={dep.bookable}
            className="w-4 h-4"
            onChange={(e) => setDep({ ...dep, bookable: e.target.checked })}
          />
        </div>
        <button
          className={`px-3 py-2 min-w-32 bg-quinary ripple text-lg font-medium`}
          onClick={update}
          disabled={loading}
        >
          {loading ? "Loading" : dep.status == "active" ? "Hold" : "Resume"}
        </button>
        <button
          className={`px-3 py-2 min-w-32  text-lg font-medium ${
            isSaveDisabled
              ? "bg-quinary text-white border-primary ripple"
              : "bg-primary text-white"
          }`}
          onClick={save}
          disabled={isSaveDisabled}
        >
          {saveLoading ? "Loading" : "Save"}
        </button>
      </div>
    </div>
  );
};
