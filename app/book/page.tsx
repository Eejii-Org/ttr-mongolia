"use client";
import { supabase } from "@/utils/supabase/client";
import {
  ArrowRight,
  EmailIcon,
  Input,
  MainLayout,
  PhoneIcon,
  SelectBirthday,
  SelectNationality,
} from "@components";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type TourType = {
  title: string;
  originalPrice: PriceType[];
  days: number;
  nights: number;
};
type AvailableTourType = {
  tourId: number;
  salePrice: number | null;
  date: string;
};

const Booking = () => {
  const [tour, setTour] = useState<TourType | null>(null);
  const [availableTour, setAvailableTour] = useState<AvailableTourType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const availableTourId = searchParams.get("availableTourId");
  const router = useRouter();
  const [personalDetail, setPersonalDetail] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    nationality: "",
    dateOfBirth: "2000-1-1",
    peopleCount: 1,
    additionalInformation: "",
  });

  const updatePersonalDetail = (key: string, value: string | number) => {
    setPersonalDetail({ ...personalDetail, [key]: value });
  };
  const [bookLoading, setBookLoading] = useState(false);
  const book = async () => {
    if (!availableTour) {
      setError("Tour Not Found");
      return;
    }
    setBookLoading(true);
    const res = await axios.post(
      "https://ttr-mongolia.vercel.app/api/request-invoice",
      {
        // amount: personalDetail.peopleCount * availableTour?.price,
        amount: "0.01",
        availableTourId,
        personalDetail,
      }
    );
    if (res.status !== 200) {
      setError(res.statusText);
    }
    setBookLoading(false);
    router.push(`/book/payment?invoice=${res.data.invoice}`);
  };
  const pricePerPerson = useMemo(() => {
    if (availableTour?.salePrice == null) {
      if (!tour?.originalPrice) return;
      for (let price of tour?.originalPrice) {
        if (price.passengerCount >= personalDetail.peopleCount) {
          return price.pricePerPerson;
        }
      }
      return tour?.originalPrice.at(-1)?.pricePerPerson;
    }
    return availableTour.salePrice;
  }, [availableTour, personalDetail]);
  useEffect(() => {
    const getTour = async () => {
      if (availableTourId == "") {
        // router.push("/");
        setError("Tour Not Found");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("availableTours")
        .select("tourId, salePrice, date")
        .eq("id", availableTourId);
      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.length == 0) {
        setTour(null);
        setLoading(false);
        setError("Tour Not Found");
        return;
      }
      const { data: tourData, error: err } = await supabase
        .from("tours")
        .select("title, originalPrice, days, nights")
        .eq("id", data[0].tourId);
      if (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
        return;
      }
      if (tourData.length == 0) {
        setAvailableTour(null);
        setLoading(false);
        setError("Tour Not Found");
        return;
      }
      setTour(tourData[0]);
      setAvailableTour(data[0]);
      setLoading(false);
    };
    getTour();
  }, [availableTourId]);
  const dates = useMemo(() => {
    if (!availableTour || !tour) return null;
    const startingDate = new Date(availableTour.date);
    let endingDate = new Date(availableTour.date);
    endingDate.setDate(startingDate.getDate() + tour?.days);
    return {
      startingDate: {
        day: startingDate.toLocaleString("default", { weekday: "short" }),
        date:
          startingDate.toLocaleString("default", { month: "long" }) +
          " " +
          startingDate.getDate() +
          " " +
          startingDate.getFullYear(),
      },
      endingDate: {
        day: endingDate.toLocaleString("default", { weekday: "short" }),
        date:
          endingDate.toLocaleString("default", { month: "long" }) +
          " " +
          endingDate.getDate() +
          " " +
          endingDate.getFullYear(),
      },
    };
  }, [availableTour]);

  if (error) {
    return (
      <MainLayout>
        <div className="w-screen flex-1 px-3  xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col items-center gap-4 justify-center">
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold lg:text-4xl">{error}</div>
            <button
              onClick={() => router.back()}
              className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold ripple w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading || !availableTour || !tour) {
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
        <div className=" text-2xl font-semibold lg:text-4xl">{tour?.title}</div>
        <form
          className="flex flex-1 flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            book();
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
                    min={1}
                    placeholder="3"
                    onChange={(e) => {
                      updatePersonalDetail(
                        "peopleCount",
                        Number(e.target.value)
                      );
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
                  Designated Date
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex flex-row gap-8 justify-between items-center w-full">
                    <div>
                      <div className="font-medium text-base text-[#c1c1c1]">
                        {dates?.startingDate.day}
                      </div>
                      <div className="font-bold text-xl">
                        {dates?.startingDate.date}
                      </div>
                    </div>
                    <ArrowRight />
                    <div>
                      <div className="font-medium text-base text-[#c1c1c1]">
                        {dates?.endingDate.day}
                      </div>
                      <div className="font-bold text-xl">
                        {dates?.endingDate.date}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-[#c1c1c1]">
                    {tour?.days} days / {tour?.nights} nights
                  </div>
                </div>
              </div>
              {pricePerPerson && (
                <>
                  <div className=" bg-quinary p-3 md:p-4 flex flex-col gap-2">
                    <div className="text-lg font-semibold lg:text-xl">
                      Price
                    </div>
                    <div className="text-base font-semibold lg:text-xl text-center">
                      {personalDetail.peopleCount} * ${pricePerPerson} = $
                      {personalDetail.peopleCount * pricePerPerson}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold ripple"
                  >
                    {bookLoading ? "Loading" : "Book"}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Booking;
