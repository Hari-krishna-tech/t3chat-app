"use client";

import { signIn } from "next-auth/react";

export default function SignInButton({ provider }: { provider: any }) {
  return (
    <button
      onClick={() => signIn(provider.id, { callbackUrl: '/' })}
      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Sign in with {provider.name}
    </button>
  );
} 