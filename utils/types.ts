type TourType = {
  id?: number;
  created_at?: string;
  images: string[];
  title: string;
  overview: string;
  originalPrice: number;
  days: number;
  nights: number;
  minimumRequired: number;
  categories: string[];
  included: AssetType[];
  excluded: AssetType[];
  itinerary: ItineraryType[];
  reviews: ReviewType[];
  status: "active" | "inactive";
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
  id: number;
  date: string;
  price: number;
  // tourId: string;
  // title: string;
  // overview: string;
  transactions: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nationality: string;
    peopleCount: number;
    transactionId: string;
  }[];
};

type ReviewType = {
  firstName: string;
  lastName: string;
  date: string;
  review: string;
};

type IntroType = {
  id?: number;
  image: string | null;
  title: string;
  description: string;
  status: "active" | "inactive";
};

type CategoryType = {
  id?: number;
  name: string;
  image: string | null;
};

type PriceType = {
  tourDateId: string;
  date: string;
  price: number;
};
