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
  PrivateTour,
} from "@components";

const Home: FC = () => {
  return (
    <MainLayout headerTransparent>
      <div className="flex-1 w-full flex flex-col gap-24">
        <Intro />
        <div className="container mx-auto flex flex-col gap-24">
          <Values />
          <TourCategories />
        </div>
        <CustomerSupport />
        <div className="container mx-auto flex flex-col gap-24">
          <OurAgency />
        </div>
        <PrivateTour />
        <Reviews />
      </div>
    </MainLayout>
  );
};

export default Home;
