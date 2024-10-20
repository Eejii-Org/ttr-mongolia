"use client";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "./dashboardlayout";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data?.user) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        router.push("/auth");
      } catch (e: any) {
        console.error(e.message);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading || !isAuthenticated) {
    return <div>Loading</div>;
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      {children}
    </DashboardLayout>
  );
}
