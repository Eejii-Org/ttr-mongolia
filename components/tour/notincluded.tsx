export const NotIncluded = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Not Included</div>
      <div className="md:text-xl">
        <ul>
          {tour.excluded.map(({ name, explanation }, index) => (
            <li key={index}>
              <div>
                <span className="font-bold pr-4">•</span> {name}
              </div>
              {explanation && explanation !== "" && (
                <ul className="pl-4">
                  <li>
                    <span className="font-bold pr-4">-</span>
                    {explanation}
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
