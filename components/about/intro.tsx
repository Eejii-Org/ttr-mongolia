import Image from "next/image";
export const AboutIntro = () => {
  return (
    <div className="container m-auto flex flex-col-reverse md:flex-row gap-6 pt-8 items-center px-8">
      <div className="flex-1 flex flex-col items-start gap-12">
        <div className="flex flex-col gap-4">
          <div className="text-3xl md:text-6xl font-bold uppercase leading-tight">
            <span className="text-primary">#</span> About Us
          </div>
          <div className="pr-8 flex flex-col text-base md:text-lg gap-2">
            <p>
              We are an experienced and dynamic tour operating company devoted
              to providing travelers with the highest quality of trips in
              Mongolia. We started in 2013 and are constantly striving to
              improve our services. We have a team of drivers with the best
              navigation skills, and multilingual guides with a vast knowledge
              of the country. We provided our service to hundreds of tourists
              from more than 10 different countries.
            </p>

            <p>
              We offer a wide range of ready-made tours available through online
              booking. However, if you would prefer to travel independently or
              have travel ideas of your own, we will gladly collaborate in order
              to create a tailor-made tour just for you. We also offer a variety
              of low-budget tours. While organizing tours is our forte,
              employees in the following departments will gladly coordinate
              additional services to make your experience as enjoyable as
              possible.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 relative min-h-80 w-full md:h-[min(596px,70vh)] rounded-lg overflow-hidden">
        <Image
          src="https://qgowfgocgbsonbpypbvu.supabase.co/storage/v1/object/public/ourAgencyImages/IMG3449.jpg"
          alt="intro"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default AboutIntro;
