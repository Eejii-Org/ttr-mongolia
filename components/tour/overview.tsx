export const Overview = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl md:text-4xl font-semibold">Overview</div>
      <div className="md:text-lg text-black/70">{tour?.overview}</div>
    </div>
  );
};
