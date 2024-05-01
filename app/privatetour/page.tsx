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
  const [personalDetail, setPersonalDetail] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    nationality: "",
    dateOfBirth: "",
    peopleCount: 1,
    additionalInformation: "",
    tourPlan: "",
  });
  const [tourDate, setTourDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const updatePersonalDetail = (key: string, value: string) => {
    setPersonalDetail({ ...personalDetail, [key]: value });
  };
  const [requestLoading, setRequestLoading] = useState(false);
  const requestNewTour = async () => {
    setRequestLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/request-private-tour",
        {
          ...personalDetail,
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
    setPersonalDetail({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      nationality: "",
      dateOfBirth: "",
      peopleCount: 1,
      additionalInformation: "",
      tourPlan: "",
    });
    setRequestLoading(false);
    setTourDate("");
  };

  return (
    <MainLayout>
      <div className="w-screen flex-1 px-3 pt-16 md:pt-14 xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col gap-4 justify-center">
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
              <div className=" bg-quinary p-3 md:p-4 flex flex-col gap-2">
                <div className="text-lg font-semibold lg:text-xl">
                  Tour Plan
                </div>
                <textarea
                  placeholder="What's on your mind?"
                  className=" min-h-32 p-4 border"
                  value={personalDetail.tourPlan}
                  required
                  onChange={(e) => {
                    updatePersonalDetail("tourPlan", e.target.value);
                  }}
                ></textarea>
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
