"use client";
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
import { useState } from "react";
const NewTour = () => {
  const [isAgreedToPrivacy, setIsAgreedToPrivacy] = useState(false);
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
    startingDate: "",
  });
  // const [tourDate, setTourDate] = useState(
  //   new Date().toISOString().split("T")[0]
  // );
  const [modalMessage, setModalMessage] = useState<null | "Success" | "Fail">(
    null
  );

  const [requestLoading, setRequestLoading] = useState(false);

  const [isPersonalDetailDrawerOpen, setIsPersonalDetailDrawerOpen] =
    useState(true);
  const [isDepartureDetailDrawerOpen, setIsDepartureDetailDrawerOpen] =
    useState(true);

  const [requestError, setRequestError] = useState<string | null>(null);

  const updatePrivateTourDetail = (key: string, value: string | number) => {
    setRequestError(null);
    setPrivateTourDetail({ ...privateTourDetail, [key]: value });
  };
  const requestPrivateTour = async () => {
    if (!checkInputs()) return;
    setRequestLoading(true);
    try {
      const res = await axios.post(`/api/request-private-tour`, {
        ...privateTourDetail,
      });
    } catch (err: any) {
      console.error(err);
      setModalMessage("Fail");
      setRequestLoading(false);
      return;
    }
    setModalMessage("Success");
    setRequestLoading(false);
  };
  const checkInputs = () => {
    type keysType =
      | "firstName"
      | "lastName"
      | "phoneNumber"
      | "email"
      | "nationality"
      | "dateOfBirth"
      | "peopleCount"
      | "destination"
      | "accomodationPreference"
      | "budgetConsiderations";
    const keysToCheck: keysType[] = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "nationality",
      "dateOfBirth",
      "peopleCount",
      "destination",
      "accomodationPreference",
      "budgetConsiderations",
    ];
    for (const key of keysToCheck) {
      if (privateTourDetail[key] === "") {
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

  return (
    <>
      <div className={modalMessage == null ? "hidden" : "flex"}>
        <div
          className={`fixed top-0 left-0 w-screen h-screen bg-black/20 z-50`}
          onClick={() => setModalMessage(null)}
        ></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-96 p-4 pt-8 flex flex-col gap-4 rounded-2xl items-center z-50">
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
                  requestPrivateTour();
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
                    value={privateTourDetail.firstName}
                    placeholder="John"
                    onChange={(e) => {
                      updatePrivateTourDetail("firstName", e.target.value);
                    }}
                    required
                  />
                  <NewInput
                    type="text"
                    label="Last Name:"
                    value={privateTourDetail.lastName}
                    placeholder="Doe"
                    onChange={(e) => {
                      updatePrivateTourDetail("lastName", e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                  <NewInput
                    label="Phone Number:"
                    type={"tel"}
                    value={privateTourDetail.phoneNumber}
                    placeholder="+976 9999 9999"
                    icon={<PhoneIcon />}
                    onChange={(e) => {
                      updatePrivateTourDetail("phoneNumber", e.target.value);
                    }}
                    required
                  />
                  <NewInput
                    label="Email Address:"
                    value={privateTourDetail.email}
                    type={"email"}
                    placeholder="example@gmail.com"
                    icon={<EmailIcon />}
                    onChange={(e) => {
                      updatePrivateTourDetail("email", e.target.value);
                    }}
                    required
                  />
                </div>
                <NewInput
                  label="Date of Birth:"
                  value={privateTourDetail.dateOfBirth}
                  type={"date"}
                  placeholder="yyyy.mm.dd"
                  onChange={(e) => {
                    updatePrivateTourDetail("dateOfBirth", e.target.value);
                  }}
                  required
                />
                <SelectNationality
                  value={privateTourDetail.nationality}
                  onChange={(value: string) =>
                    updatePrivateTourDetail("nationality", value)
                  }
                />
                <div className="flex-1 flex flex-col gap-[6px]">
                  <label className="font-semibold">
                    Additional Information:
                  </label>
                  <textarea
                    placeholder="Are there anything you would like us to know? Ex. Diet/Food allergies diseases and injuries?"
                    className="min-h-32 p-4 border rounded-xl"
                    value={privateTourDetail.additionalInformation}
                    onChange={(e) => {
                      updatePrivateTourDetail(
                        "additionalInformation",
                        e.target.value
                      );
                    }}
                  ></textarea>
                </div>
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
                        updatePrivateTourDetail(
                          "peopleCount",
                          Number(
                            privateTourDetail.peopleCount == 1
                              ? 1
                              : privateTourDetail.peopleCount - 1
                          )
                        )
                      }
                    >
                      <MinusIcon color="#1e1e1e" />
                    </button>
                    <input
                      className="flex-1 text-center outline-none"
                      value={privateTourDetail.peopleCount}
                      type={"number"}
                      min={1}
                      placeholder="3"
                      onChange={(e) => {
                        updatePrivateTourDetail(
                          "peopleCount",
                          Number(e.target.value)
                        );
                      }}
                      required
                    />
                    <button
                      className="ripple rounded-full"
                      onClick={() =>
                        updatePrivateTourDetail(
                          "peopleCount",
                          Number(privateTourDetail.peopleCount + 1)
                        )
                      }
                    >
                      <PlusIcon color="#1e1e1e" />
                    </button>
                  </div>
                </div>
                <NewInput
                  label="Desired Tour Starting Date:"
                  value={privateTourDetail.startingDate}
                  type={"date"}
                  placeholder="yyyy.mm.dd"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    updatePrivateTourDetail("startingDate", e.target.value);
                  }}
                  required
                />
                <div className="flex-1 flex flex-col gap-[6px]">
                  <label className="font-semibold">
                    Destination(s) in mind:
                  </label>
                  <textarea
                    placeholder="Do you have a specific location in mind, or are you open to suggestions?"
                    className="min-h-32 p-4 border rounded-xl"
                    value={privateTourDetail.destination}
                    onChange={(e) => {
                      updatePrivateTourDetail("destination", e.target.value);
                    }}
                  ></textarea>
                </div>
                <NewInput
                  label="Accomodation preference:"
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
                <NewInput
                  label="Budget considerations"
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
                <div className="flex-1 flex flex-col gap-[6px]">
                  <label className="font-semibold">Additional Requests</label>
                  <textarea
                    placeholder="Do you have any specific or additional requests?"
                    className="min-h-32 p-4 border rounded-xl"
                    value={privateTourDetail.additionalRequests}
                    onChange={(e) => {
                      updatePrivateTourDetail(
                        "additionalRequests",
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
                Request Private Tour
              </h1>
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
                onClick={requestPrivateTour}
              >
                {requestLoading ? "Loading" : "Request A Private Departure"}
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
      {/* <MainLayout>
        <div className="w-screen flex-1 px-3  xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col gap-4 justify-center">
          <div className=" text-2xl font-semibold lg:text-4xl">
            Request Private Tour
          </div>
          <form
            className="flex flex-1 flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              requestPrivateTour();
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
      </MainLayout> */}
    </>
  );
};

export default NewTour;
