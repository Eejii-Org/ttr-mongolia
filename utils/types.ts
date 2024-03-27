type TourType = {
  images: string[];
  title: string;
  overview: string;
  prices: PriceType[]; // to know if it's on sale
  originalPrice: number;
  days: number;
  nights: number;
  minimumRequired: number;
  categories: string[];
  included: AssetType[];
  excluded: AssetType[];
  // dates: TravelDate[]; will read later
  itinerary: ItineraryType;
  reviews: ReviewType[];
};

type AssetType = {
  name: string;
  explanation: string;
};

type ItineraryType = {
  title: string;
  description: string;
};

type TravelDate = {
  date: Date;
  price: number;
  tourId: string;
  title: string;
  overview: string;
  people: {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phoneNumber: string;
    nationality: string;
  }[];
};
type ReviewType = {
  firstName: string;
  lastName: string;
  date: Date;
  review: string;
};

type IntroType = {
  image: string;
  title: string;
  description: string;
};

type CategoryType = {
  id: number;
  name: string;
  image: string;
};

type PriceType = {
  tourDateId: string;
  date: string;
  price: number;
};
