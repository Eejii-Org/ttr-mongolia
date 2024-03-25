import { FC } from "react";

export const Reviews: FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-5xl font-semibold mx-6">
        What our travelers say about us
      </div>
      <div className="flex flex-row gap-4 overflow-x-scroll w-full pl-6">
        <Review />
        <Review />
        <Review />
        <Review />
        <Review />
      </div>
    </div>
  );
};
export const Review: FC = () => {
  return (
    <div
      className="p-8 pt-16 bg-quinary relative flex flex-col gap-8 rounded-3xl"
      style={{
        minWidth: "512px",
      }}
    >
      <div className="absolute text-primary text-5xl top-6 left-6">"</div>
      <div className="text-2xl">
        Our team of experienced adventure specialists are at your hands. Contact
        us now to have all of your adventure related questions answered!
      </div>
      <div className="text-2xl font-semibold">John Doe</div>
    </div>
  );
};
