import Image from "next/image";
import Link from "next/link";
export const VolunteeringIntro = () => {
  return (
    <div className="container m-auto flex flex-col-reverse md:flex-row gap-6 pt-8 items-center px-8">
      <div className="flex-1 flex flex-col items-start gap-12">
        <div className="flex flex-col gap-4">
          <div className="text-3xl md:text-6xl font-bold uppercase leading-tight">
            <span className="text-[#2CB742]">#</span> Let's Help <br />
            Each other
          </div>
          <div className="pr-8 text-base md:text-lg">
            Come visit and discover the wonders of Mongolia by joining now our
            new VolunTour program for the summer 2024. Explore our vast and
            untouched country and be ready to be amazed by breathtaking
            sceneries.
          </div>
        </div>

        <Link
          href={"/tours?category=9"}
          className="bg-[#2CB742] px-8 py-4 text-tertiary rounded ripple font-bold"
        >
          Explore Volunteering
        </Link>

        <div className="flex flex-row gap-6 pl-0 text-center md:pl-16">
          <div className="flex flex-col items-center">
            <div className="font-semibold text-3xl">15+</div>
            <div className="text-[#6D6D6D] font-semibold">Projects Done</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-semibold text-3xl">100+</div>
            <div className="text-[#6D6D6D] font-semibold">
              Successful Participants
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-semibold text-3xl">500+</div>
            <div className="text-[#6D6D6D] font-semibold">People Impacted</div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-80 w-full md:h-[min(596px,70vh)] rounded-lg overflow-hidden">
        <Image
          src="https://qgowfgocgbsonbpypbvu.supabase.co/storage/v1/object/public/images/volunteering-intro.jpg"
          alt="intro"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default VolunteeringIntro;
