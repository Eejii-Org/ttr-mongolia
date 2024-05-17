import Link from "next/link";
import { ArrowUpRightIcon } from "./icons";

export type ModifiedAvailableTourType = AvailableTourType & {
  title: string;
};

export const InfiniteScrollingTours = ({
  tours,
}: {
  tours: ModifiedAvailableTourType[];
}) => {
  const getTexts = () => {
    const texts: string[] = [];
    tours.forEach((tour) => {
      const date =
        new Date(tour.date).toLocaleString("default", { month: "long" }) +
        " " +
        new Date(tour.date).getDate() +
        " " +
        new Date(tour.date).getFullYear();
      texts.push(`${date} - ${tour.title}`);
      texts.push(`Check Out Our Available Departure Dates`);
    });
    return texts;
  };
  const texts = getTexts();

  return (
    <div className="relative w-full cursor-pointer overflow-hidden h-10">
      <div className="flex flex-row gap-4 py-2 w-min items-center infscroll bg-primary text-white">
        {texts.map((text, index) => (
          <div className="flex flex-row gap-4 items-center" key={index}>
            <Link
              href={{
                pathname: "/tours",
                query: {
                  availableDatesOpen: "true",
                },
              }}
              className="flex flex-row items-center"
            >
              <div className="text-nowrap flex flex-row items-center">
                {text}
              </div>
              <ArrowUpRightIcon />
            </Link>
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        ))}
        {texts.map((text, index) => (
          <div className="flex flex-row gap-4 items-center" key={index}>
            <Link
              href={{
                pathname: "/tours",
                query: {
                  availableDatesOpen: "true",
                },
              }}
              className="flex flex-row items-center"
            >
              <div className="text-nowrap flex flex-row items-center">
                {text}
              </div>
              <ArrowUpRightIcon />
            </Link>
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
};
