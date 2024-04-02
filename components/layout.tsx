import { Footer } from "./footer";
import { Header } from "./header";
import Image from "next/image";

export const MainLayout = ({
  children,
  headerTransparent = false,
}: {
  children: React.ReactNode;
  headerTransparent?: boolean;
}) => {
  return (
    <div className="flex-1 w-full flex flex-col min-h-screen justify-between">
      <div className="flex flex-col gap-16 flex-1 relative">
        <Header transparent={headerTransparent} />
        <div className="flex flex-col gap-16 flex-1 h-full">{children}</div>
        <a
          className="sticky bottom-8 left-[calc(100vw-104px)] w-[72px] h-[72.45px] z-30"
          href="https://wa.me/97688113977"
        >
          <Image src="/static/whatsapp.png" alt="whatsapp" fill unoptimized />
        </a>
      </div>
      <Footer />
    </div>
  );
};
