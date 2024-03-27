"use client";
import { FC } from "react";
import {
  CustomerSupport,
  Header,
  Intro,
  OurAgency,
  TourCategories,
  Values,
  Reviews,
  Footer,
} from "@components";

const Home: FC = () => {
  return (
    <div className="flex-1 w-full flex flex-col pt-14 gap-16">
      <Header />
      <Intro />
      <Values />
      <TourCategories />
      <CustomerSupport />
      <OurAgency />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Home;
