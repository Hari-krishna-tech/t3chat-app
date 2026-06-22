import React from "react";
import { getProviders } from "next-auth/react";
import SignInButton from "./SignInButton";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden select-none px-4">
      {/* Ambient Glowing Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-accent-primary/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-accent-primary-dark/15 blur-[130px] pointer-events-none z-0" />

      {/* Brand Header */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-primary text-white font-black text-md shadow-md shadow-accent-primary/20">
            T3
          </div>
          <span className="text-xl font-extrabold tracking-tight">T3.chat</span>
        </div>
      </div>

      <div className="container mx-auto px-4 z-10 max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          {/* Hero Section */}
          <div className="flex flex-col justify-center space-y-8 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-xs font-semibold text-accent-primary">
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse" />
                Multiple LLMs, One Workspace
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] bg-gradient-to-r from-foreground via-foreground to-accent-primary bg-clip-text text-transparent">
                Chat with Multiple AI Models
              </h1>
              <p className="text-md text-zinc-400 max-w-lg leading-relaxed">
                Experience the power of Google Gemini, OpenAI GPT, Anthropic Claude, and Qwen in a single, fluid chat workspace.
              </p>
            </div>
            
            <div className="space-y-4 font-sans text-sm text-zinc-400">
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-lg bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center shrink-0 mt-0.5 text-accent-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>Multi-Model Select</strong>: Toggle between flagship AI engines in real-time.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-lg bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center shrink-0 mt-0.5 text-accent-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>Context Preservation</strong>: Seamlessly switch threads while maintaining logs.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-lg bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center shrink-0 mt-0.5 text-accent-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span><strong>Curated Palette Themes</strong>: Personalize your workspace editor themes.</span>
              </div>
            </div>
          </div>

          {/* Sign In Section Card */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-6 rounded-2xl glass-panel p-8 shadow-2xl border border-foreground/[0.08] relative">
              <div className="space-y-2 text-center">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Welcome to T3.chat
                </h2>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Sign in using Google SSO to initialize your multiple model chat panel
                </p>
              </div>
              
              <div className="pt-2">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <SignInButton key={provider.id} provider={provider} />
                  ))}
              </div>

              <div className="text-[10px] text-zinc-600 text-center pt-2">
                By logging in you agree to our Terms and Workspace Guidelines.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-[11px] text-zinc-600 font-medium">
        Powered by T3.chat &copy; {new Date().getFullYear()} - All Rights Reserved
      </div>
    </div>
  );
} 