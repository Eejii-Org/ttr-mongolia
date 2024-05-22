import { TourCard, TourCardDataType } from "../tourcard";
export const SimilarTours = ({
  similarTours,
}: {
  similarTours: TourCardDataType[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Similar Tours</div>
      <div className="flex flex-col lg:flex-row gap-6">
        {similarTours.map((similarTour, index) => (
          <TourCard tourData={similarTour} key={index} />
        ))}
      </div>
    </div>
  );
};
