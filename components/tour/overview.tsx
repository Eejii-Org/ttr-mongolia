export const Overview = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl md:text-4xl font-semibold">Overview</div>
      <div className="md:text-xl">{tour?.overview}</div>
    </div>
  );
};
