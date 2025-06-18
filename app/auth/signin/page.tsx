import { getProviders } from "next-auth/react";
import SignInButton from "./SignInButton";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(var(--background-rgb))]">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Hero Section */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-[rgb(var(--foreground-rgb))]">
              Chat with Multiple AI Models
            </h1>
            <p className="text-xl text-[rgb(var(--foreground-rgb))] opacity-80">
              Experience the power of multiple LLMs in one seamless interface. Cost-effective, efficient, and user-friendly.
            </p>
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
    </div>
  );
} 