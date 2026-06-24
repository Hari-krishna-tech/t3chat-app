"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MODELS } from "@/lib/models";
import { useTheme } from "@/app/context/ThemeContext";
import { ProviderIcon } from "@/components/ProviderIcon";
import { themes } from "@/lib/themes";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentTheme, setTheme } = useTheme();

  const [preferredName, setPreferredName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [traitsList, setTraitsList] = useState<string[]>([]);
  const [traitsInput, setTraitsInput] = useState("");
  const [aboutUser, setAboutUser] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setPreferredName(data.preferredName || "");
        setOccupation(data.occupation || "");
        setAboutUser(data.aboutUser || "");
        if (data.traits) {
          setTraitsList(data.traits.split(",").map((t: string) => t.trim()).filter(Boolean));
        } else {
          setTraitsList([]);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const handleTraitsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const val = traitsInput.trim().toLowerCase();
      if (val && !traitsList.includes(val)) {
        const newTraits = [...traitsList, val];
        if (newTraits.join(",").length <= 100) {
          setTraitsList(newTraits);
          setTraitsInput("");
        }
      }
    }
  };

  const togglePresetTrait = (trait: string) => {
    if (traitsList.includes(trait)) {
      setTraitsList(prev => prev.filter(t => t !== trait));
    } else {
      const newTraits = [...traitsList, trait];
      if (newTraits.join(",").length <= 100) {
        setTraitsList(newTraits);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredName: preferredName.slice(0, 50),
          occupation: occupation.slice(0, 100),
          traits: traitsList.join(","),
          aboutUser: aboutUser.slice(0, 3000),
        }),
      });
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-foreground gap-3">
        <div className="w-8 h-8 border-3 border-accent-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-zinc-500 font-medium">Loading settings...</span>
      </div>
    );
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google': return 'bg-blue-500/10 text-blue-400 border-blue-500/15';
      case 'openai': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
      case 'anthropic': return 'bg-amber-500/10 text-amber-400 border-amber-500/15';
      case 'qwen': return 'bg-purple-500/10 text-purple-400 border-purple-500/15';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google';
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      case 'qwen': return 'Qwen';
      default: return provider;
    }
  };

  return (
    <div className="h-[100dvh] bg-transparent text-foreground overflow-y-auto px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-[calc(3rem+env(safe-area-inset-bottom))] animate-fade-in">
        
        {/* Header navigation bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] text-zinc-400 hover:text-zinc-200 rounded-xl h-10 w-10 transition-all cursor-pointer active:scale-95"
              title="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100">Settings</h1>
              <p className="text-[10px] sm:text-xs text-zinc-500">Manage your workspace configuration and preferences</p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="bg-red-500/[0.08] border border-red-500/15 text-red-400 hover:bg-red-500/[0.15] hover:border-red-500/25 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-medium transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Sign Out
          </button>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* User Profile Section */}
          <section className="bg-surface-1/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-16 h-16 rounded-2xl border border-white/[0.08] object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-accent-primary flex items-center justify-center text-2xl font-bold text-white shadow-sm shadow-accent-primary/20">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background-dark rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-semibold text-zinc-100 truncate">{session?.user?.name || "User Workspace"}</div>
                <div className="text-xs text-zinc-500 truncate">{session?.user?.email}</div>
                <div className="text-[9px] bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 rounded-full text-zinc-500 font-medium inline-block mt-2.5">
                  Standard Account
                </div>
              </div>
            </div>

            {/* Total Limits widget */}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full sm:w-auto sm:min-w-[150px] flex flex-col justify-center">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total API Limits</div>
              <div className="text-xl font-black text-accent-primary mt-1">1,500 <span className="text-xs font-normal text-zinc-400">/mo</span></div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mt-2.5">
                <div className="bg-accent-primary h-full rounded-full" style={{ width: '4%' }} />
              </div>
            </div>
          </section>

          {/* Theme Settings Section */}
          <section className="bg-surface-1/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/[0.06]">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-zinc-100">Theme Settings</h2>
              <p className="text-xs text-zinc-500 mt-1">Customize your editor interface color palette</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {themes.map((theme) => {
                const isActive = currentTheme.name === theme.name;
                return (
                  <button
                    key={theme.name}
                    onClick={() => setTheme(theme)}
                    className={`group text-left p-3 sm:p-4 rounded-xl border transition-all duration-300 relative flex flex-col cursor-pointer active:scale-[0.98] select-none
                      ${isActive
                        ? "border-accent-primary/40 bg-accent-primary/[0.05] shadow-sm shadow-accent-primary/10"
                        : "border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]"
                      }`}
                  >
                    {/* Theme header */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-4 h-4 rounded-full border border-white/[0.08] shrink-0 shadow-sm"
                          style={{ background: `rgb(${theme.colors.accentPrimary})` }}
                        />
                        <span className="text-xs font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors">
                          {theme.name}
                        </span>
                      </div>
                      
                      {isActive && (
                        <div className="flex items-center justify-center bg-accent-primary text-white rounded-full h-4 w-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Simulating Palette Preview cards */}
                    <div className="mt-3 bg-black/20 border border-white/[0.04] p-1.5 rounded-lg flex gap-1.5 items-center w-full justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono">Palette</span>
                      <div className="flex gap-1 shrink-0">
                        {/* Background */}
                        <div 
                          className="w-4 h-4 rounded-md border border-white/[0.08]" 
                          style={{ background: `rgb(${theme.colors.background})` }}
                          title="Background"
                        />
                        {/* Sidebar bg */}
                        <div 
                          className="w-4 h-4 rounded-md border border-white/[0.08]" 
                          style={{ background: `rgb(${theme.colors.backgroundDark})` }}
                          title="Sidebar"
                        />
                        {/* Accent */}
                        <div 
                          className="w-4 h-4 rounded-md border border-white/[0.08]" 
                          style={{ background: `rgb(${theme.colors.accentPrimary})` }}
                          title="Accent"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Customize T3 Chat Section */}
          <section className="bg-surface-1/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/[0.06] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-100">Customize T3 Chat</h2>
                <div className="relative group inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 cursor-help transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.054.955l-1.5 4.0h.018a.75.75 0 11-1.071-.852l1.5-4.0zm0-4.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-72 p-3 bg-surface-2 border border-white/[0.08] text-[11px] text-zinc-400 rounded-xl shadow-2xl z-50 leading-relaxed pointer-events-none transition-all duration-200">
                    Add custom instructions and behavioral traits that will be injected into the system prompt for every thread, tailored specifically to you.
                  </div>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-500">Provide details to customize AI behavior</p>
            </div>

            {isLoadingProfile ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-zinc-500 font-medium">Loading preferences...</span>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Preferred Name */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="preferredName" className="text-xs font-semibold text-zinc-300">
                      What should T3 Chat call you?
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {preferredName.length}/50
                    </span>
                  </div>
                  <input
                    id="preferredName"
                    type="text"
                    maxLength={50}
                    placeholder="Enter your name"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/[0.02] border border-white/[0.06] text-foreground placeholder-zinc-600 rounded-xl focus:outline-none focus:border-accent-primary/40 focus:ring-1 focus:ring-accent-primary/20 transition-all duration-200"
                  />
                </div>

                {/* Occupation */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="occupation" className="text-xs font-semibold text-zinc-300">
                      What do you do?
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {occupation.length}/100
                    </span>
                  </div>
                  <input
                    id="occupation"
                    type="text"
                    maxLength={100}
                    placeholder="Engineer, student, etc."
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/[0.02] border border-white/[0.06] text-foreground placeholder-zinc-600 rounded-xl focus:outline-none focus:border-accent-primary/40 focus:ring-1 focus:ring-accent-primary/20 transition-all duration-200"
                  />
                </div>

                {/* Traits Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-zinc-300">
                      What traits should T3 Chat have?
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {traitsList.join(",").length}/100
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 min-h-[46px] bg-white/[0.02] border border-white/[0.06] rounded-xl focus-within:border-accent-primary/40 focus-within:ring-1 focus-within:ring-accent-primary/20 transition-all duration-200">
                    {traitsList.map((trait) => (
                      <span
                        key={trait}
                        className="flex items-center gap-1 bg-accent-primary/[0.08] text-accent-primary border border-accent-primary/15 text-xs px-2 py-0.5 rounded-lg font-medium"
                      >
                        <span>{trait}</span>
                        <button
                          type="button"
                          onClick={() => setTraitsList((prev) => prev.filter((t) => t !== trait))}
                          className="hover:text-red-400 text-zinc-500 font-bold ml-0.5 text-[11px] cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={traitsList.length === 0 ? "Type a trait and press Enter or Tab..." : ""}
                      className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-foreground placeholder-zinc-600 py-1 px-1.5"
                      value={traitsInput}
                      onChange={(e) => setTraitsInput(e.target.value)}
                      onKeyDown={handleTraitsKeyDown}
                      maxLength={50}
                    />
                  </div>

                  {/* Preset tag pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2 select-none">
                    {['friendly', 'witty', 'concise', 'curious', 'empathetic', 'creative', 'patient'].map((trait) => {
                      const isActive = traitsList.includes(trait);
                      return (
                        <button
                          key={trait}
                          type="button"
                          onClick={() => togglePresetTrait(trait)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-1 active:scale-95 font-medium
                            ${isActive
                              ? "bg-accent-primary/20 text-accent-primary border-accent-primary/30"
                              : "bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-zinc-300"
                            }`}
                        >
                          <span>{trait}</span>
                          <span>{isActive ? '✓' : '+'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* About User */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="aboutUser" className="text-xs font-semibold text-zinc-300">
                      Anything else T3 Chat should know about you?
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {aboutUser.length}/3000
                    </span>
                  </div>
                  <textarea
                    id="aboutUser"
                    maxLength={3000}
                    rows={4}
                    placeholder="Interests, values, or preferences to keep in mind"
                    value={aboutUser}
                    onChange={(e) => setAboutUser(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/[0.02] border border-white/[0.06] text-foreground placeholder-zinc-600 rounded-xl focus:outline-none focus:border-accent-primary/40 focus:ring-1 focus:ring-accent-primary/20 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {saveStatus === 'success' && (
                    <span className="text-xs text-green-400 flex items-center gap-1 animate-fade-in font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Preferences saved successfully!
                    </span>
                  )}
                  {saveStatus === 'error' && (
                    <span className="text-xs text-red-400 flex items-center gap-1 animate-fade-in font-medium">
                      Error saving preferences.
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-accent-primary hover:bg-accent-primary-dark text-white disabled:bg-accent-primary/50 disabled:cursor-not-allowed rounded-xl px-5 py-2.5 text-xs font-semibold shadow-md shadow-accent-primary/10 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    {isSaving && (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    Save Preferences
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Model Availability Section */}
          <section className="bg-surface-1/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/[0.06]">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-zinc-100">Available Models</h2>
              <p className="text-xs text-zinc-500 mt-1">Explore AI models supported by your API workspace key</p>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {MODELS.map((model) => (
                <li 
                  key={model.id} 
                  className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 sm:p-4 flex flex-col justify-between gap-2 sm:gap-3 hover:border-white/[0.08] transition-all duration-200"
                >
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-zinc-200 truncate">{model.name}</span>
                      <span 
                        className={`inline-flex items-center justify-center p-1 rounded-lg border shrink-0 ${getProviderColor(model.provider)}`}
                        title={getProviderLabel(model.provider)}
                      >
                        <ProviderIcon provider={model.provider} className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                      {model.description}
                    </p>
                  </div>
                  
                  {/* Model specifications footer info */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-white/[0.04]">
                    <div className="flex gap-3">
                      <span>Max Tokens: <strong className="text-zinc-400">{model.maxTokens.toLocaleString()}</strong></span>
                    </div>
                    <span className="text-green-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Active
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

        </div>

      </div>
    </div>
  );
}