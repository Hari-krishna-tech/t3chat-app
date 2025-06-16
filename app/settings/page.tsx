"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* User Settings Section */}
        <section className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-2xl font-bold">
                  {session?.user?.name?.[0] || "U"}
                </div>
              )}
              <div>
                <div className="text-lg font-semibold">{session?.user?.name}</div>
                <div className="text-zinc-400">{session?.user?.email}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Model Limits Section */}
        <section className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Model Limits</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Daily Message Limit</div>
                <div className="text-sm text-zinc-400">Messages remaining today</div>
              </div>
              <div className="text-lg font-semibold">50/100</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Token Usage</div>
                <div className="text-sm text-zinc-400">Current billing period</div>
              </div>
              <div className="text-lg font-semibold">1,234 / 10,000</div>
            </div>
          </div>
        </section>

        {/* Model Availability Section */}
        <section className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Model Availability</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">GPT-4</div>
                <div className="text-sm text-zinc-400">Available for your plan</div>
              </div>
              <div className="text-green-500">Available</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Claude</div>
                <div className="text-sm text-zinc-400">Available for your plan</div>
              </div>
              <div className="text-green-500">Available</div>
            </div>
          </div>
        </section>

        {/* Sign Out Button */}
        <div className="flex justify-end">
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 