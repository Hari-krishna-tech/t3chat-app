import { getProviders } from "next-auth/react";
import SignInButton from "./SignInButton";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(var(--background-rgb))]">
      {/* Brand Header */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--accent-primary-rgb))] text-2xl font-bold text-[rgb(var(--foreground-rgb))]">
            T3
          </div>
          <span className="text-2xl font-bold text-[rgb(var(--foreground-rgb))]">.chat</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Hero Section */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-[rgb(var(--foreground-rgb))]">
                Chat with Multiple AI Models
              </h1>
              <p className="text-xl text-[rgb(var(--foreground-rgb))] opacity-80">
                Experience the power of multiple LLMs in one seamless interface. Cost-effective, efficient, and user-friendly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[rgb(var(--accent-primary-rgb))]" />
                <span className="text-[rgb(var(--foreground-rgb))]">Multiple LLM Support - Choose the best model for your needs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[rgb(var(--accent-primary-rgb))]" />
                <span className="text-[rgb(var(--foreground-rgb))]">Cost-effective - Pay only for what you use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[rgb(var(--accent-primary-rgb))]" />
                <span className="text-[rgb(var(--foreground-rgb))]">Seamless Experience - Clean, intuitive interface</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[rgb(var(--accent-primary-rgb))]" />
                <span className="text-[rgb(var(--foreground-rgb))]">Real-time Responses - Fast and efficient interactions</span>
              </div>
            </div>
          </div>

          {/* Sign In Section */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-[rgb(var(--background-dark-rgb))] p-8 shadow-lg">
              <div>
                <div className="flex justify-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--accent-primary-rgb))] text-2xl font-bold text-[rgb(var(--foreground-rgb))]">
                    T3
                  </div>
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-[rgb(var(--foreground-rgb))]">
                  Start Chatting Now
                </h2>
                <p className="mt-2 text-center text-sm text-[rgb(var(--foreground-rgb))] opacity-70">
                  Sign in to access multiple AI models and start your conversation
                </p>
              </div>
              <div className="mt-8 space-y-4">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <SignInButton key={provider.id} provider={provider} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-sm text-[rgb(var(--foreground-rgb))] opacity-50">
        Powered by T3.chat - Your AI Chat Platform
      </div>
    </div>
  );
} 