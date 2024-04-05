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
  MainLayout,
} from "@components";

const Home: FC = () => {
  return (
    <MainLayout>
      <div className="flex-1 w-full flex flex-col pt-14 gap-16">
        <Intro />
        <Values />
        <TourCategories />
        <CustomerSupport />
        <OurAgency />
        <Reviews />
      </div>
    </MainLayout>
  );
};

export default Home;
