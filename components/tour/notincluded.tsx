import { TourType } from "@/utils";

export const NotIncluded = ({ tour }: { tour: TourType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Not Included</div>
      <div className="md:text-lg text-black/70">
        <ul className="!list-none !pl-0">
          {tour.excluded.map(({ name, explanation }, index) => (
            <li key={index}>
              <div className="flex flex-row items-center gap-2">
                <CancelMark />
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

const CancelMark = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Menu / Close_SM">
      <path
        id="Vector"
        d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
        stroke="#FF0000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
