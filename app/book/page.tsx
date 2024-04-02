"use client";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowRight,
  ChevronDownIcon,
  EmailIcon,
  Footer,
  Header,
  Input,
  MainLayout,
  PhoneIcon,
} from "@components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useMemo, useState } from "react";

type TourType = {
  title: string;
  originalPrice: number;
  days: number;
  nights: number;
};

type AvailableTourType = {
  tourId: number;
  price: number;
  date: string;
};

const Booking = ({
  searchParams,
}: {
  searchParams: { availableTourId: string };
}) => {
  const [tour, setTour] = useState<TourType | null>(null);
  const [availableTour, setAvailableTour] = useState<AvailableTourType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { availableTourId } = searchParams;
  const [personalDetail, setPersonalDetail] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    nationality: "",
    dateOfBirth: "",
    peopleCount: 1,
  });

  const updatePersonalDetail = (key: string, value: string) => {
    setPersonalDetail({ ...personalDetail, [key]: value });
  };

  const book = () => {
    console.log("book", personalDetail);
  };

  useEffect(() => {
    const getTour = async () => {
      if (!availableTourId) {
        router.push("/");
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("availableTours")
        .select("tourId, price, date")
        .eq("id", availableTourId);
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      if (data.length == 0) {
        setTour(null);
        setLoading(false);
        return;
      }
      const { data: tourData, error: err } = await supabase
        .from("tours")
        .select("title, originalPrice, days, nights")
        .eq("id", data[0].tourId);
      if (err) {
        console.error(err);
        setLoading(false);
        return;
      }
      if (tourData.length == 0) {
        setAvailableTour(null);
        setLoading(false);
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
  return (
    <MainLayout>
      <div className="w-screen flex-1 px-3 pt-14 xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col gap-4 justify-center">
        <div className=" text-2xl font-semibold lg:text-4xl">{tour?.title}</div>
        <div className="flex flex-col md:flex-row gap-4 h-full">
          <form className="flex flex-1 flex-col gap-4">
            <div className="bg-quinary p-3 md:p-4 rounded-xl flex-1 flex flex-col gap-3">
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
                  onChange={(e) =>
                    updatePersonalDetail("dateOfBirth", e.target.value)
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
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold rounded-xl"
              onClick={(e) => {
                e.preventDefault();
                book();
              }}
            >
              Book
            </button>
          </form>
          <div className="flex-1 flex flex-col gap-4">
            <div className=" bg-quinary p-3 md:p-4 rounded-xl flex flex-col gap-2">
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
            <div className="bg-quinary p-4 rounded-xl flex flex-col gap-2 flex-1">
              <iframe
                src={`https://ecommerce.golomtbank.com/payment/en/invoice`}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const SelectNationality = ({
  onChange,
  value,
}: {
  onChange: (arg0: string) => void;
  value: string;
}) => {
  return (
    <div className="relative">
      <div className="absolute left-[100%] top-[50%] -translate-y-3 -translate-x-9">
        <ChevronDownIcon />
      </div>
      <select
        name="nationality"
        required
        className={`text-base px-4 py-3 w-full rounded-xl outline-none border ${
          value == "" ? "text-[#c1c1c1]" : "text-secondary"
        }`}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
      >
        <option value="" className="text-quaternary">
          Where are you from?
        </option>
        {countryOptions.map((country, key) => (
          <option value={country.toLocaleLowerCase()} key={country + key}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

const SelectBirthday = ({
  onChange,
  value,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
}) => {
  return (
    <div>
      <div className="text-base font-semibold lg:text-lg">Date of Birth</div>
      <input
        value={value}
        required
        onChange={onChange}
        type={"date"}
        className="text-base px-4 py-3 w-full rounded-xl outline-none border "
      />
    </div>
  );
};

const countryOptions = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguans",
  "Argentinean",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Barbudans",
  "Batswana",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Brazilian",
  "British",
  "Bruneian",
  "Bulgarian",
  "Burkinabe",
  "Burmese",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comoran",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djibouti",
  "Dominican",
  "Dutch",
  "East Timorese",
  "Ecuadorean",
  "Egyptian",
  "Emirian",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinea-Bissauan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Herzegovinian",
  "Honduran",
  "Hungarian",
  "Icelander",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Kittian and Nevisian",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourger",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivan",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Moroccan",
  "Mosotho",
  "Motswana",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepalese",
  "New Zealander",
  "Ni-Vanuatu",
  "Nicaraguan",
  "Nigerien",
  "North Korean",
  "Northern Irish",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Salvadoran",
  "Samoan",
  "San Marinese",
  "Sao Tomean",
  "Saudi",
  "Scottish",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovakian",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "South Korean",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamer",
  "Swazi",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Tongan",
  "Trinidadian or Tobagonian",
  "Tunisian",
  "Turkish",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbekistani",
  "Venezuelan",
  "Vietnamese",
  "Welsh",
  "Yemenite",
  "Zambian",
  "Zimbabwean",
];

export default Booking;
