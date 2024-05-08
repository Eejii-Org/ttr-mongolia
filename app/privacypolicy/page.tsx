"use client";
import { MainLayout } from "@components";
import { useRouter } from "next/navigation";
const PrivacyPolicy = () => {
  const router = useRouter();
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col justify-center container px-4 md:px-0 md:max-w-[800px] md:mx-auto md:text-lg font-medium  my-4 md:my-16 gap-4">
        <h1 className="font-bold text-xl">
          TTR MONGOLIA is an inbound tourism company in Mongolia. Our registered
          office is at:
        </h1>
        <p className="text-black/70">
          Sukhbaatar District,
          <br />
          Baruun Selbe Street,
          <br />
          1st Khoroo
          <br />
          34th apartment 1st Floor.
        </p>
        <p className="text-black/70">
          Before you make a reservation, we encourage you to read these Terms
          and Conditions carefully, as they constitute a contract agreement
          between you and TTR Mongolia beginning from your first booking. The
          person who makes the reservation accepts these conditions on behalf of
          all participants and responsibility for all payments due.
        </p>
        <h1 className="font-bold text-xl">Car rental service</h1>
        <p className="text-black/70">
          If you only receive a car rental, 30 days prior to the beginning of
          the tour you must deposit 50% of the market value of the vehicle.
          After successful completion of the tour, we will refund your deposit
          completely. If damage occurs during the tour, any necessary repair
          fees will be deducted from the deposit before being refunded. It is
          included following travel utilities: – GPS, backpack, tent, blanket
        </p>
        <h1 className="font-bold text-xl">Liability</h1>
        <p className="text-black/70">
          After booking on www.ttrmonglia.com, you will need to follow the
          following terms and legalities. Ti Ti Ar Em Co.Ltd. will not be liable
          for any damages, incidents, sicknesses, schedule changes, natural
          disasters caused by weather and road conditions, or any liability for
          situations beyond the control of Ti Ti Ar Em Co.Ltd.. As the
          information of www.ttrmonglia.com changes, we have the right to
          correct any errors that may arise on our website. These general order
          terms may change and we have the right to renew these requirements
          without notice. The right to compensation is due to loss or damage to
          one of two persons due to intentional or unintentional act of the
          traveler. In principle, the two sides will have to decide on the basis
          of mutual consent, and the law will be taken into consideration as a
          result of the law of Mongolia.
        </p>
        <h1 className="font-bold text-xl">Insurance</h1>
        <p className="text-black/70">
          Please note that individual travel insurance is not included in the
          tour price and all medical costs and other costs involved must be paid
          by the client. It is therefore strongly recommended that participants
          take out personal insurance, especially for the active tours. For
          example: horse trips, hiking, and snowmobiling.
        </p>
        <h1 className="font-bold text-xl">Complaint and request</h1>
        <p className="text-black/70">
          Suggestions for your future holiday may be posted on the
          www.ttrmongolia.com website’s comments section. Please send complaints
          to ttrmongola@gmail.com and info@ttrmongolia.com.
        </p>
        <button className="underline" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    </MainLayout>
  );
};
export default PrivacyPolicy;
