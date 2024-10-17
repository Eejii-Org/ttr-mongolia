import { TourType } from "@/utils/types";
import { TiptapContent } from "../tiptapcontent";

export const Overview = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl md:text-4xl font-semibold">Overview</div>
      <TiptapContent content={tour?.overview} />
      {/* <h2 className="md:text-lg text-black/70">
        {tour?.overview}
      </h2> */}
    </div>
  );
};
