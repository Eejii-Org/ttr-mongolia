"use client";
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
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
const NewTour = () => {
  const [privateTourDetail, setPrivateTourDetail] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    nationality: "",
    dateOfBirth: "",
    peopleCount: 1,
    additionalInformation: "",
    destination: "",
    accomodationPreference: "",
    budgetConsiderations: "",
    additionalRequests: "",
  });
  const [tourDate, setTourDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const updatePrivateTourDetail = (key: string, value: string) => {
    setPrivateTourDetail({ ...privateTourDetail, [key]: value });
  };
  const [requestLoading, setRequestLoading] = useState(false);
  const requestNewTour = async () => {
    setRequestLoading(true);
    try {
      const res = await axios.post(
        "https://ttr-mongolia.vercel.app/api/request-private-tour",
        {
          ...privateTourDetail,
          startingDate: tourDate,
        }
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
      setRequestLoading(false);
      return;
    }
    toast.success("Request has been added successfully");
    setPrivateTourDetail({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      nationality: "",
      dateOfBirth: "",
      peopleCount: 1,
      additionalInformation: "",
      destination: "",
      accomodationPreference: "",
      budgetConsiderations: "",
      additionalRequests: "",
    });
    setRequestLoading(false);
    setTourDate("");
  };

  return (
    <MainLayout>
      <div className="w-screen flex-1 px-3  xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col gap-4 justify-center">
        <div className=" text-2xl font-semibold lg:text-4xl">
          Request Private Tour
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
                    value={privateTourDetail.firstName}
                    placeholder="FirstName"
                    onChange={(e) => {
                      updatePrivateTourDetail("firstName", e.target.value);
                    }}
                    required
                  />
                  <Input
                    type="text"
                    value={privateTourDetail.lastName}
                    placeholder="LastName"
                    onChange={(e) => {
                      updatePrivateTourDetail("lastName", e.target.value);
                    }}
                    required
                  />
                </div>
                <Input
                  type={"tel"}
                  value={privateTourDetail.phoneNumber}
                  placeholder="+976 9999 9999"
                  icon={<PhoneIcon />}
                  onChange={(e) => {
                    updatePrivateTourDetail("phoneNumber", e.target.value);
                  }}
                  required
                />
                <Input
                  value={privateTourDetail.email}
                  type={"email"}
                  placeholder="example@gmail.com"
                  icon={<EmailIcon />}
                  onChange={(e) => {
                    updatePrivateTourDetail("email", e.target.value);
                  }}
                  required
                />
                <SelectNationality
                  value={privateTourDetail.nationality}
                  onChange={(value: string) =>
                    updatePrivateTourDetail("nationality", value)
                  }
                />
                <SelectBirthday
                  value={privateTourDetail.dateOfBirth}
                  onChange={(newDateOfBirth) =>
                    updatePrivateTourDetail("dateOfBirth", newDateOfBirth)
                  }
                />
                <div>
                  <div className="text-base md:text-lg font-semibold">
                    How many people will travel including you?
                  </div>
                  <Input
                    value={privateTourDetail.peopleCount}
                    type={"number"}
                    placeholder="3"
                    onChange={(e) => {
                      updatePrivateTourDetail("peopleCount", e.target.value);
                    }}
                    required
                  />
                </div>
                <textarea
                  placeholder="Additional Information"
                  className="min-h-32 p-4 border flex-1"
                  value={privateTourDetail.additionalInformation}
                  onChange={(e) => {
                    updatePrivateTourDetail(
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
                  Desired Tour Starting Date
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
                <div className="flex flex-col">
                  <div className="text-base md:text-lg font-semibold">
                    Destination(s) in mind
                  </div>
                  <textarea
                    placeholder="Do you have a specific location in mind, or are you open to suggestions?"
                    className=" min-h-32 p-4 border"
                    value={privateTourDetail.destination}
                    required
                    onChange={(e) => {
                      updatePrivateTourDetail("destination", e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="flex flex-col">
                  <div className="text-base md:text-lg font-semibold">
                    Accomodation preference
                  </div>
                  <Input
                    type={"text"}
                    value={privateTourDetail.accomodationPreference}
                    placeholder="More luxury or more local homestays?"
                    onChange={(e) => {
                      updatePrivateTourDetail(
                        "accomodationPreference",
                        e.target.value
                      );
                    }}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <div className="text-base md:text-lg font-semibold">
                    Budget considerations
                  </div>
                  <Input
                    type={"text"}
                    value={privateTourDetail.budgetConsiderations}
                    placeholder="Do you have a specific budget in mind?"
                    onChange={(e) => {
                      updatePrivateTourDetail(
                        "budgetConsiderations",
                        e.target.value
                      );
                    }}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <div className="text-base md:text-lg font-semibold">
                    Additional Requests
                  </div>
                  <textarea
                    placeholder="Do you have any specific or additional requests?"
                    className=" min-h-32 p-4 border"
                    value={privateTourDetail.additionalRequests}
                    required
                    onChange={(e) => {
                      updatePrivateTourDetail(
                        "additionalRequests",
                        e.target.value
                      );
                    }}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold ripple"
              >
                {requestLoading ? "Loading" : "Request A Private Departure"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default NewTour;
