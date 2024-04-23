import Link from "next/link";
import Image from "next/image";
import {
  AmericanExpress,
  Golomt,
  JCB,
  MNT,
  MasterCard,
  TTRMongolia,
  UnionPay,
  Visa,
} from "./icons";

export const Footer = () => {
  return (
    <div className="bg-secondary text-white p-6  flex flex-col gap-8">
      <div className="container mx-auto hidden md:flex">
        <div className="flex flex-row justify-between gap-16 flex-1">
          <div className="flex flex-row gap-16 lg:gap-32">
            <div className="flex flex-col gap-8">
              <div className="font-semibold">Important Links</div>
              <div className="flex flex-col gap-4">
                <Link href="/">
                  <div className="text-base text-white/70">Home</div>
                </Link>
                <Link href="/tours">
                  <div className="text-base text-white/70">Explore Tours</div>
                </Link>
                <Link href="/volunteering">
                  <div className="text-base text-white/70">Volunteering</div>
                </Link>
                <Link href="/contact">
                  <div className="text-base text-white/70">About Us</div>
                </Link>
                <Link href="/">
                  <div className="text-base text-white/70">
                    Terms and Conditions
                  </div>
                </Link>
                <Link href="/">
                  <div className="text-base text-white/70">Privacy Policy</div>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="font-semibold">Get in touch</div>
              <div className="flex flex-col gap-4">
                <Link href="/contact">
                  <div className="text-base text-white/70">Contact Us</div>
                </Link>
                <Link href="tel:+97670141001">
                  <div className="text-base text-white/70">+976 7014-1001</div>
                </Link>
                <Link href="mailto:info@ttrmongolia.com">
                  <div className="text-base text-white/70">
                    info@ttrmongolia.com
                  </div>
                </Link>
                <Link href="https://www.instagram.com/ttr_mongolia/">
                  <div className="text-base text-white/70">Instagram</div>
                </Link>
                <Link href="https://www.facebook.com/GoNomadic">
                  <div className="text-base text-white/70">Facebook</div>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2 items-center">
              <div>
                <Image
                  src="/static/ttr.png"
                  alt="TTR"
                  width={218.61}
                  height={132.44}
                  unoptimized
                />
              </div>
              {/* <div className="font-bold text-2xl">TTR Mongolia</div> */}
              <div className="font-medium">
                We offer unforgettable travel in Mongolia
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              <Golomt />
              <Visa />
              <MasterCard />
              <AmericanExpress />
              <UnionPay />
              <MNT />
              <JCB />
            </div>
          </div>
        </div>
      </div>

      <hr className="bg-white/20  hidden md:flex" />
      <div className="container mx-auto">
        <div className="text-base text-center">
          © 2024 TTR Mongolia All Rights Reserved.
        </div>
      </div>
    </div>
  );
};
{
  /* <div className="flex flex-row gap-4">
<Link href="https://www.facebook.com/GoNomadic">
  <div className="rounded-full p-2 bg-secondary">
    <Facebook />
  </div>
</Link>
<Link href="https://www.instagram.com/ttr_mongolia/">
  <div className="rounded-full p-2 bg-secondary">
    <Instagram />
  </div>
</Link>
</div> */
}
