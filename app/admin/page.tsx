"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) {
          console.log("we have user");
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
    <div>
      <h1>Admin Page</h1>
      {/* Add your admin page content here */}
    </div>
  );
}
