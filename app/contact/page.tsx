"use client";
import {
  EmailIcon,
  Input,
  MainLayout,
  PhoneIcon,
  SelectBirthday,
  SelectNationality,
} from "@components";
import { useState } from "react";
import { toast } from "react-toastify";

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

  const updateContact = (key: string, value: string) => {
    setContact({ ...contact, [key]: value });
  };
  const contactSubmit = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/contact", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(contact), // body data type must match "Content-Type" header
    });
    const result = await response.json();
    if (result.adminInfo.response.includes("OK")) {
      toast.success("Successfully sent");
    } else {
      toast.error(
        "Encountered an error, please contact us through our email and WhatsApp"
      );
    }
    setLoading(false);
  };
  return (
    <MainLayout>
      <div className="w-screen flex-1 px-3 pt-16 md:pt-14 container mx-auto flex flex-col gap-4 justify-center">
        <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
          <div className="p-3 md:p-4 rounded-xl flex-1 flex flex-col gap-3 justify-between">
            <div className="text-2xl font-semibold lg:text-4xl">Contact Us</div>
            <div className="text-base lg:text-lg">
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
          </div>
          <div className="bg-quinary p-3 md:p-4 rounded-xl flex-1 flex flex-col gap-3">
            <div className="text-xl font-semibold pb-2 lg:text-3xl">
              You can reach us any time
            </div>
            <form
              className="flex flex-col gap-3 md:gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!loading) contactSubmit();
              }}
            >
              <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
                <Input
                  type="text"
                  value={contact.firstName}
                  placeholder="FirstName"
                  onChange={(e) => {
                    updateContact("firstName", e.target.value);
                  }}
                  required
                />
                <Input
                  type="text"
                  value={contact.lastName}
                  placeholder="LastName"
                  onChange={(e) => {
                    updateContact("lastName", e.target.value);
                  }}
                  required
                />
              </div>
              <Input
                type={"tel"}
                value={contact.phoneNumber}
                placeholder="+976 9999 9999"
                icon={<PhoneIcon />}
                onChange={(e) => {
                  updateContact("phoneNumber", e.target.value);
                }}
                required
              />
              <Input
                value={contact.email}
                type={"email"}
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
              <textarea
                placeholder="How can we help?"
                className=" min-h-32 p-4 border"
                value={contact.description}
                onChange={(e) => {
                  updateContact("description", e.target.value);
                }}
              ></textarea>
              <button
                type="submit"
                className="bg-primary px-4 py-3 width-full text-center items-center flex justify-center text-secondary whitespace-nowrap font-bold ripple rounded"
              >
                {loading ? <span className="loader h-6 w-6"></span> : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
