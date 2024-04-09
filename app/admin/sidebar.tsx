"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export const AdminSidebar = () => {
  const pathname = usePathname();
  return (
    <div className="bg-tertiary border-r w-64 p-4 flex flex-col">
      <Link
        href="/admin"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b text-primary ${
          pathname == "/admin" ? "text-primary" : "text-secondary"
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/admin/intro"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b text-primary ${
          pathname == "/admin/intro" ? "text-primary" : "text-secondary"
        }`}
      >
        Intro
      </Link>
      <Link
        href="/admin/tours"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b text-primary ${
          pathname.includes("/admin/tours") ? "text-primary" : "text-secondary"
        }`}
      >
        Tours
      </Link>
      <Link
        href="/admin/scheduledtours"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b ${
          pathname.includes("/admin/scheduledtours")
            ? "text-primary"
            : "text-secondary"
        }`}
      >
        ScheduledTours
      </Link>
      <Link
        href="/admin/categories"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b ${
          pathname.includes("/admin/categories")
            ? "text-primary"
            : "text-secondary"
        }`}
      >
        Categories
      </Link>
      <Link
        href="/admin/reviews"
        className={`px-2 py-2 hover:bg-black/10 font-medium ${
          pathname == "/admin/reviews" ? "text-primary" : "text-secondary"
        }`}
      >
        Reviews
      </Link>
    </div>
  );
};
