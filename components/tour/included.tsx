export const Included = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Included</div>
      <div className="md:text-lg text-black/70">
        <ul>
          {tour.included.map(({ name, explanation }, index) => (
            <li key={index}>
              <div className="flex flex-row items-center gap-2">
                <CheckMark />
                {name}
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

const CheckMark = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 12L10.2426 16.2426L18.727 7.75732"
      stroke="#2CB742"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
