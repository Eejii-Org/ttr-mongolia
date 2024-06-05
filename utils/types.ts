type TourType = {
  id?: number;
  created_at?: string;
  images: string[];
  title: string;
  overview: string;
  originalPrice: PriceType[];
  days: number;
  minimumRequired: number;
  categories: number[];
  included: AssetType[];
  excluded: AssetType[];
  itinerary: ItineraryType[];
  reviews: ReviewType[];
  status: "active" | "inactive";
  displayPrice: number;
};

type AssetType = {
  name: string;
  explanation: string;
};

type ItineraryType = {
  title: string;
  description: string;
};

type AvailableTourType = {
  id?: number;
  date: string;
  salePrice: number | null;
  status?: "active" | "inactive";
  tourId: number;
  bookable: boolean;
  // tourId: string;
  // title: string;
  // overview: string;
  // transactions: {
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   phoneNumber: string;
  //   nationality: string;
  //   peopleCount: number;
  //   transactionId: string;
  // }[];
};

type ReviewType = {
  id?: number;
  firstName: string;
  lastName: string;
  date: string;
  review: string;
  rating: number;
  images: string[];
};

type IntroType = {
  id?: number;
  image: string | null;
  title: string;
  description: string;
  status: "active" | "inactive";
  order: number;
};

type CategoryType = {
  id?: number;
  name: string;
  image: string | null;
};

type PriceType = {
  passengerCount: number;
  pricePerPerson: number;
};

type TransactionType = {
  id?: number;
  created_at: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  dateOfBirth: string;
  peopleCount: string;
  additionalInformation: string;
  amount: string;
  transactionDetail: any;
  transactionId: string;
  availableTourId: string;
};

type DepartureRequestType = {
  id?: number;
  created_at?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  dateOfBirth: string;
  peopleCount: string;
  additionalInformation: string;
  tourId: string;
  startingDate: string;
  status: "Pending" | "Denied" | "Approved";
  adminNote: string | null;
};

type MemberType = {
  id?: number;
  firstName: string;
  lastName: string;
  image: string | null;
  position: string;
  positionType: string;
  order: number;
};
