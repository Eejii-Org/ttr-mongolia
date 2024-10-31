"use client";
import { CarRentalRequestType } from "@/utils";
import supabase from "@/utils/supabase/client";
import {
  BigErrorIcon,
  BigSuccessIcon,
  EmailIcon,
  Input,
  MainLayout,
  NewInput,
  PhoneIcon,
} from "@components";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type RentalCarType = {
  id: number;
  name: string;
  carDetail: {
    ac: string;
    engine: string;
    numberOfSeats: string;
    pricePerDay: string;
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
    rentalCarId: "",
    rentalCarName: "",
    withDriver: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<RentalCarType[]>();
  const [modalMessage, setModalMessage] = useState<null | "Success" | "Fail">(
    null
  );
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getRentalCars = async () => {
      try {
        const { data: rentalCars, error } = await supabase
          .from("rentalCars")
          .select("id, name, carDetail");
          if (error) {
            console.error(error);
            toast.error(error.message);
            return;
          }
        
        setVehicles(rentalCars as RentalCarType[])
        
      } catch (error: any) {
        console.error("Error fetching rental cars:", error.message);
      }
    };
    getRentalCars();
    updateRequestData("rentalCarId", params.get("rentalcarid") || "");
  },[params])

  const updateRequestData = (key: string, value: string) => {
    setRequestData({ ...requestData, [key]: value });
  };

  const requestSubmit = async () => {
    setLoading(true);
    try {
      const selectedCar = vehicles?.filter((f) => `${f.id}` == requestData.rentalCarId) as RentalCarType[];

      let params = requestData;
      if(selectedCar && selectedCar?.length > 0){
        const price = selectedCar[0].carDetail.pricePerDay;
        const rentalCarName = selectedCar[0].name;
        params = {...params, price, rentalCarName}
      }
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
          <div className="w-fit flex-1 px-3 container mx-auto flex flex-col gap-4 justify-center ">
            <div className="text-4xl font-bold pt-12 m-auto">
              Car Rental Request Form
            </div>
            <form
                  className="flex flex-col gap-3 md:gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!loading) requestSubmit();
                  }}
                >
              <div className="flex flex-col md:flex-row gap-4 h-full">
                <div className="bg-white p-3 md:p-6 rounded-xl flex-1 flex flex-col gap-3">
                  <div className="text-2xl font-semibold pb-2">
                    Contact Information
                  </div>
                    <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
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
                    <div className="flex md:gap-4 flex-col md:flex-row min-h-6">
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
                        <label className="font-semibold">International Driver license?</label>
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
                    <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
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
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 h-full mt-0">
                <div className="bg-white p-3 md:p-6 rounded-xl flex-1 flex flex-col gap-3">
                  <div className="text-2xl font-semibold pb-2">
                    Car Rental Information
                  </div>
                    <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
                      <Input
                        value={requestData.startDate}
                        type="date"
                        placeholder="Start Date"
                        onChange={(e) => updateRequestData("startDate", e.target.value)}
                        required
                      />
                      <Input
                        value={requestData.endDate}
                        type="date"
                        placeholder="End Date"
                        onChange={(e) => updateRequestData("endDate", e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex md:gap-4 flex-col md:flex-row min-h-6">
                      <div className="flex-1 flex-col w-auto">
                        <label className="font-semibold pl-2">Vehicle select</label>
                        <select
                          required
                          className={`text-base px-4 py-3 w-full outline-none rounded-2xl border ${params.get("rentalcarid") == "" ? "text-[#c1c1c1]" : "text-secondary"}  mt-1.5`}
                          onChange={(e) => {
                            updateRequestData("rentalCarId", e.target.value);
                            const selectedCar = vehicles?.filter((f) => `${f.id}` == e.target.value) as RentalCarType[];
                            if(selectedCar && selectedCar?.length > 0){
                              updateRequestData("price", selectedCar[0].carDetail.pricePerDay);
                              updateRequestData("rentalCarName", selectedCar[0].name);
                            }
                          }}
                          value={requestData.rentalCarId === "" ? params.get("rentalcarid") || '' : requestData.rentalCarId}
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
                      <div className="flex-1 flex-col w-auto">
                        <label className="font-semibold pl-2">With driver?</label>
                        <select
                          required
                          className={`text-base px-4 py-3 w-full outline-none rounded-2xl border ${requestData.withDriver == "" ? "text-[#c1c1c1]" : "text-secondary"}  mt-1.5`}
                          onChange={(e) => updateRequestData("withDriver", e.target.value)}
                          value={requestData.withDriver as string}
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
                    <button
                      type="submit"
                      className="bg-primary px-4 py-3 width-full text-center items-center flex justify-center text-white whitespace-nowrap font-bold ripple rounded-2xl mt-6"
                    >
                      {loading ? (
                        <span className="loader h-6 w-6"></span>
                      ) : (
                        "Request to rent"
                      )}
                    </button>
                </div>
              </div>
            </form>
          </div>
      </MainLayout>
    </>
  )
}

export default RequestCar
