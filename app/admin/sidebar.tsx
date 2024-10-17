"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

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
          pathname.includes("/admin/intro") ? "text-primary" : "text-secondary"
        }`}
      >
        Intro
      </Link>
      <Link
        href="/admin/tours"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b text-primary ${
          pathname.includes("admin/tours") ? "text-primary" : "text-secondary"
        }`}
      >
        Tours
      </Link>
      <Link
        href="/admin/blogs"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b text-primary ${
          pathname.includes("admin/blogs") ? "text-primary" : "text-secondary"
        }`}
      >
        Blogs
      </Link>
      <Link
        href="/admin/rentalcars"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b text-primary ${
          pathname.includes("admin/rentalcars")
            ? "text-primary"
            : "text-secondary"
        }`}
      >
        Rental Cars
      </Link>
      <Link
        href="/admin/departurerequests"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b text-primary ${
          pathname.includes("admin/departurerequests")
            ? "text-primary"
            : "text-secondary"
        }`}
      >
        Departure Requests
      </Link>
      <Link
        href="/admin/categories"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b ${
          pathname.includes("admin/categories")
            ? "text-primary"
            : "text-secondary"
        }`}
      >
        Categories
      </Link>
      <Link
        href="/admin/reviews"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b ${
          pathname.includes("admin/reviews") ? "text-primary" : "text-secondary"
        }`}
      >
        Reviews
      </Link>
      <Link
        href="/admin/transactions"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b ${
          pathname.includes("admin/transactions")
            ? "text-primary"
            : "text-secondary"
        }`}
      >
        Transactions
      </Link>
      <Link
        href="/admin/customtransactions"
        className={`px-2 py-2 hover:bg-black/10 font-medium border-b ${
          pathname.includes("admin/customtransactions")
            ? "text-primary"
            : "text-secondary"
        }`}
      >
        Custom Transactions
      </Link>
      <Link
        href="/admin/members"
        className={`px-2 py-2 hover:bg-black/10 font-medium ${
          pathname.includes("admin/members") ? "text-primary" : "text-secondary"
        }`}
      >
        Members
      </Link>
    </div>
  );
};
