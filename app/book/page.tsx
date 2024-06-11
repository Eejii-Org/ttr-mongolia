"use client";
import { supabase } from "@/utils/supabase/client";
import {
  DurationIcon,
  EmailIcon,
  MainLayout,
  MinusIcon,
  NewInput,
  PhoneIcon,
  PlusIcon,
  SelectNationality,
  StorageImage,
  CalendarIcon,
  Visa,
  MasterCard,
  AmericanExpress,
  UnionPay,
  MNT,
  JCB,
  Drawer,
} from "@components";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import _ from "lodash";

type TourType = {
  title: string;
  originalPrice: PriceType[];
  days: number;
  images: string[];
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
  const [isAgreedToPrivacy, setIsAgreedToPrivacy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const availableTourId = searchParams.get("availableTourId");
  const router = useRouter();
  const [paymentType, setPaymentType] = useState<"half" | "full" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit-card" | "invoice" | null
  >(null);
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

  const [bookLoading, setBookLoading] = useState(false);

  const [isPersonalDetailDrawerOpen, setIsPersonalDetailDrawerOpen] =
    useState(true);
  const [isDepartureDetailDrawerOpen, setIsDepartureDetailDrawerOpen] =
    useState(true);
  const [isPaymentMethodDrawerOpen, setIsPaymentMethodDrawerOpen] =
    useState(true);

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

  const totalAmount = useMemo(() => {
    if (!pricePerPerson) return null;
    return personalDetail.peopleCount * pricePerPerson;
  }, [personalDetail, pricePerPerson]);

  const updatePersonalDetail = (key: string, value: string | number) => {
    setBookingError(null);
    setPersonalDetail({ ...personalDetail, [key]: value });
  };

  const book = async () => {
    if (!checkInputs()) return;
    if (!availableTour) {
      setBookingError(
        "Selected tour was not found. Please contact us for further inquiry. Thank you"
      );
      return;
    }
    if (!totalAmount) {
      setBookingError(
        "Total Amount Couldn't be calculated. Please contact us for further inquiry. Thank you"
      );
      return;
    }
    setBookLoading(true);
    const res = await axios.post(`/api/request-invoice`, {
      availableTourId,
      personalDetail,
      paymentMethod,
      paymentType,
      tourTitle: tour?.title,
      startingDate: availableTour.date,
      deposit: paymentType == "full" ? totalAmount : totalAmount * 0.5,
      // deposit: "0.01",
      pax: pricePerPerson,
      total: totalAmount,
    });

    if (res.status !== 200) {
      setBookingError(
        "Unexpected error. Please contact us for further inquiry. Thank you"
      );
      setBookLoading(false);
      return;
    }
    if (paymentMethod == "invoice") {
      router.push(`/book/result/${res.data.transactionId}`);
      return;
    }
    setBookLoading(false);
    router.push(`/book/payment?invoice=${res.data.invoice}`);
  };

  const checkInputs = () => {
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
        setBookingError("Please fill out all of our inputs in form");
        return false;
      }
    }
    if (!paymentMethod || !paymentType) {
      setBookingError("Please select payment");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const getIsAgreedToPrivacy = () => {
      const isAgreed = Cookies.get("isAgreedToPrivacy");
      setIsAgreedToPrivacy(isAgreed == "true" ? true : false);
    };
    getIsAgreedToPrivacy();
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
        .select("title, originalPrice, days, images")
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
  // const dates = useMemo(() => {
  //   if (!availableTour || !tour) return null;
  //   const startingDate = new Date(availableTour.date);
  //   let endingDate = new Date(availableTour.date);
  //   endingDate.setDate(startingDate.getDate() + tour?.days - 1);
  //   return {
  //     startingDate: {
  //       day: startingDate.toLocaleString("default", { weekday: "short" }),
  //       date:
  //         startingDate.toLocaleString("default", { month: "long" }) +
  //         " " +
  //         startingDate.getDate() +
  //         " " +
  //         startingDate.getFullYear(),
  //     },
  //     endingDate: {
  //       day: endingDate.toLocaleString("default", { weekday: "short" }),
  //       date:
  //         endingDate.toLocaleString("default", { month: "long" }) +
  //         " " +
  //         endingDate.getDate() +
  //         " " +
  //         endingDate.getFullYear(),
  //     },
  //   };
  // }, [availableTour]);

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
      <div className="flex flex-col md:flex-row relative bg-[#F8FAFC]">
        <div
          className="flex-1 relative px-4"
          style={{
            backgroundImage: "url(/static/book-bg.png)",
            backgroundSize: "150% 150%",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-[764px] mx-auto my-8 flex flex-col gap-4 relative z-10">
            <h1 className="text-2xl font-bold lg:text-3xl">Booking Info</h1>
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
                <label className="font-semibold">Additional Information:</label>
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
            <Drawer
              title="Payment Method"
              open={isPaymentMethodDrawerOpen}
              setOpen={setIsPaymentMethodDrawerOpen}
            >
              <DetailCard
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                setBookingError={setBookingError}
                tourDate={availableTour.date}
              />
            </Drawer>
          </div>
        </div>
        <div className="bg-white drop-shadow-card px-4 lg:px-16 relative py-8 md:pt-0">
          {/* <div className="w-80"></div> */}
          <div className="md:sticky md:left-0 md:top-0 flex flex-col gap-4 md:pt-[88px] md:-mt-[88px]">
            <h1 className="text-2xl font-bold lg:text-3xl">Tour Detail</h1>
            {/* Tour Card */}
            <div className="md:w-80 drop-shadow-card">
              <div className="relative md:w-[320px] h-[220px] rounded-t-2xl overflow-hidden">
                <StorageImage
                  fill
                  alt="tour-image"
                  className="object-cover"
                  src={tour.images[0]}
                />
              </div>
              <div className="p-5 pt-4 border border-t-0 rounded-b-xl flex flex-col gap-3">
                <h3 className="text-lg font-bold">{tour.title}</h3>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-row items-center justify-center text-sm font-semibold gap-1">
                    <CalendarIcon />
                    {months[Number(availableTour.date?.split("-")[1]) - 1]}{" "}
                    {availableTour.date?.split("-")[2]}
                  </div>
                  <div className="bg-black/20 w-[2px] rounded my-1" />
                  <div className="flex flex-row justify-center text-sm items-center font-semibold gap-1">
                    <DurationIcon />
                    {tour.days}
                    {tour.days == 1 ? " day" : " days"}
                  </div>
                </div>
              </div>
            </div>
            {/* Pax and pricing detail */}
            <div className="pt-4 md:pt-0">
              <div className="flex flex-row justify-between">
                <label className="text-[#6D6D6D] font-medium">Pax:</label>
                <p className="font-semibold">${pricePerPerson?.toFixed(2)}</p>
              </div>
              <div className="flex justify-end">
                <p className="text-[#6D6D6D]">
                  x{personalDetail.peopleCount} person
                </p>
              </div>
            </div>
            <hr />
            <div>
              <div className="flex flex-row justify-between">
                <label className="text-[#6D6D6D] font-medium">Total:</label>
                <p className="font-semibold">${totalAmount?.toFixed(2)}</p>
              </div>
              {paymentType == "half" && (
                <div className="flex flex-row justify-between">
                  <label className="text-[#6D6D6D] font-medium">
                    50% Deposit:
                  </label>
                  <p className="font-semibold">
                    ${((totalAmount || 0) * 0.5).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            {/* Privacy and Booking button */}
            <div className="flex flex-row w-80 items-center justify-center gap-2">
              <input
                type="checkbox"
                required
                checked={isAgreedToPrivacy}
                onChange={(e) => {
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
            {bookingError && (
              <label className="text-red-600 text-center">{bookingError}</label>
            )}

            <button
              className="bg-primary px-4 py-3 width-full text-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
              onClick={() => book()}
            >
              {bookLoading ? "Loading" : "Book"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DetailCard = ({
  paymentType,
  setPaymentType,
  paymentMethod,
  setPaymentMethod,
  setBookingError,
  tourDate,
}: {
  paymentType: "half" | "full" | null;
  setPaymentType: Dispatch<SetStateAction<"half" | "full" | null>>;
  paymentMethod: "credit-card" | "invoice" | null;
  setPaymentMethod: Dispatch<SetStateAction<"credit-card" | "invoice" | null>>;
  setBookingError: Dispatch<SetStateAction<string | null>>;
  tourDate: string;
}) => {
  const isOneMonthApartFromToday = useMemo(() => {
    const date = new Date(tourDate);
    const today = new Date();
    const oneMonthAfter = new Date(today);
    oneMonthAfter.setMonth(today.getMonth() + 1);
    return oneMonthAfter <= date;
  }, [tourDate]);
  return (
    <div className="flex flex-col">
      {/* Payment Type */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div
          className={`flex-1 flex flex-row items-center px-4 py-3 rounded-2xl gap-4 ${
            paymentType == "half" ? "border border-primary" : "border"
          } ${
            isOneMonthApartFromToday
              ? "opacity-100  cursor-pointer"
              : "opacity-50"
          }`}
          onClick={() => {
            if (!isOneMonthApartFromToday) return;
            setPaymentType("half");
          }}
        >
          <div className="p-1 border border-primary bg-quinary rounded-full">
            <div
              className={`w-4 h-4 ${
                paymentType == "half" ? "bg-primary" : "bg-transparent"
              } transition-all rounded-full`}
            />
          </div>
          <div className="flex-1 h-full flex flex-col gap-2">
            <h3 className="text-secondary font-bold text-base">50% Deposit</h3>
            <p className="text-[#6D6D6D]">
              Pay 50% of the total amount now, and the remaining 50% later.
            </p>
          </div>
        </div>
        <div
          className={`flex-1 flex flex-row items-center px-4 py-3 rounded-2xl gap-4 cursor-pointer ${
            paymentType == "full" ? "border border-primary" : "border"
          }`}
          onClick={() => setPaymentType("full")}
        >
          <div className="p-1 border border-primary bg-quinary rounded-full">
            <div
              className={`w-4 h-4 ${
                paymentType == "full" ? "bg-primary" : "bg-transparent"
              } transition-all rounded-full`}
            />
          </div>
          <div className="flex-1 h-full flex flex-col gap-2">
            <h3 className="text-secondary font-bold text-base">Full Payment</h3>
            <p className="text-[#6D6D6D]">Pay the total amount now</p>
          </div>
        </div>
      </div>
      <p className=" text-[#6D6D6D] pt-2 pb-6">
        50% Deposit is available only if there is more than one month remaining
        before the due date.
      </p>
      {/* Payment Method */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div
          className={`flex-1 flex flex-row items-center px-4 py-3 rounded-2xl gap-4 cursor-pointer ${
            paymentMethod == "credit-card"
              ? "border border-[#2CB742]"
              : "border"
          }`}
          onClick={() => setPaymentMethod("credit-card")}
        >
          <div className="p-1 border border-[#2CB742] bg-quinary rounded-full">
            <div
              className={`w-4 h-4 ${
                paymentMethod == "credit-card"
                  ? "bg-[#2CB742]"
                  : "bg-transparent"
              } transition-all rounded-full`}
            />
          </div>
          <div className="flex-1 h-full flex flex-col gap-2">
            <h3 className="text-secondary font-bold text-base">
              <span className="text-[#2CB742]">Recommended: </span>
              Credit Card
            </h3>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              <Visa color="black" />
              <MasterCard />
              <AmericanExpress />
              <UnionPay />
              <MNT />
              <JCB />
            </div>
            {/* <p className="text-[#6D6D6D]">Pay the total amount now</p> */}
          </div>
        </div>
        <div
          className={`flex-1 flex flex-row items-center px-4 py-3 rounded-2xl gap-4 cursor-pointer ${
            paymentMethod == "invoice" ? "border border-[#2CB742]" : "border"
          }`}
          onClick={() => {
            setPaymentMethod("invoice");
            setBookingError(null);
          }}
        >
          <div className="p-1 border border-[#2CB742] bg-quinary rounded-full">
            <div
              className={`w-4 h-4 ${
                paymentMethod == "invoice" ? "bg-[#2CB742]" : "bg-transparent"
              } transition-all rounded-full`}
            />
          </div>
          <div className="flex-1 h-full flex flex-col gap-2">
            <h3 className="text-secondary font-bold text-base">Invoice</h3>
            <p className="text-[#6D6D6D]">
              We will shortly email you the invoice with the payment details.
            </p>
          </div>
        </div>
        {/* <div
          className={`flex-1 flex flex-row items-center px-4 py-3 rounded-2xl gap-4 cursor-pointer ${
            paymentMethod == "cash" ? "border border-[#2CB742]" : "border"
          }`}
          onClick={() => setPaymentMethod("cash")}
        >
          <div className="p-1 border border-[#2CB742] bg-quinary rounded-full">
            <div
              className={`w-4 h-4 ${
                paymentMethod == "cash" ? "bg-[#2CB742]" : "bg-transparent"
              } transition-all rounded-full`}
            />
          </div>
          <div className="flex-1 h-full flex flex-col gap-2">
            <h3 className="text-secondary font-bold text-base">Cash</h3>
            <p className="text-[#6D6D6D]">
              Not recommended. This option will be available at our office or at
              the time of service delivery. Please contact our support team to
              arrange cash payments.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Booking;

{
  /* <div className="w-screen flex-1 px-3  xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col gap-4 justify-center">
        <div className=" text-2xl font-semibold lg:text-3xl">{tour?.title}</div>
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
                    {tour?.days} days
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
                  <div className="flex flex-row items-center justify-center gap-2">
                    <input
                      type="checkbox"
                      required
                      checked={isAgreedToPrivacy}
                      onChange={(e) => {
                        setIsAgreedToPrivacy(e.target.checked);
                        Cookies.set("isAgreedToPrivacy", e.target.checked + "");
                      }}
                    />
                    <div>
                      I agree to the{" "}
                      <Link
                        href="/termsandconditions"
                        className="underline font-medium"
                      >
                        Terms of Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacypolicy"
                        className="underline font-medium"
                      >
                        Privacy Policy
                      </Link>
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
      </div> */
}
