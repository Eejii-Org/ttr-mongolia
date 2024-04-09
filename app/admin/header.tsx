"use client";
import Link from "next/link";
import { SignOutIcon } from "../../components/icons";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export const AdminHeader = () => {
  const supabase = createClient();
  const router = useRouter();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.error(error);
    router.push("/auth");
  };
  return (
    <div
      className={`py-3 px-3 md:px-6 bg-tertiary flex flex-row justify-between items-center w-screen top-0 fixed z-40 border-b`}
    >
      <Link href="/admin">
        <div className="font-semibold text-2xl cursor-pointer">
          TTR Mongolia
        </div>
      </Link>
      <button onClick={signOut} className="flex flex-row gap-2">
        Log Out
        <SignOutIcon />
      </button>
    </div>
  );
};