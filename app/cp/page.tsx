"use client";
import { EmailIcon, MainLayout, NewInput, PhoneIcon } from "@components";
import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

const CP = ({ searchParams }: { searchParams: { amount: string } }) => {
  const { amount } = searchParams;
  const [isAgreedToPrivacy, setIsAgreedToPrivacy] = useState(false);
  const [personalDetail, setPersonalDetail] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const updatePersonalDetail = (key: string, value: string | number) => {
    setError(null);
    setPersonalDetail({ ...personalDetail, [key]: value });
  };
  const checkInputs = () => {
    type keysType = "firstName" | "lastName" | "phoneNumber" | "email";
    const keysToCheck: keysType[] = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
    ];
    for (const key of keysToCheck) {
      if (personalDetail[key] === "") {
        setError("Please fill out all of our inputs in form");
        return false;
      }
    }
    if (!isAgreedToPrivacy) {
      setError("Please agree to the terms of conditions and privacy policty");
      return false;
    }
    return true;
  };
  const pay = async () => {
    if (!checkInputs()) return;
    setError(null);
    if (Number(amount) <= 0 || !_.isNumber(Number(amount))) {
      setError("Not a Number");
      return;
    }
    setPayLoading(true);
    const res = await axios.post(`/api/custom-invoice`, {
      personalDetail: personalDetail,
      deposit: amount,
      availableTourId: -1,
    });
    if (res.status !== 200) {
      setError(res.statusText);
    }
    setPayLoading(false);
    router.push(`/book/payment?invoice=${res.data.invoice}`);
  };
  if (!amount) {
    redirect("/");
    return;
  }
  return (
    <MainLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className=" flex flex-col gap-4 md:w-auto md:min-w-[600px] px-4">
          <h1 className="font-semibold text-2xl">Custom Payment</h1>
          <div className="text-xl">
            <span className="font-semibold">Amount: </span>${amount}
          </div>
          <div className="flex gap-4 md:gap-6 flex-col md:flex-row w-full">
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
          {/* Privacy and Booking button */}
          <div className="flex flex-row items-center justify-center gap-2">
            <input
              type="checkbox"
              required
              checked={isAgreedToPrivacy}
              onChange={(e) => {
                setError(null);
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
          {error && (
            <label className="font-semibold text-center text-red-600">
              Error: {error}
            </label>
          )}
          <div className="w-full flex justify-center">
            <button
              onClick={pay}
              className="bg-primary px-4 py-3 width-full text-center text-white whitespace-nowrap font-bold ripple rounded-2xl w-full md:w-auto md:min-w-80"
            >
              {payLoading ? "Loading" : "Pay"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CP;
