import { StringLiteral } from "typescript";

export type TourType = {
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
  map: string | null;
};

export type AssetType = {
  name: string;
  explanation: string;
};

export type ItineraryType = {
  day: string;
  title: string;
  description: string;
};

export type AvailableTourType = {
  id?: number;
  date: string;
  salePrice: number | null;
  status?: "active" | "inactive";
  tourId: number;
  bookable: boolean;
  pinned: boolean;
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

export type ReviewType = {
  id?: number;
  firstName: string;
  lastName: string;
  date: string;
  review: string;
  rating: number;
  images: string[];
};

export type IntroType = {
  id?: number;
  image: string | null;
  title: string;
  description: string;
  status: "active" | "inactive";
  order: number;
};

export type CategoryType = {
  id?: number;
  name: string;
  image: string | null;
};

export type PriceType = {
  passengerCount: number;
  pricePerPerson: number;
};

export type TransactionType = {
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
  deposit: string;
  transactionDetail: any;
  transactionId: string;
  availableTourId: string;
  paymentType: string;
  paymentMethod: string;
  total: number;
  pax: number;
};

export type CustomTransactionType = {
  id?: number;
  created_at?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  amount: string;
  transactionDetail: any;
  transactionId: string;
  note: null | string;
};

export type DepartureRequestType = {
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

export type MemberType = {
  id?: number;
  firstName: string;
  lastName: string;
  image: string | null;
  position: string;
  positionType: string;
  order: number;
};

export type BlogType = {
  id?: number;
  created_at?: string;
  title: string;
  description: string;
  image: string | null;
};
export type RentalCarType = {
  id?: number;
  created_at?: string;
  name: string;
  subDescription: string;
  description: string;
  mainImage: string;
  otherImages: string[];
  status: "active" | "inactive";
  carDetail: {
    numberOfSeats: string;
    transmission: string;
    engine: string;
    ac: string;
    pricePerDay: string;
  };
};

export type TextContentType = {
  id?: number;
  page?: string | null;
  content?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CarRentalRequestType = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: string;
  internationalDriverLicence: string | boolean;
  startDate: string;
  endDate: string;
  rentalCarId: string;
  rentalCarName: string;
  withDriver: string | boolean;
  price: string;
  status?: string;
}