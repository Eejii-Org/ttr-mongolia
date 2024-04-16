"use client";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, EmailIcon, Input, Modal, PhoneIcon } from "@components";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import axios from "axios";

const DepartureRequest = () => {
  const supabase = createClient();
  const router = useRouter();
  const [departureRequest, setDepartureRequest] =
    useState<DepartureRequestType | null>(null);
  const [tourData, setTourData] = useState<TourType | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { requestid } = params;
  const [isNotFound, setIsNotFound] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const leave = async () => {
    router.push("/admin/departurerequests");
    return;
  };
  const [inquireOpen, setInquireOpen] = useState<null | "Approve" | "Deny">(
    null
  );
  const inquire = (req: "Approve" | "Deny") => {
    setInquireOpen(req);
  };
  const changeStatus = async (newStatus: "Approve" | "Deny" | null) => {
    if (!departureRequest || !newStatus || !tourData) return;
    setStatusLoading(true);
    try {
      const [updateRequestResult, insertTourResult] = await Promise.all([
        supabase
          .from("departureRequests")
          .update({
            status: newStatus == "Approve" ? "Approved" : "Denied",
          })
          .eq("id", requestid),
        newStatus == "Approve" &&
          supabase
            .from("availableTours")
            .insert({
              tourId: departureRequest.tourId,
              price: tourData.originalPrice,
              date: departureRequest.startingDate,
              status: "active",
            })
            .select(),
      ]);
      if (updateRequestResult.error) {
        console.error(updateRequestResult.error);
        toast.error(updateRequestResult.error.message);
        return;
      }

      if (insertTourResult !== false && insertTourResult.error) {
        console.error(insertTourResult.error);
        toast.error(insertTourResult.error.message);
        return;
      }
      const availableTourId =
        insertTourResult !== false ? insertTourResult.data[0].id : "";
      const res = await axios.post(
        "http://localhost:3000/api/reply-departure",
        {
          departureRequest: departureRequest,
          tour: tourData,
          status: newStatus == "Approve" ? "Approved" : "Denied",
          availableTourId,
        }
      );
      if (res.status == 400) {
        console.error(res);
        toast.error(res.statusText);
        return;
      }
      toast.success(
        "Status has changed successfully and made the tour available"
      );
      setDepartureRequest({
        ...departureRequest,
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
          .from("departureRequests")
          .select("*")
          .eq("id", requestid)
          .select()
          .single();
        if (error) {
          setLoading(false);

          throw error;
        }
        const { data: tourData, error: er } = await supabase
          .from("tours")
          .select("title, originalPrice")
          .eq("id", data.tourId);
        if (er) {
          throw er;
        }
        if (tourData.length == 0) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }
        setTourData(tourData[0] as TourType);
        setDepartureRequest(data as DepartureRequestType);
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
              ? "Tour not found"
              : `Departure Request Number: ${departureRequest?.id}`}
          </div>
        </div>
        {departureRequest && (
          <>
            <div className="border overflow-scroll h-full w-full bg-white rounded-md flex-1 flex flex-col relative">
              <div className="flex-1 p-4">
                <Detail
                  departureRequest={departureRequest}
                  tourData={tourData}
                />
              </div>
              {departureRequest.status == "Pending" && (
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
  departureRequest,
  tourData,
}: {
  departureRequest: DepartureRequestType;
  tourData: TourType | null;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="text-2xl md:text-4xl font-semibold">
          Selected Tour: {tourData?.title}
        </div>
        <div>
          {departureRequest.status == "Approved" ? (
            <div
              className={`border border-green-500 bg-green-500/10 w-min px-5 py-3 text-sm rounded text-green-500`}
            >
              Approved
            </div>
          ) : departureRequest.status == "Pending" ? (
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
      <div className="flex flex-row flex-wrap gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Requested Tour Date:</label>
          <Input
            type="text"
            placeholder="2022-02-02"
            value={departureRequest.startingDate}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">FirstName:</label>
          <Input
            type="text"
            placeholder="John"
            value={departureRequest.firstName}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">LastName:</label>
          <Input
            type="text"
            placeholder="Doe"
            value={departureRequest.lastName}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">PhoneNumber:</label>
          <Input
            type="text"
            placeholder="+976 9999 9999"
            value={departureRequest.phoneNumber}
            icon={<PhoneIcon />}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">Email:</label>
          <Input
            type="text"
            placeholder="test@gmail.com"
            value={departureRequest.email}
            icon={<EmailIcon />}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-8">
        <div className="min-w-80">
          <label className="pl-2 font-medium">Nationality:</label>
          <Input
            type="text"
            placeholder="Mongolia"
            value={departureRequest.nationality}
            disabled
          />
        </div>
        <div className="min-w-80">
          <label className="pl-2 font-medium">Date Of Birth:</label>
          <Input
            type="text"
            placeholder="January 1 2001"
            value={departureRequest.dateOfBirth}
            disabled
          />
        </div>
      </div>
      <div className="flex">
        <div className="min-w-80">
          <label className="pl-2 font-medium">People Count:</label>
          <Input
            type="text"
            placeholder="1"
            value={departureRequest.peopleCount}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="pl-2 font-medium">Additional Information:</label>
        <textarea
          placeholder="Additional Information"
          className=" min-h-48 w-full p-4 border rounded-xl"
          value={departureRequest.additionalInformation}
          disabled
        ></textarea>
      </div>
    </div>
  );
};

export default DepartureRequest;
