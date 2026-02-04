"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !data?.session) {
      router.push("/sign-in");
    }
  }, [isPending, data, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6">
      <div className="w-full max-w-md space-y-6">

        {/* Profile Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center text-center space-y-4">

            {/* Avatar */}
            <div className="relative">
              <Image
                src={data?.user?.image || "/vercel.svg"}
                alt={data?.user?.name || "User"}
                width={120}
                height={120}
                className="rounded-full border-4 border-zinc-800 object-cover"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome, {data?.user?.name || "User"}
              </h1>
              <p className="text-sm text-zinc-400 mt-1">Authenticated User</p>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6 space-y-4 shadow-lg shadow-black/30">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
              Email Address
            </p>
            <p className="text-base text-zinc-100 break-all mt-1">
              {data?.user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <div className="flex-1 border-t border-dashed border-zinc-700"></div>
            <span className="text-xs text-zinc-500">Session Active</span>
            <div className="flex-1 border-t border-dashed border-zinc-700"></div>
          </div>

          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push("/sign-in"),
                },
              })
            }
            className="w-full h-11 mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
          >
            Sign Out
          </Button>
        </div>

      </div>
    </div>
  );
}
