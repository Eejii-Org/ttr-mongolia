import { ToastContainer } from "react-toastify";
import { Footer } from "./footer";
import { Header } from "./header";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import path from "path";

export const MainLayout = ({
  children,
  headerTransparent = false,
}: {
  children: React.ReactNode;
  headerTransparent?: boolean;
}) => {
  const pathname = usePathname();
  const [scrolled, setIsScrolled] = useState(false);
  const [isPrivateToursVisible, setIsPrivateToursVisible] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY == 0) {
        setIsScrolled(false);
      } else {
        if (!scrolled) {
          setIsScrolled(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="flex-1 w-full flex flex-col min-h-screen justify-between">
      <ToastContainer />
      <div className="flex flex-col flex-1">
        <Header
          isPrivateToursVisible={isPrivateToursVisible}
          setIsPrivateToursVisible={setIsPrivateToursVisible}
          transparent={headerTransparent ? !scrolled : false}
          isScrolled={scrolled}
        />
        <div
          className={`flex flex-col gap-16 flex-1 ${
            pathname == "/" || pathname.includes("/tours/") ? "" : "mt-16"
          } ${
            isPrivateToursVisible && pathname == "/tours"
              ? "pt-24 sm:pt-20 md:pt-16"
              : ""
          }`}
        >
          {children}
        </div>
        <a
          className="sticky bottom-8 left-[calc(100vw-104px)] w-[72px] h-[72.45px] z-30"
          href="https://wa.me/97688113977"
        >
          <Image src="/static/whatsapp.svg" alt="whatsapp" fill />
        </a>
      </div>
      <Footer />
    </div>
  );
};
