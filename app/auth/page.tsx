"use client";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@components";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

const Auth = () => {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const signInWithEmail = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data, error);
    setLoading(false);
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) {
          setUser(session?.user);
          console.log(session.user.email);
          console.log("we have user");
          return;
        }
        setUser(null);
        console.log("we dont have user");
      } catch (e: any) {
        console.error(e.message);
      }
    };
    getUser();
  }, []);

  return (
    <div className="w-screen flex-1 xl:w-[calc(1024px)] p-4 mx-auto flex flex-col items-center gap-6 justify-center">
      <div className="text-2xl font-semibold lg:text-4xl">Authenticate</div>

      <div className="bg-quinary p-3 md:p-4 rounded-xl w-full md:w-96 flex">
        <form
          className="flex flex-col gap-3 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (loading) return;
            if (user) {
              signOut();
              return;
            }
            signInWithEmail();
          }}
        >
          {user ? (
            <div>
              <div className="text-[#c1c1c1] font-medium text-base">
                Authenticated
              </div>
              <div className="font-medium text-lg text-center">
                {user.email}
              </div>
            </div>
          ) : (
            <>
              <Input
                value={email}
                type={"email"}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                value={password}
                type={"password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          <button
            type="submit"
            className="bg-primary px-4 py-3 width-full text-center items-center flex justify-center text-secondary whitespace-nowrap font-bold rounded-xl ripple"
          >
            {loading ? (
              <span className="loader h-6 w-6"></span>
            ) : user ? (
              "Sign Out"
            ) : (
              "Sign In"
            )}
          </button>
          {user && (
            <Link
              href="/admin"
              className="bg-secondary px-4 py-3 width-full text-center items-center flex justify-center text-tertiary whitespace-nowrap font-semibold rounded-xl ripple"
            >
              Go To Admin Page
            </Link>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
