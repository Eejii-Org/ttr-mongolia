"use client";
import { MainLayout } from "@components";
import { useRouter } from "next/navigation";
const PrivacyPolicy = () => {
  const router = useRouter();
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col justify-center container px-4 md:px-0 md:max-w-[800px] md:mx-auto md:text-lg font-medium  my-4 md:my-16 gap-4">
        <h1 className="font-bold text-xl">Payment term</h1>
        <p className="text-black/70">
          TTR Mongolia Chingeltei District,
          <br />
          Once you have submitted your booking and personal details through
          www.ttrmongolia.com, you will receive a confirmation and invoice of
          your booking via e-mail.
        </p>

        <h1 className="font-bold text-xl">Refund</h1>
        <p className="text-black/70">
          Within 29 days or fewer days prior to travel date: 70% of the total
          price.
        </p>
        <p className="text-black/70">
          30 days prior to travel date: 75% of the total price.
        </p>
        <p className="text-black/70">
          **There are no refunds for sewing or special travel offers.
        </p>
        <p className="text-black/70">
          You may also book and travel within 30 days. If you wish to transfer
          money via bank account, please notify us at both ttrmongola@gmail.com
          and info@ttrmongolia.com. Once you have submitted the payment, you
          will receive an itinerary.
        </p>
        <h1 className="font-bold text-xl">Account Information</h1>
        <p className="text-black/70">
          Recipient: Ti Ti Ar Em Co.Ltd
          <br />
          Beneficiary account number: 2705118983 / USD /
          <br />
          The receiving bank is Golomt Bank
        </p>
        <p className="text-black/70">
          Payments can be made for the following cards: Visa, MasterCard
        </p>
        <p className="text-black/70">
          Also, we can offer your feedback on our travel consultant (no car
          rental or no accommodation). All prices announced for Ti Ti Ar Em
          Co.Ltd. are USD ($). All payments and refunds are paid in dollars. Ti
          Ti Ar Em Co.Ltd. is not responsible for changes in exchange rates that
          may arise from refunds or orders.
        </p>
        <button className="underline" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    </MainLayout>
  );
};
export default PrivacyPolicy;
