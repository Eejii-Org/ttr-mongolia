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
    <MainLayout headerTransparent>
      <div className="flex-1 w-full flex flex-col gap-12">
        <Intro />
        <div className="container mx-auto flex flex-col gap-12">
          <Values />
          <TourCategories />
          <CustomerSupport />
          <OurAgency />
        </div>

        <Reviews />
      </div>
    </MainLayout>
  );
};

export default Home;
