import { AdminHeader } from "./header";
import { AdminSidebar } from "./sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  icons: ["/favicon.ico"],
  robots: "noindex,nofollow",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader />
      <div className="flex-1 bg-quaternary w-full h-full max-h-[calc(100vh-56px) mt-14 flex flex-row">
        <AdminSidebar />
        <div className="max-h-[calc(100vh-56px)] overflow-y-scroll flex-1 relative flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
