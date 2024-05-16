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
    <div className="flex-1 shadow rounded-xl">
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
            <div className="flex flex-row items-center gap-1 font-semibold text-2xl">
              <PriceIcon />${props.displayPrice}
            </div>
            <div className="bg-black/20 w-[2px] rounded my-1" />
            <div className="flex flex-row items-center gap-1 font-semibold text-2xl">
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
              <div className="font-semibold md:text-lg">Learn More</div>
              <ArrowRight color="black" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
