"use client";
import { CarRentalRequestType, RentingCarType } from "@/utils";
import supabase from "@/utils/supabase/client";
import {
  BigErrorIcon,
  BigSuccessIcon,
  Drawer,
  EmailIcon,
  MainLayout,
  NewInput,
  PhoneIcon,
  PriceIcon,
  StorageImage,
} from "@components";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Link from "next/link";
import dayjs from "dayjs";
import { CarIcon } from "@/components/icons/car";
import Image from "next/image";

type RentalCarType = {
  id: number;
  name: string;
  mainImage: string;
  availableCount: string;
  carDetail: {
    ac: string;
    engine: string;
    numberOfSeats: string;
    pricePerDay: string;
    pricePerDayWithoutDriver: string;
    transmission: string;
  }
}

const RequestCar = () => {
  const [requestData, setRequestData] = useState<CarRentalRequestType>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    internationalDriverLicence: "",
    startDate: "",
    endDate: "",
  });
  const [rentingCar, setRentingCar] = useState<RentingCarType[]>([
    {
      rentalCarId: "",
      rentalCarName: "",
      withDriver: "",
      price: "",
      availableCount: "",
      requestCount: "",
      mainImage: "",
    },
]);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<RentalCarType[]>();
  const [selectedCar, setSelectedCar] = useState<RentalCarType | null>(null);
  const [modalMessage, setModalMessage] = useState<null | "Success" | "Fail">(
    null
  );
  const params = useSearchParams();
  const router = useRouter();
  const [isContactInformationDrawerOpen, setContactInformationDrawerOpen] =
    useState(true);
  const [isCarRentalInformationDrawerOpen, setCarRentalInformationDrawerOpen] =
    useState(true);
  const [isAgreedToPrivacy, setIsAgreedToPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rentingError, setRentingError] = useState<string | null>(null);

  useEffect(() => {
    const getIsAgreedToPrivacy = () => {
      const isAgreed = Cookies.get("isAgreedToPrivacy");
      setIsAgreedToPrivacy(isAgreed == "true" ? true : false);
    };
    getIsAgreedToPrivacy();

    const rentalcarid = params.get("rentalcarid") || "";
    if (rentalcarid == "") {
      setError("Rent Car Not Found");
      setLoading(false);
      return;
    }

    const getRentalCars = async () => {
      setLoading(true);
      try {
        const { data: rentalCars, error } = await supabase
          .from("rentalCars")
          .select("id, name, carDetail, mainImage, availableCount");
          if (error) {
            console.error(error);
            toast.error(error.message);
            setLoading(false);
            return;
          }
          
          setVehicles(rentalCars as RentalCarType[])
          const car = rentalCars?.filter((f) => `${f.id}` == rentalcarid) as RentalCarType[];
          setLoading(false);
          
        } catch (error: any) {
          console.error("Error fetching rental cars:", error.message);
          setLoading(false);
      }
    };
    getRentalCars();
  },[params])

  const totalDaysCount = useMemo(() => {
    const startDate = dayjs(requestData.startDate);
    const endDate = dayjs(requestData.endDate);
    if(startDate && endDate){
      return endDate.diff(startDate, 'day') + 1;
    }else{
      return 0;
    }
  }, [requestData]);

  const carPrice = useMemo(() => {
    let sum = 0;
    rentingCar.map((car) => {
      if(car.requestCount){
        sum += (parseInt(car.price || '0') * parseInt(car.requestCount));
      }
    })
    return sum;
  }, [rentingCar]);

  const totalAmount = useMemo(() => {
    if(totalDaysCount && carPrice){
      return totalDaysCount * carPrice;
    }else{
      return 0;
    }
  }, [carPrice, totalDaysCount]);

  const updateRequestData = (key: string, value: string) => {
    setRequestData({ ...requestData, [key]: value });
  };

  const checkInputs = () => {
    type keysType =
      | "firstName"
      | "lastName"
      | "email"
      | "phoneNumber"
      | "age"
      | "internationalDriverLicence"
      | "startDate"
      | "endDate"
    const keysToCheck: keysType[] = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "age",
      "internationalDriverLicence",
      "startDate",
      "endDate",
    ];
    for (const key of keysToCheck) {
      if (requestData[key] === "") {
        setRentingError("Please fill out all of our inputs in form");
        return false;
      }
    }
    return true;
  };

  const requestSubmit = async () => {
    if (!checkInputs()) return;

    setLoading(true);
    try {
      let params = {
        ...requestData,
        carList: rentingCar
      };

      const result = await axios.post(`api/request-rentcar`, params);

      if (result.status === 200 && result.data.response === "success") {
        if (!result.data.adminInfo.response.includes("OK")) console.log("Admin email could not sent.")
        if (!result.data.info.response.includes("OK")) console.log("User email could not sent.")
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

  const addCar = () => {
    setRentingCar([...rentingCar, {
      carRentalRequestsId: "",
      rentalCarId: "",
      rentalCarName: "",
      withDriver: "",
      price: "",
    }])
  }

  const removeCar = () => {
    if(rentingCar.length > 1){
      const current = rentingCar;
      current.splice(rentingCar.length - 1, 1);
      setRentingCar([...current]);
      console.log([...current]);
    }
  }

  const onSelectVehicle = (index: number, value: string) => {
    const car = (vehicles?.filter((f) => `${f.id}` == value) as RentalCarType[])[0] || null;
    const current = rentingCar;
    current.splice(index, 1, {
      ...rentingCar[index],
      rentalCarId: value,
      rentalCarName: car?.name,
      price: car?.carDetail?.pricePerDay,
      availableCount: car?.availableCount,
      mainImage: car?.mainImage,
      withDriver: "",
    });
    setRentingCar([...current]);
    console.log(current);
  }
  
  const onSelectDriver = (index: number, value: string) => {
    const car = (vehicles?.filter((f) => `${f.id}` == rentingCar[index].rentalCarId) as RentalCarType[])[0] || null;
    const current = rentingCar;
    current.splice(index, 1, {
      ...rentingCar[index],
      withDriver: value,
      price: parseInt(value) === 0 ? car?.carDetail?.pricePerDayWithoutDriver : parseInt(value) === 1 ? car?.carDetail?.pricePerDay : '',
    });
    setRentingCar([...current]);
    console.log(current);
  }

  const onRequestCountChange = (index: number, value: string) => {
    const current = rentingCar;
    current.splice(index, 1, {
      ...rentingCar[index],
      requestCount: value,
    });
    setRentingCar([...current]);
    console.log(current);
  }

  if (error) {
    return (
      <MainLayout>
        <div className="w-screen flex-1 px-3  xl:px-0 xl:w-[calc(1024px)] mx-auto flex flex-col items-center gap-4 justify-center">
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold lg:text-4xl">{error}</div>
            <button
              onClick={() => router.back()}
              className="bg-primary px-4 py-3 width-full text-center text-secondary whitespace-nowrap font-bold ripple w-full rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
          className={`fixed top-0 left-0 w-screen h-screen bg-black/20 z-50`}
          onClick={() => setModalMessage(null)}
        ></div>
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-96 p-4 pt-8 flex flex-col gap-4 rounded-2xl items-center z-50">
          {modalMessage == "Fail" ? <BigErrorIcon /> : <BigSuccessIcon />}
          <div className="flex flex-col items-center w-full gap-2">
            <h2 className="text-2xl font-bold">{modalMessage}</h2>
            <h3 className="font-medium text-center">
              {modalMessage == "Fail"
                ? "There was a problem sending your request information. Please try again later."
                : "Your request has been successfully sent."}
            </h3>
            <button
              className="py-3 mt-3 bg-primary rounded w-full font-bold ripple"
              onClick={() => {
                if (modalMessage == "Fail") {
                  requestSubmit();
                }
                setModalMessage(null);
                router.push(`/rentalcars`);
              }}
            >
              {modalMessage == "Fail" ? "Try Again" : "Done"}
            </button>
          </div>
        </div>
      </div>
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
              <h1 className="text-2xl font-bold lg:text-3xl">Car Rental Request Form</h1>
              <Drawer
                title="Contact Information"
                open={isContactInformationDrawerOpen}
                setOpen={setContactInformationDrawerOpen}
              >
                <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                  <NewInput
                    type="text"
                    value={requestData.firstName}
                    placeholder="John"
                    label="First Name:"
                    onChange={(e) => {
                      updateRequestData("firstName", e.target.value);
                    }}
                    required
                  />
                  <NewInput
                    type="text"
                    value={requestData.lastName}
                    placeholder="Doe"
                    label="Last Name:"
                    onChange={(e) => {
                      updateRequestData("lastName", e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                  <div className="flex-1 flex-col w-auto">
                    <NewInput
                      type="text"
                      value={requestData.age}
                      placeholder="Age"
                      label="Age:"
                      onChange={(e) => {
                        updateRequestData("age", e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="flex-1 flex-col">
                    <label className="font-semibold">Have an International Driver Licence?</label>
                    <select
                      required
                      className={`text-base px-4 py-3 w-full outline-none rounded-2xl border ${requestData.internationalDriverLicence == "" ? "text-[#c1c1c1]" : "text-secondary"}  mt-1.5`}
                      onChange={(e) => updateRequestData("internationalDriverLicence", e.target.value)}
                      value={requestData.internationalDriverLicence as string}
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    >
                      <option value="" className="text-quaternary">
                        Select YES or NO
                      </option>
                      <option value={1} key={'yes'}>
                        Yes
                      </option>
                      <option value={0} key={'no'}>
                        No
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                  <NewInput
                    type={"tel"}
                    value={requestData.phoneNumber}
                    label="Phone Number:"
                    placeholder="+976 9999 9999"
                    icon={<PhoneIcon />}
                    onChange={(e) => {
                      updateRequestData("phoneNumber", e.target.value);
                    }}
                    required
                  />
                  <NewInput
                    value={requestData.email}
                    type={"email"}
                    label="Email:"
                    placeholder="example@gmail.com"
                    icon={<EmailIcon />}
                    onChange={(e) => {
                      updateRequestData("email", e.target.value);
                    }}
                    required
                  />
                </div>
              </Drawer>
              <Drawer
                title="Car Rental Information"
                open={isCarRentalInformationDrawerOpen}
                setOpen={setCarRentalInformationDrawerOpen}
              >
                <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                  <NewInput
                    value={requestData.startDate}
                    type="date"
                    label="Starting Date"
                    placeholder="Starting Date"
                    onChange={(e) => updateRequestData("startDate", e.target.value)}
                    required
                  />
                  <NewInput
                    value={requestData.endDate}
                    type="date"
                    label="Ending Date"
                    placeholder="Ending Date"
                    onChange={(e) => updateRequestData("endDate", e.target.value)}
                    required
                  />
                </div>

                <hr />

               { rentingCar && rentingCar.map((car, index) => 
                <div className="flex flex-row gap-8">
                  <div className="max-w-40">
                    <label className="font-semibold pl-2">Select Vehicle</label>
                    <select
                      required
                      className={`text-base px-4 py-3 w-full outline-none rounded-2xl border ${params.get("rentalcarid") == "" ? "text-[#c1c1c1]" : "text-secondary"}  mt-1.5`}
                      onChange={(e) => {
                        onSelectVehicle(index, e.target.value)
                      }}
                      value={rentingCar[index].rentalCarId}
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    >
                      <option value="" className="text-quaternary">
                        Select vehicle
                      </option>
                      { vehicles && vehicles.map((car) => {
                        return(<option value={car.id} key={car.name}>
                          {car.name}
                        </option>)
                      })}
                    </select>
                  </div>
                  <div className="max-w-40">
                    <NewInput
                      value={rentingCar[index].availableCount || 0}
                      type={"number"}
                      label="Available:"
                      placeholder="0"
                      readOnly={true}
                    />
                  </div>
                  <div className="max-w-40">
                    <label className="font-semibold pl-2">Rent with driver?</label>
                    <select
                      required
                      className={`text-base px-4 py-3 w-full outline-none rounded-2xl border ${rentingCar[index].withDriver == "" ? "text-[#c1c1c1]" : "text-secondary"}  mt-1.5`}
                      onChange={(e) => {
                        onSelectDriver(index, e.target.value)
                      }}
                      value={rentingCar[index].withDriver as string}
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                      disabled={parseInt(rentingCar[index].availableCount || '0') > 0 ? false : true}
                    >
                      <option value="" className="text-quaternary">
                        Choose an option
                      </option>
                      <option value={1} key={'yes'}>
                        With driver
                      </option>
                      <option value={0} key={'no'}>
                        Self-drive
                      </option>
                    </select>
                  </div>
                  <div className="max-w-40">
                    <NewInput
                      value={rentingCar[index].requestCount || ''}
                      type={"number"}
                      label="Request Count:"
                      placeholder="0"
                      onChange={(e) => {
                        onRequestCountChange(index, e.target.value)
                      }}
                      required
                      disabled={parseInt(rentingCar[index].availableCount || '0') > 0 ? false : true}
                    />
                  </div>
                </div>
               )}
               <div className="flex gap-4 md:gap-6 flex-col md:flex-row">
                <div className="flex w-auto gap-4">
                  <button
                    className="bg-secondary px-4 py-3 w-32 text-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
                    onClick={() => removeCar()}
                  >
                    {loading ? "Loading" : "Remove Car"}
                  </button>
                  <button
                    className="bg-primary px-4 py-3 w-32 text-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
                    onClick={() => addCar()}
                  >
                    {loading ? "Loading" : "Add Car"}
                  </button>
                </div>
               </div>
              </Drawer>
            </div>
          </div>
          <div className="bg-white drop-shadow-card px-4 lg:px-16 relative py-8 md:pt-0">
            <div className="md:sticky md:left-0 md:top-0 flex flex-col gap-4 md:pt-[88px] md:-mt-[88px]">
              <h1 className="text-2xl font-bold lg:text-3xl">Vehicle Detail</h1>
              {/* Rental Car Card */}

              { rentingCar && rentingCar.map((car, index) => {
                return (
                  <div className="md:w-80 drop-shadow-card" key={index}>
                    <div className="relative md:w-[320px] h-[220px] rounded-t-2xl overflow-hidden">
                      { car?.mainImage 
                        ?
                        <StorageImage
                          fill
                          alt="tour-image"
                          className="object-cover"
                          src={car?.mainImage || ''}
                        />
                        :
                        <Image
                          src="/static/default_car.png"
                          alt="privatetourbg"
                          fill
                          className="object-cover"
                        />
                      }
                    </div>
                    <div className="p-5 pt-4 border border-t-0 rounded-b-xl flex flex-col gap-3">
                      <h3 className="text-lg font-bold">{car?.rentalCarName}</h3>
                      { car?.availableCount && parseInt(car?.availableCount) > 0 ?
                        <>
                          <div className="flex flex-row gap-4">
                            <div className="flex flex-row items-center justify-center text-sm font-semibold gap-1">
                              <PriceIcon />
                              { car?.withDriver != '' && 
                                <span>${car?.price} {car?.withDriver == '0' ? 'Self Drive' : 'with Driver'}</span>
                              }
                            </div>
                            <div className="bg-black/20 w-[2px] rounded my-1" />
                            <div className="flex flex-row justify-center text-sm items-center font-semibold gap-1">
                              Per Day
                            </div>
                          </div>
                          <div className="flex flex-row gap-4">
                            <div className="flex flex-row items-center justify-center text-sm font-semibold gap-1">
                              <CarIcon />
                              <span>Request Count {car?.requestCount}</span>
                            </div>
                          </div>
                        </>
                        :
                          car?.availableCount == "0"
                            ?
                            <div className="flex flex-row gap-4">Not Available Currently</div>
                            :
                            <div className="flex flex-row gap-4">Select a Vehicle</div>
                      }
                    </div>
                  </div>
                )
              })}

              {/* Pricing detail */}
              <div className="pt-4 md:pt-0">
                <div className="flex flex-row justify-between">
                  <label className="text-[#6D6D6D] font-medium">Renting dates:</label>
                  <p className="font-semibold">{requestData.startDate && dayjs(requestData.startDate).format('MM/DD/YYYY')} - {requestData.endDate && dayjs(requestData.endDate).format('MM/DD/YYYY')}</p>
                </div>

                <div className="flex flex-row justify-between">
                  <label className="text-[#6D6D6D] font-medium">Per day (sum):</label>
                  <p className="font-semibold">${carPrice}</p>
                </div>



                <div className="flex justify-end">
                  <p className="text-[#6D6D6D]">
                    x {totalDaysCount || 0} days
                  </p>
                </div>
              </div>
              <hr />
              <div>
                <div className="flex flex-row justify-between">
                  <label className="text-[#6D6D6D] font-medium">Total:</label>
                  <p className="font-semibold">${totalAmount}</p>
                </div>
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
              {rentingError && (
                <label className="text-red-600 text-center">{rentingError}</label>
              )}
              <button
                className="bg-primary px-4 py-3 width-full text-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
                style={{ backgroundColor: `${isAgreedToPrivacy ? '' : 'grey'}`}}
                onClick={() => requestSubmit()}
                disabled={!isAgreedToPrivacy}
              >
                {loading ? "Loading" : "Request to Rent"}
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default RequestCar
