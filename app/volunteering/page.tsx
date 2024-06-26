import {
  LabelIcon,
  MainLayout,
  StorageImage,
  VolunteeringIntro,
} from "@components";
import Image from "next/image";

const Volunteering = () => {
  return (
    <MainLayout>
      <div className="flex-1   flex flex-col gap-12">
        <VolunteeringIntro />
        <div className="flex flex-row gap-12 items-center justify-center">
          <Image
            src="/static/eejii.png"
            width={64 * 1.2}
            height={64 * 1.2}
            className="object-contain mix-blend-luminosity"
            alt="eejii"
          />
          <Image
            src="/static/amarbayasgalanthiid.png"
            width={392 / 3.8}
            height={353.36 / 3.8}
            className="object-contain mix-blend-luminosity"
            alt="eejii"
          />
          <Image
            src="/static/lotuschildrenscentre.png"
            width={64 * 1.2}
            height={64 * 1.2}
            className="object-contain mix-blend-luminosity"
            alt="eejii"
          />
        </div>
        <div className="flex flex-col md:flex-row container gap-6 mx-auto just px-8 md:px-24 items-center">
          <div className="flex-1 flex-col gap-4 hidden md:flex">
            <div className="flex flex-row gap-4">
              <div className="h-72 bg-quinary flex-1 rounded-lg relative overflow-hidden">
                <StorageImage
                  src={"ourAgencyImages/our-agency-1.webp"}
                  fill
                  alt="ourAgencyPicture1"
                  className="object-cover"
                />
              </div>
              <div className="h-72 bg-quinary flex-1 rounded-lg rounded-tr-[128px] relative overflow-hidden">
                <StorageImage
                  src={"ourAgencyImages/our-agency-2.webp"}
                  fill
                  alt="ourAgencyPicture2"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-row  gap-4">
              <div className="h-72 bg-quinary flex-1 rounded-lg rounded-bl-[128px] relative overflow-hidden">
                <StorageImage
                  src={"ourAgencyImages/our-agency-3.webp"}
                  fill
                  alt="ourAgencyPicture3"
                  className="object-cover"
                />
              </div>
              <div className="h-72 bg-quinary flex-1 rounded-lg relative overflow-hidden">
                <StorageImage
                  src={"ourAgencyImages/our-agency-4.webp"}
                  fill
                  alt="ourAgencyPicture4"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <LabelIcon />
              <div className="text-3xl font-semibold">About</div>
            </div>
            <div className="flex flex-col text-base md:text-lg gap-2">
              <p>
                Embark on an extraordinary journey with us, in partnership with
                the NGO EEJII we have created our new Voluntour Program. Our
                project is a fusion of travel and altruism, offering you an
                immersive experience into the nomadic culture while also
                actively making you contribute to local causes that matter.
              </p>
              <p>
                From lending your support at the Mazaalai Wildlife Care Center
                to teaching English to young monks at Amarbayasgalant Monastery,
                and rallying behind initiatives like the "a Billion trees"
                campaign led by the Shambala 2056 team – there are countless
                ways for you to leave a lasting impact. By joining our journey,
                you're not just signing up for an adventure; you're becoming a
                part of something bigger. Every tour profit you contribute goes
                directly to the EEJII NGO, supporting their ongoing projects and
                charity events.
              </p>
              <p>
                Join us as we embark on a transformative voyage, where every
                step you take leaves a positive footprint on the world around
                you
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default Volunteering;
