"use client";
import { MainLayout } from "@components";
import { useRouter } from "next/navigation";
const PrivacyPolicy = () => {
  const router = useRouter();
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col justify-center container px-4 md:px-0 md:max-w-[800px] md:mx-auto md:text-lg font-medium  my-4 md:my-16 gap-4">
        <h1 className="font-bold text-2xl">Welcome to TTR Mongolia!</h1>
        <p className="text-black/70">
          We are TTR Mongolia ("TTR Mongolia," "we," "us," "our"), deeply
          committed to safeguarding your privacy and that of your customers.
          This policy aims to explain our data collection, its purpose, and its
          usage. We prioritize privacy and assure you that we never sell lists,
          personal information, or email addresses. Please take a moment to read
          and understand our Privacy Policy.
        </p>
        <h2 className="font-bold text-xl">Information Collection and Usage:</h2>
        <p className="text-black/70">
          Personal information refers to data that uniquely identifies or
          contacts an individual.
        </p>
        <h2 className="font-bold text-xl">
          1. Types of Information Collected:
        </h2>
        <p className="text-black/70">
          When you purchase our products or trips, or use our services, we may
          collect various details, including your name, address, phone number,
          email, contact preferences, and credit card information.
        </p>
        <h2 className="font-bold text-xl">2. How We Use Your Information:</h2>
        <p className="text-black/70">
          We utilize the collected information to keep you informed about our
          latest product updates, events, and service enhancements.
          <br />
          This data helps us develop, enhance, and personalize our offerings,
          striving to improve your overall experience.
          <br />
          Periodically, we may use your information for essential notifications,
          like purchase confirmations and policy updates, vital for your
          interaction with TTR Mongolia.
        </p>
        <h2 className="font-bold text-xl">Data Security:</h2>
        <p className="text-black/70">
          TTR Mongolia implements comprehensive measures administrative,
          technical, and physical to protect your personal data against loss,
          theft, and unauthorized access. Online payment is made through the
          online secured platform of Golomt Bank.
        </p>
        <h2 className="font-bold text-xl">Contact Us:</h2>
        <p className="text-black/70">
          For any queries regarding TTR Mongolia's Privacy Policy or data
          handling, please reach out to us at:
        </p>
        <p className="text-black/70">
          -Email:{" "}
          <a className="underline" href="mailto:info@ttrmongolia.com">
            info@ttrmongolia.com
          </a>
        </p>
        <p className="text-black/70">
          - Address: Ulaanbaatar, Sukhbaatar District, Baruun Selbe Street, 1st
          Khoroo 34th apartment 1st Floor.
        </p>
        <button className="underline" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    </MainLayout>
  );
};
export default PrivacyPolicy;
