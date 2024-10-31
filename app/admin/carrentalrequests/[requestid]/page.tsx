"use client";
import { supabase } from "@/utils/supabase/client";
import { ArrowLeft, EmailIcon, Input, Modal, PhoneIcon } from "@components";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import axios from "axios";
import { CarRentalRequestType } from "@/utils";

const CarRentalRequest = () => {
  const router = useRouter();
  const [requestData, setCarRentalRequests] =
    useState<CarRentalRequestType | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { requestid } = params;
  const [isNotFound, setIsNotFound] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const leave = async () => {
    router.push("/admin/carrentalrequests");
    return;
  };
  const [inquireOpen, setInquireOpen] = useState<null | "Approve" | "Deny">(
    null
  );

  const inquire = (req: "Approve" | "Deny") => {
    setInquireOpen(req);
  };

  const changeStatus = async (newStatus: "Approve" | "Deny" | null) => {
    if (!requestData || !newStatus) return;
    setStatusLoading(true);
    try {
      const [updateRequestResult] = await Promise.all([
        supabase
          .from("carRentalRequests")
          .update({
            status: newStatus == "Approve" ? "Approved" : "Denied",
          })
          .eq("id", requestid),
      ]);

      if (updateRequestResult.error) {
        console.error(updateRequestResult.error);
        toast.error(updateRequestResult.error.message);
        return;
      }

      toast.success(
        "Status has changed successfully and made the request available"
      );
      setCarRentalRequests({
        ...requestData,
        status: newStatus == "Approve" ? "Approved" : "Denied",
      });
      setStatusLoading(false);
      setInquireOpen(null);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while changing status.");
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data, error } = await supabase
          .from("carRentalRequests")
          .select("*")
          .eq("id", requestid)
          .select()
          .single();
        if (error) {
          setLoading(false);

          throw error;
        }

        setCarRentalRequests(data as CarRentalRequestType);
      } catch (error: any) {
        console.error("Error fetching departure request:", error.message);
        toast.error("Error fetching departure request:", error.message);
      }
      setLoading(false);
    };
    fetchTransaction();
  }, [requestid]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <Modal
        open={inquireOpen != null}
        close={() => setInquireOpen(null)}
        className={"w-[calc(100vw-16rem)]"}
      >
        <div className="p-4 bg-tertiary flex flex-col gap-4">
          <div className="text-lg">
            Are you sure you want to {inquireOpen} this request?
          </div>
          {statusLoading ? (
            <div className="h-10 text-center">
              It might take some time loading, please wait
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <button
                className={`px-12 py-2 flex-1 font-semibold hover:bg-opacity-50 bg-quinary text-secondary ripple`}
                onClick={() => setInquireOpen(null)}
              >
                No
              </button>
              <button
                className={`px-12 py-2 flex-1 font-semibold  bg-primary hover:bg-opacity-50 text-tertiary ripple`}
                onClick={() => changeStatus(inquireOpen)}
              >
                Yes
              </button>
            </div>
          )}
        </div>
      </Modal>

      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex flex-row items-center gap-4">
          <button
            onClick={leave}
            className="flex p-2 ripple rounded-full bg-tertiary border"
          >
            <ArrowLeft color="black" />
          </button>
          <div className="text-2xl md:text-4xl font-semibold">
            {isNotFound
              ? "Request not found"
              : `Car Rental Request Number: ${requestData?.id}`}
          </div>
        </div>
        {requestData && (
          <>
            <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
              <div className="flex-1 p-4">
                <Detail
                  requestData={requestData}
                />
              </div>
              {requestData.status == "Pending" && (
                <div className="p-4 flex items-end justify-end gap-4 bg-white border-t">
                  <button
                    className={`px-12 py-2 font-semibold hover:bg-opacity-50 bg-quinary text-secondary`}
                    onClick={() => inquire("Deny")}
                  >
                    Deny
                  </button>
                  <button
                    className={`px-12 py-2 font-semibold  bg-primary hover:bg-opacity-50 text-tertiary ripple`}
                    onClick={() => inquire("Approve")}
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const Detail = ({
  requestData,
}: {
  requestData: CarRentalRequestType;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="text-2xl md:text-4xl font-semibold">
          Selected Rental Request: {requestData.rentalCarName}
        </div>
        <div>
          {requestData.status == "Approved" ? (
            <div
              className={`border border-green-500 bg-green-500/10 w-min px-5 py-3 text-sm rounded text-green-500`}
            >
              Approved
            </div>
          ) : requestData.status == "Pending" ? (
            <div
              className={`border border-yellow-500 bg-yellow-500/10 w-min px-5 py-3 text-sm rounded text-yellow-500`}
            >
              Pending
            </div>
          ) : (
            <div
              className={`border border-red-500 bg-red-500/10 w-min px-5 py-3 text-sm rounded text-red-500`}
            >
              Denied
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="bg-white p-3 md:p-6 rounded-xl flex-1 flex flex-col gap-3">
          <div className="text-2xl font-semibold pb-2">
            Contact Information
          </div>
          <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">First Name:</label>
              <Input
                type="text"
                value={requestData.firstName}
                placeholder="John"
              />
            </div>
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">Last Name:</label>
              <Input
                type="text"
                value={requestData.lastName}
                placeholder="Doe"
              />
            </div>
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">Age:</label>
              <Input
                type="text"
                value={requestData.age}
                placeholder="Age"
              />
            </div>
          </div>
          <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">Phone Number:</label>
              <Input
                type={"tel"}
                value={requestData.phoneNumber}
                placeholder="+976 9999 9999"
                icon={<PhoneIcon />}
              />
            </div>
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">Email:</label>
              <Input
                value={requestData.email}
                type={"email"}
                placeholder="example@gmail.com"
                icon={<EmailIcon />}
              />
            </div>
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">International Driver license:</label>
              <Input
                type="text"
                value={requestData.internationalDriverLicence ? 'YES' : 'NO'}
                placeholder="Age"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
        <div className="bg-white p-3 md:p-6 rounded-xl flex-1 flex flex-col gap-3">
          <div className="text-2xl font-semibold pb-2">
            Car Rental Information
          </div>
          <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">Start Date:</label>
              <Input
                value={requestData.startDate}
                type="text"
                placeholder="Start Date"
              />
            </div>
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">End Date:</label>
              <Input
                value={requestData.endDate}
                type="text"
                placeholder="End Date"
              />
            </div>
          </div>
          <div className="flex md:gap-4 flex-col md:flex-row min-h-6">
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">Vehicle:</label>
              <Input
                value={requestData.rentalCarName}
                type="text"
                placeholder="Vehicle name"
              />
            </div>
            <div className="flex-1 flex-col w-auto">
              <label className="pl-2 font-medium">With driver:</label>
              <Input
                value={requestData.withDriver ? 'YES' : 'NO'}
                type="text"
                placeholder="With Driver"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalRequest;
