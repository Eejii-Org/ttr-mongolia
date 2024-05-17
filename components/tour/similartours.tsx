import { ArrowRight, DayIcon, PriceIcon } from "../icons";
import Link from "next/link";
import StorageImage from "../storageimage";
export const SimilarTours = ({
  similarTours,
}: {
  similarTours: TourType[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl md:text-4xl font-semibold">Similar Tours</div>
      <div className="flex flex-col lg:flex-row gap-6">
        {similarTours.map((similarTour, index) => (
          <TourCard {...similarTour} key={index} />
        ))}
      </div>
    </div>
  );
};

const TourCard = (props: TourType) => {
  return (
    <div className="shadow rounded-xl flex-1">
      <div className="relative h-64">
        <StorageImage
          src={props.images[0]}
          alt={props.title}
          quality={5}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h5 className="text-xl md:text-2xl font-bold">{props.title}</h5>
          <p className="tour-item-description-3 text-[#6D6D6D]">
            {props.overview}
          </p>
        </div>
        <div className="flex flex-row flex-wrap gap-4 justify-between">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row items-center gap-1 font-semibold text-lg">
              <PriceIcon />${props.displayPrice}
            </div>
            <div className="bg-black/20 w-[2px] rounded my-1" />
            <div className="flex flex-row items-center gap-1 font-semibold text-lg">
              <DayIcon />
              {props.days}
              <span className="font-medium text-xl">
                {props.days == 1 ? " day" : " days"}
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-end">
            <Link
              href={`/tours/${props.id}`}
              className="flex flex-row items-center gap-2"
            >
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Arrow = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="24" fill="#FFF5E5" />
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="23.5"
        stroke="black"
        strokeOpacity="0.05"
      />
      <path
        d="M17.332 24.0001H30.6654M30.6654 24.0001L25.332 18.6667M30.6654 24.0001L25.332 29.3334"
        stroke="black"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
