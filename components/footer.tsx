import Link from "next/link";
import { Facebook, Instagram } from "./icons";

export const Footer = () => {
  return (
    <div className="bg-quinary p-6 flex flex-col gap-2 m-3 md:m-6 rounded-3xl">
      <div className="flex flex-row justify-between">
        <div className="text-base">Contact Us</div>
        <div className="flex flex-row gap-4">
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
        </div>
      </div>
      <hr />
      <div className="text-base text-center">
        © 2024 TTR Mongolia All Rights Reserved.
      </div>
    </div>
  );
};
