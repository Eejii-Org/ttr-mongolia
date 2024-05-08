import { FC } from "react";

export const Values: FC = () => {
  return (
    <div className="flex flex-col gap-6 mx-3 md:mx-0">
      <div className="text-2xl md:text-4xl font-semibold">
        Top values we offer
      </div>
      <div className="text-lg md:text-2xl">
        We offer unforgettable travel in Mongolia
      </div>
      <div className="grid grid-cols-2 gap-2 lg:gap-6 lg:grid-cols-4">
        {data.map((data, index) => (
          <Value {...data} key={index} />
        ))}
      </div>
    </div>
  );
};

type ValueProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
};

const Value: FC<ValueProps> = (props) => {
  const { icon, title, description, color } = props;
  return (
    <div className="flex flex-col items-start w-full gap-2 bg-quaternary p-6">
      <div
        className={`p-4 rounded-full`}
        style={{
          background: color,
        }}
      >
        {icon}
      </div>
      <div className="font-bold text-lg md:text-2xl">{title}</div>
      <div
        className="text-base md:text-lg"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

const data: ValueProps[] = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="User / Users_Group">
          <path
            id="Vector"
            d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    ),
    title: "Travelling team",
    description:
      "We have a team of drivers with the best navigation skills, and multilingual guides with a vast knowledge of the country",
    color: "#FDA403",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Navigation / Compass">
          <g id="Vector">
            <path
              d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 10.5L16 8L13.5 13.5L8 16L10.5 10.5Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    ),
    title: "Tours",
    description:
      "We offer a wide range of tours and are always ready to create tailor-made tours just for you",
    color: "#EA4444",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Environment / Bulb">
          <path
            id="Vector"
            d="M9 21H15M12 3C8.68629 3 6 5.68629 6 9C6 10.2145 6.36084 11.3447 6.98117 12.2893C7.93507 13.7418 8.41161 14.4676 8.47352 14.5761C9.02428 15.541 8.92287 15.2007 8.99219 16.3096C8.99998 16.4342 9 16.6229 9 17C9 17.5523 9.44772 18 10 18L14 18C14.5523 18 15 17.5523 15 17C15 16.6229 15 16.4342 15.0078 16.3096C15.0771 15.2007 14.9751 15.541 15.5259 14.5761C15.5878 14.4676 16.0651 13.7418 17.019 12.2893C17.6394 11.3447 18.0002 10.2145 18.0002 9C18.0002 5.68629 15.3137 3 12 3Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    ),
    title: "Experience and knowledge",
    description:
      "We have been operating for many years in all regions and will lead you to unique places",
    color: "#0066B1",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 10.259C13.3333 3.9998 4 4.66646 4 12.6665C4 20.6665 16 27.3334 16 27.3334C16 27.3334 28 20.6665 28 12.6665C28 4.66646 18.6667 3.9998 16 10.259Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Volunteer",
    description: `10% of all profit will be donated to <a href="https://eejii.org/" class="text-[#65a30d] underline" >EEJII NGO</a> to support their projects and charity event`,
    color: "#2CB742",
  },
];
