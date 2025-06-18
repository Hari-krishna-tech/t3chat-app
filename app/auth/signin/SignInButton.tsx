"use client";

import { signIn } from "next-auth/react";

export default function SignInButton({ provider }: { provider: any }) {
  return (
    <button
      onClick={() => signIn(provider.id, { callbackUrl: '/' })}
      className="flex w-full items-center justify-center space-x-3 rounded-lg bg-[rgb(var(--accent-primary-rgb))] px-4 py-3 text-[rgb(var(--foreground-rgb))] transition-all hover:bg-[rgb(var(--accent-primary-dark-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-primary-rgb))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--background-dark-rgb))]"
    >
      <span className="font-medium">Sign in with {provider.name}</span>
    </button>
  );
} 