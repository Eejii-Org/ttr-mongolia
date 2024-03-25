import { FC } from "react";

export const Values: FC = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-5xl font-semibold">Top values we offer</div>
      <div className="text-2xl">We offer unforgettable travel in Mongolia</div>
      <div className="flex flex-row">
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
};

const Value: FC<ValueProps> = (props) => {
  const { icon, title, description } = props;
  return (
    <div className="flex flex-col items-center gap-2 max-w-56">
      <div className="p-4 bg-quaternary rounded-full">{icon}</div>
      <div className="font-bold text-2xl text-center">{title}</div>
      <div className="text-xl text-center">{description}</div>
    </div>
  );
};

const data: ValueProps[] = [
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
          stroke="#1E1E1E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Volunteer",
    description: "10% of all profit will be donated",
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
          stroke="#1E1E1E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Volunteer",
    description: "10% of all profit will be donated",
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
          stroke="#1E1E1E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Volunteer",
    description: "10% of all profit will be donated",
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
          stroke="#1E1E1E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Volunteer",
    description: "10% of all profit will be donated",
  },
];
