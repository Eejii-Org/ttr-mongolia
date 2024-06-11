import { FC } from "react";
import StorageImage from "../storageimage";

export const OurAgency: FC = () => {
  return (
    <div className="relative mx-3 md:mx-0 flex flex-col gap-4">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 md:p-8  backdrop-blur-sm bg-white/70 rounded-3xl text-center flex flex-col gap-4 z-10"
        style={{
          maxWidth: "704px",
          width: "calc(100% - 32px)",
        }}
      >
        <div className="font-bold text-lg md:text-2xl uppercase">
          At our agency, every step you take is a step towards
          <span className="text-primary"> positive change</span>.
        </div>
        <div className="text-base md:text-xl font-medium">
          With experienced guides leading the way, immerse yourself in
          <span className="text-primary"> unforgettable experiences</span> and
          support <span className="text-primary">meaningful projects</span>. For
          every adventure you embark upon, know that{" "}
          <span className="text-primary">10% of our profits </span>are donated
          to our partner EEJII NGO, dedicated to supporting{" "}
          <span className="text-primary">education, healthcare</span>, and
          various <span className="text-primary">vital fields</span>. Join us as
          we navigate towards a brighter future, where{" "}
          <span className="text-primary">every trip</span> taken becomes an{" "}
          <span className="text-primary">opportunity</span> for those who need
          it most.
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          <StorageImage
            src={"ourAgencyImages/our-agency-1.webp"}
            fill
            alt="ourAgencyPicture1"
            className="object-cover"
          />
        </div>
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          <StorageImage
            src={"ourAgencyImages/our-agency-2.webp"}
            fill
            alt="ourAgencyPicture2"
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex flex-row  gap-4">
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          <StorageImage
            src={"ourAgencyImages/our-agency-3.webp"}
            fill
            alt="ourAgencyPicture3"
            className="object-cover"
          />
        </div>
        <div className="h-72 bg-quinary flex-1 rounded-3xl relative overflow-hidden">
          <StorageImage
            src={"ourAgencyImages/our-agency-4.webp"}
            fill
            alt="ourAgencyPicture4"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
