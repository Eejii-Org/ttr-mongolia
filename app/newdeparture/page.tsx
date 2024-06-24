"use client";
import { supabase } from "@/utils/supabase/client";
import {
  BigErrorIcon,
  BigSuccessIcon,
  Drawer,
  EmailIcon,
  MainLayout,
  MinusIcon,
  NewInput,
  PhoneIcon,
  PlusIcon,
  SelectNationality,
} from "@components";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TourType = {
  id: number;
  title: string;
  originalPrice: PriceType[];
  days: number;
  minimumRequired: number;
  displayPrice: number;
};
const NewTour = ({ searchParams }: { searchParams: { tourid: number } }) => {
  const { tourid } = searchParams;
  const [tours, setTours] = useState<TourType[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState<null | "Success" | "Fail">(
    null
  );
  const [isAgreedToPrivacy, setIsAgreedToPrivacy] = useState(false);
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
    startingDate: "",
  });
  const [selectedTour, setSelectedTour] = useState<number | undefined>(tourid);

  const [isPersonalDetailDrawerOpen, setIsPersonalDetailDrawerOpen] =
    useState(true);
  const [isDepartureDetailDrawerOpen, setIsDepartureDetailDrawerOpen] =
    useState(true);

  const [requestError, setRequestError] = useState<string | null>(null);

  const selectedTourData = useMemo<TourType | null>(() => {
    if (!tours) return null;
    const tourData = tours.find((t) => t.id == selectedTour);
    return tourData ? tourData : null;
  }, [selectedTour, tours]);
  const updatePersonalDetail = (key: string, value: string | number) => {
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

  const checkInputs = () => {
    if (!selectedTour) {
      setRequestError("Please fill out all of our inputs in form");
      return false;
    }
    type keysType =
      | "firstName"
      | "lastName"
      | "phoneNumber"
      | "email"
      | "nationality"
      | "dateOfBirth"
      | "peopleCount";
    const keysToCheck: keysType[] = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "nationality",
      "dateOfBirth",
      "peopleCount",
    ];
    for (const key of keysToCheck) {
      if (personalDetail[key] === "") {
        setRequestError("Please fill out all of our inputs in form");
        return false;
      }
    }
    if (!isAgreedToPrivacy) {
      setRequestError(
        "Please agree to the terms of conditions and privacy policty"
      );
      return false;
    }
    return true;
  };

  const requestNewTour = async () => {
    if (!checkInputs()) return;
    setRequestLoading(true);
    try {
      const res = await axios.post(`/api/request-departure`, {
        ...personalDetail,
        tourId: selectedTour,
        tourTitle: selectedTourData?.title,
        price: selectedTourData?.displayPrice,
      });
    } catch (err: any) {
      setModalMessage("Fail");
      console.error(err);
      setRequestLoading(false);
      return;
    }
    setModalMessage("Success");
    setPersonalDetail({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      nationality: "",
      dateOfBirth: "",
      peopleCount: 1,
      additionalInformation: "",
      startingDate: "",
    });
    setRequestLoading(false);
  };

  useEffect(() => {
    const getTour = async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(
          "id, title, originalPrice, days, minimumRequired, displayPrice"
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
    <>
      <div className={modalMessage == null ? "hidden" : "flex"}>
        <div
          className={`absolute top-0 left-0 w-screen h-screen bg-black/20 z-50`}
          onClick={() => setModalMessage(null)}
        ></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-96 p-4 pt-8 flex flex-col gap-4 rounded-2xl items-center z-50">
          {modalMessage == "Fail" ? <BigErrorIcon /> : <BigSuccessIcon />}
          <div className="flex flex-col items-center w-full gap-2">
            <h2 className="text-2xl font-bold">{modalMessage}</h2>
            <h3 className="font-medium text-center">
              {modalMessage == "Fail"
                ? "There was a problem sending your private tour information. Please try again later."
                : "Your private tour request has been successfully sent."}
            </h3>
            <button
              className="py-3 mt-3 bg-primary rounded w-full font-bold ripple"
              onClick={() => {
                if (modalMessage == "Fail") {
                  requestNewTour();
                }
                setModalMessage(null);
              }}
            >
              {modalMessage == "Fail" ? "Try Again" : "Done"}
            </button>
          </div>
        </div>
      </div>
      <MainLayout>
        <div className="flex-1 flex flex-col md:flex-row relative bg-[#F8FAFC]">
          <div
            className="flex-1 relative px-4"
            style={{
              backgroundImage: "url(/static/book-bg.png)",
              backgroundSize: "150% 150%",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-[764px] mx-auto my-8 flex flex-col gap-4 relative z-10">
              <h1 className="text-2xl font-bold lg:text-3xl">Personal Info</h1>
              <Drawer
                title="Personal Detail"
                open={isPersonalDetailDrawerOpen}
                setOpen={setIsPersonalDetailDrawerOpen}
              >
                <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                  <NewInput
                    type="text"
                    label="First Name:"
                    value={personalDetail.firstName}
                    placeholder="John"
                    onChange={(e) => {
                      updatePersonalDetail("firstName", e.target.value);
                    }}
                    required
                  />
                  <NewInput
                    type="text"
                    label="Last Name:"
                    value={personalDetail.lastName}
                    placeholder="Doe"
                    onChange={(e) => {
                      updatePersonalDetail("lastName", e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                  <NewInput
                    label="Phone Number:"
                    type={"tel"}
                    value={personalDetail.phoneNumber}
                    placeholder="+976 9999 9999"
                    icon={<PhoneIcon />}
                    onChange={(e) => {
                      updatePersonalDetail("phoneNumber", e.target.value);
                    }}
                    required
                  />
                  <NewInput
                    label="Email Address:"
                    value={personalDetail.email}
                    type={"email"}
                    placeholder="example@gmail.com"
                    icon={<EmailIcon />}
                    onChange={(e) => {
                      updatePersonalDetail("email", e.target.value);
                    }}
                    required
                  />
                </div>
                <NewInput
                  label="Date of Birth:"
                  value={personalDetail.dateOfBirth}
                  type={"date"}
                  placeholder="yyyy.mm.dd"
                  onChange={(e) => {
                    updatePersonalDetail("dateOfBirth", e.target.value);
                  }}
                  required
                />
                <SelectNationality
                  value={personalDetail.nationality}
                  onChange={(value: string) =>
                    updatePersonalDetail("nationality", value)
                  }
                />
              </Drawer>
              <Drawer
                title="Departure Detail"
                open={isDepartureDetailDrawerOpen}
                setOpen={setIsDepartureDetailDrawerOpen}
              >
                <div className="flex-1 flex flex-col gap-[6px]">
                  <label className="font-semibold">
                    How many people will travel including you?
                  </label>
                  <div className="p-[9.5px] py-3 flex flex-row items-center justify-center border rounded-2xl">
                    <button
                      className="ripple rounded-full"
                      onClick={() =>
                        updatePersonalDetail(
                          "peopleCount",
                          Number(
                            personalDetail.peopleCount == 1
                              ? 1
                              : personalDetail.peopleCount - 1
                          )
                        )
                      }
                    >
                      <MinusIcon color="#1e1e1e" />
                    </button>
                    <input
                      className="flex-1 text-center outline-none"
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
                    <button
                      className="ripple rounded-full"
                      onClick={() =>
                        updatePersonalDetail(
                          "peopleCount",
                          Number(personalDetail.peopleCount + 1)
                        )
                      }
                    >
                      <PlusIcon color="#1e1e1e" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-[6px]">
                  <label className="font-semibold">
                    Additional Information:
                  </label>
                  <textarea
                    placeholder="Are there anything you would like us to know? Ex. Diet/Food allergies diseases and injuries?"
                    className="min-h-32 p-4 border rounded-xl"
                    value={personalDetail.additionalInformation}
                    onChange={(e) => {
                      updatePersonalDetail(
                        "additionalInformation",
                        e.target.value
                      );
                    }}
                  ></textarea>
                </div>
              </Drawer>
            </div>
          </div>
          <div className="bg-white drop-shadow-card px-4 lg:px-16 relative py-8 md:pt-0">
            <div className="md:sticky md:left-0 md:top-0 flex flex-col gap-4 md:pt-[88px] md:-mt-[88px]">
              <h1 className="text-2xl font-bold lg:text-3xl">
                Request New Departure
              </h1>
              {/* Select Tour  */}
              <div className="md:w-80 flex flex-col gap-[6px]">
                <label className="font-semibold">Choose Tour</label>
                <select
                  name="tours"
                  required
                  className={`text-base px-4 py-3 w-full outline-none border rounded-2xl ${
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
                  {tours?.map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <NewInput
                label="Tour Starting Date"
                value={personalDetail.startingDate}
                required
                onChange={(e) =>
                  updatePersonalDetail("startingDate", e.target.value)
                }
                type={"date"}
                min={new Date().toISOString().split("T")[0]}
              />
              {/* Privacy and Booking button */}
              <div className="flex flex-row w-80 items-center justify-center gap-2">
                <input
                  type="checkbox"
                  required
                  checked={isAgreedToPrivacy}
                  onChange={(e) => {
                    setRequestError(null);
                    setIsAgreedToPrivacy(e.target.checked);
                    Cookies.set("isAgreedToPrivacy", e.target.checked + "");
                  }}
                />
                <div className=" text-wrap">
                  I agree to the{" "}
                  <Link
                    href="/termsandconditions"
                    className="underline font-medium"
                  >
                    Terms of Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacypolicy" className="underline font-medium">
                    Privacy Policy
                  </Link>
                </div>
              </div>
              {requestError && (
                <label className="text-red-600 text-center text-wrap md:w-80">
                  {requestError}
                </label>
              )}
              <button
                className="bg-primary px-4 py-3 width-full text-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
                onClick={requestNewTour}
              >
                {requestLoading ? "Loading" : "Request A New Departure"}
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
      {/* 
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
                      {tours?.map((t) => (
                        <option value={t.id} key={t.id}>
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
                      {selectedTourData?.days} days
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
      </MainLayout> */}
    </>
  );
};

export default NewTour;
