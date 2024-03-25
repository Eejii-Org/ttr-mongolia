import { createClient } from "@/utils/supabase/server";
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
export default async function Index() {
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
}
