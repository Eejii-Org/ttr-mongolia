"use client";
import {
  BigErrorIcon,
  BigSuccessIcon,
  EmailIcon,
  MainLayout,
  NewInput,
  PhoneIcon,
  SelectBirthday,
  SelectNationality,
} from "@components";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";

const Contact = () => {
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    dateOfBirth: "2000-1-1",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<null | "Success" | "Fail">(
    null
  );
  const updateContact = (key: string, value: string) => {
    setContact({ ...contact, [key]: value });
  };
  const contactSubmit = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`api/contact`, contact);
      if (result.data.adminInfo.response.includes("OK")) {
        setModalMessage("Success");
      } else {
        setModalMessage("Fail");
      }
    } catch (e) {
      console.error(e);
      setModalMessage("Fail");
    }
    setLoading(false);
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
                ? "There was a problem sending your contact information. Please try again later."
                : "Your message has been successfully sent."}
            </h3>
            <button
              className="py-3 mt-3 bg-primary rounded w-full font-bold ripple"
              onClick={() => {
                if (modalMessage == "Fail") {
                  contactSubmit();
                }
                setModalMessage(null);
              }}
            >
              {modalMessage == "Fail" ? "Try Again" : "Done"}
            </button>
          </div>
        </div>
      </div>
      {/* <div
        style={{
          backgroundImage: "url(/static/book-bg.png)",
          backgroundSize: "150% 150%",
          backgroundPosition: "center",
          width: "100%",
        }}
      > */}
      <MainLayout>
        <div className="w-screen flex-1 px-3 container mx-auto flex flex-col gap-4 justify-center ">
          <div className="flex flex-col md:flex-row gap-4 h-full">
            <div
              className="p-4 md:p-6 rounded-xl flex-1 flex flex-col gap-3 justify-center text-black"
              style={{
                backgroundImage: "url(/static/book-bg.png)",
                // backgroundSize: "150% 150%",
                backgroundPosition: "center",
              }}
            >
              <div className="text-2xl font-semibold lg:text-4xl  pb-8">
                Contact Us
              </div>
              <div className="text-base lg:text-lg pb-8">
                Email, call, or complete the form to learn how TTR Mongolia can
                solve your problem
              </div>
              <a className="underline" href="mailto:info@ttrmongolia.com">
                info@ttrmongolia.com
              </a>
              <a className="underline" href="tel:+97670141001">
                +976 7014-1001
              </a>
              <div>
                TTR Mongolia LLC, 1st Floor,
                <br />
                Express Tower Chingeltei District,
                <br />
                Ulaanbaatar, Mongolia
              </div>
              <div className="flex justify-center items-center pt-10">
                <Image src="/static/ttrmongolia_location.png" alt="TTR Mongolia" width={1000} height={500}/>
              </div>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-xl flex-1 flex flex-col gap-3">
              {/* <div className="text-xl font-semibold pb-2 lg:text-2xl">
                You can reach us any time
              </div> */}
              <form
                className="flex flex-col gap-3 md:gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!loading) contactSubmit();
                }}
              >
                <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
                  <NewInput
                    type="text"
                    value={contact.firstName}
                    placeholder="John"
                    label="First Name:"
                    onChange={(e) => {
                      updateContact("firstName", e.target.value);
                    }}
                    required
                  />
                  <NewInput
                    type="text"
                    value={contact.lastName}
                    placeholder="Doe"
                    label="Last Name:"
                    onChange={(e) => {
                      updateContact("lastName", e.target.value);
                    }}
                    required
                  />
                </div>
                <NewInput
                  type={"tel"}
                  value={contact.phoneNumber}
                  label="Phone Number:"
                  placeholder="+976 9999 9999"
                  icon={<PhoneIcon />}
                  onChange={(e) => {
                    updateContact("phoneNumber", e.target.value);
                  }}
                  required
                />
                <NewInput
                  value={contact.email}
                  type={"email"}
                  label="Email:"
                  placeholder="example@gmail.com"
                  icon={<EmailIcon />}
                  onChange={(e) => {
                    updateContact("email", e.target.value);
                  }}
                  required
                />
                <SelectNationality
                  value={contact.nationality}
                  onChange={(value) => updateContact("nationality", value)}
                />
                <SelectBirthday
                  value={contact.dateOfBirth}
                  onChange={(value) => updateContact("dateOfBirth", value)}
                />
                <div className="flex flex-col gap-[6px]">
                  <label className="font-semibold">How can we help?</label>
                  <textarea
                    placeholder="How can we help?"
                    className=" min-h-32 p-4 border rounded-2xl"
                    value={contact.description}
                    onChange={(e) => {
                      updateContact("description", e.target.value);
                    }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-primary px-4 py-3 width-full text-center items-center flex justify-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
                >
                  {loading ? (
                    <span className="loader h-6 w-6"></span>
                  ) : (
                    "Contact"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
      {/* </div> */}
    </>
  );
};

export default Contact;
