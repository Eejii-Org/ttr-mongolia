"use client";
import { supabase } from "@/utils/supabase/client";
import {
  EmailIcon,
  Input,
  MainLayout,
  PhoneIcon,
  SelectBirthday,
  SelectNationality,
} from "@components";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TourType = {
  id: number;
  title: string;
  originalPrice: PriceType[];
  days: number;
  nights: number;
  minimumRequired: number;
  displayPrice: number;
};
const NewTour = ({ searchParams }: { searchParams: { tourid: number } }) => {
  const { tourid } = searchParams;
  const [tours, setTours] = useState<TourType[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [personalDetail, setPersonalDetail] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    nationality: "",
    dateOfBirth: "",
    peopleCount: 1,
    additionalInformation: "",
  });
  const [tourDate, setTourDate] = useState("");
  const [selectedTour, setSelectedTour] = useState<number | undefined>(tourid);
  const selectedTourData = useMemo<TourType | null>(() => {
    if (!tours) return null;
    const tourData = tours.find((t) => t.id == selectedTour);
    return tourData ? tourData : null;
  }, [selectedTour, tours]);
  const updatePersonalDetail = (key: string, value: string) => {
    setPersonalDetail({ ...personalDetail, [key]: value });
  };
  const pricePerPerson = useMemo(() => {
    if (!selectedTourData?.originalPrice) return;
    for (let price of selectedTourData?.originalPrice) {
      if (price.passengerCount >= personalDetail.peopleCount) {
        return price.pricePerPerson;
      }
    }
    return selectedTourData?.originalPrice?.at(-1)?.pricePerPerson;
  }, [selectedTourData, personalDetail]);
  const [requestLoading, setRequestLoading] = useState(false);
  const requestNewTour = async () => {
    setRequestLoading(true);

    try {
      const res = await axios.post(
        "https://www.ttrmongolia.com/api/request-departure",
        {
          ...personalDetail,
          tourId: selectedTour,
          startingDate: tourDate,
          tourTitle: selectedTourData?.title,
          price: selectedTourData?.displayPrice,
        }
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
      setRequestLoading(false);
      return;
    }
    toast.success("Request has been added successfully");
    setPersonalDetail({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      nationality: "",
      dateOfBirth: "",
      peopleCount: 1,
      additionalInformation: "",
    });
    setRequestLoading(false);
    setTourDate("");
  };

  useEffect(() => {
    const getTour = async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(
          "id, title, originalPrice, days, nights, minimumRequired, displayPrice"
        );
      if (error) {
        console.error(error);
        toast.error(error.message);
      }
      setTours(data);
      setLoading(false);
    };
    getTour();
  }, []);

  if (error) {
    return (
      <MainLayout>
        <div className="w-screen flex-1 px-3   xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col items-center gap-4 justify-center">
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold lg:text-4xl">{error}</div>
            <button
              onClick={() => router.back()}
              className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold rounded-xl ripple w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="w-screen flex-1 px-3  xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col gap-4 justify-center">
          Loading
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-screen flex-1 px-3  xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col gap-4 justify-center">
        <div className=" text-2xl font-semibold lg:text-4xl">
          Request New Departure
        </div>
        <form
          className="flex flex-1 flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            requestNewTour();
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 h-full">
            <div className="bg-quinary p-3 md:p-4 flex-1 flex flex-col gap-3">
              <div className="text-lg font-semibold lg:text-xl">
                Personal Detail
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
                  <Input
                    type="text"
                    value={personalDetail.firstName}
                    placeholder="FirstName"
                    onChange={(e) => {
                      updatePersonalDetail("firstName", e.target.value);
                    }}
                    required
                  />
                  <Input
                    type="text"
                    value={personalDetail.lastName}
                    placeholder="LastName"
                    onChange={(e) => {
                      updatePersonalDetail("lastName", e.target.value);
                    }}
                    required
                  />
                </div>
                <Input
                  type={"tel"}
                  value={personalDetail.phoneNumber}
                  placeholder="+976 9999 9999"
                  icon={<PhoneIcon />}
                  onChange={(e) => {
                    updatePersonalDetail("phoneNumber", e.target.value);
                  }}
                  required
                />
                <Input
                  value={personalDetail.email}
                  type={"email"}
                  placeholder="example@gmail.com"
                  icon={<EmailIcon />}
                  onChange={(e) => {
                    updatePersonalDetail("email", e.target.value);
                  }}
                  required
                />
                <SelectNationality
                  value={personalDetail.nationality}
                  onChange={(value: string) =>
                    updatePersonalDetail("nationality", value)
                  }
                />
                <SelectBirthday
                  value={personalDetail.dateOfBirth}
                  onChange={(newDateOfBirth) =>
                    updatePersonalDetail("dateOfBirth", newDateOfBirth)
                  }
                />
                <div>
                  <div className="text-base md:text-lg font-semibold">
                    How many people will travel including you?
                  </div>
                  <Input
                    value={personalDetail.peopleCount}
                    type={"number"}
                    placeholder="3"
                    onChange={(e) => {
                      updatePersonalDetail("peopleCount", e.target.value);
                    }}
                    required
                  />
                </div>
                <textarea
                  placeholder="Additional Information"
                  className=" min-h-32 p-4 border"
                  value={personalDetail.additionalInformation}
                  onChange={(e) => {
                    updatePersonalDetail(
                      "additionalInformation",
                      e.target.value
                    );
                  }}
                ></textarea>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className=" bg-quinary p-3 md:p-4 flex flex-col gap-2">
                <div className="text-lg font-semibold lg:text-xl">
                  Choose Tour
                </div>
                <div>
                  <select
                    name="tours"
                    required
                    className={`text-base px-4 py-3 w-full outline-none border ${
                      selectedTour ? "text-secondary" : "text-[#c1c1c1]"
                    }`}
                    onChange={(e) => setSelectedTour(Number(e.target.value))}
                    value={selectedTour}
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  >
                    <option value="" className="text-quaternary">
                      Select Tour
                    </option>
                    {tours?.map((t, key) => (
                      <option value={t.id} key={t.id + key}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <div className="font-medium text-[#c1c1c1]">
                    ${pricePerPerson} Per person
                  </div>
                  <div className="font-medium text-[#c1c1c1]">
                    {selectedTourData?.days} days / {selectedTourData?.nights}{" "}
                    nights
                  </div>
                </div>
              </div>
              <div className=" bg-quinary p-3 md:p-4 flex flex-col gap-2">
                <div className="text-lg font-semibold lg:text-xl">
                  Tour Starting Date
                </div>
                <div className="text-base font-semibold lg:text-xl text-center flex flex-row gap-4">
                  <input
                    value={tourDate}
                    required
                    onChange={(e) => setTourDate(e.target.value)}
                    type={"date"}
                    min={new Date().toISOString().split("T")[0]}
                    className="text-base px-4 py-3 w-full outline-none border "
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold ripple"
              >
                {requestLoading ? "Loading" : "Request A New Departure"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default NewTour;
