"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MODELS } from "@/lib/models";
import { useTheme } from "@/app/context/ThemeContext";
import { themes } from "@/lib/themes";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentTheme, setTheme } = useTheme();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen bg-background text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-accent-primary hover:bg-accent-primary-dark text-white rounded-lg font-semibold shadow transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-accent-primary">Settings</h1>
        </div>

        {/* Theme Settings Section */}
        <section className="bg-background-dark rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setTheme(theme)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentTheme.name === theme.name
                    ? "border-accent-primary bg-accent-primary/10"
                    : "border-background hover:border-accent-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: `rgb(${theme.colors.accentPrimary})`,
                    }}
                  />
                  <span className="font-medium">{theme.name}</span>
                </div>
                <div className="mt-2 flex gap-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      background: `rgb(${theme.colors.background})`,
                    }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      background: `rgb(${theme.colors.backgroundDark})`,
                    }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      background: `rgb(${theme.colors.accentPrimary})`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* User Settings Section */}
        <section className="bg-background-dark rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">User Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full border-2 border-accent-primary shadow"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-2xl font-bold text-white shadow">
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

        {/* Request Limit Section */}
        <section className="bg-background-dark rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Request Limit</h2>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Total Request Limit</div>
              <div className="text-sm text-zinc-400">Maximum requests allowed</div>
            </div>
            <div className="text-lg font-semibold text-accent-primary">1500</div>
          </div>
        </section>

        {/* Model Availability Section */}
        <section className="bg-background-dark rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Available Models</h2>
          <ul className="space-y-4">
            {MODELS.map((model) => (
              <li key={model.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-background rounded-lg p-4">
                <div>
                  <div className="font-medium text-accent-primary">{model.name}</div>
                  <div className="text-sm text-zinc-400">{model.description}</div>
                  <div className="text-xs text-zinc-500 mt-1">Provider: {model.provider}, Max Tokens: {model.maxTokens.toLocaleString()}</div>
                </div>
                <div className="text-green-400 font-semibold text-sm">Available</div>
              </li>
            ))}
          </ul>
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