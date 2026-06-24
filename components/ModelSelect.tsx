"use client";

import React, { useState, useRef, useEffect } from "react";
import { ModelType, MODELS } from "@/lib/models";
import { ProviderIcon } from "./ProviderIcon";

interface ModelSelectProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  align?: 'left' | 'right';
}

export default function ModelSelect({ selectedModel, onModelChange, align = 'left' }: ModelSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelConfig = MODELS.find((m) => m.id === selectedModel);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google': return 'bg-blue-500 shadow-blue-500/30';
      case 'openai': return 'bg-[#10a37f] shadow-[#10a37f]/30';
      case 'anthropic': return 'bg-[#d97706] shadow-[#d97706]/30';
      case 'qwen': return 'bg-purple-500 shadow-purple-500/30';
      default: return 'bg-zinc-500';
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

  const getProviderTextColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google': return 'text-blue-400';
      case 'openai': return 'text-emerald-400';
      case 'anthropic': return 'text-amber-400';
      case 'qwen': return 'text-purple-400';
      default: return 'text-zinc-400';
    }
  };

  const getProviderBadgeStyle = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google': return 'bg-blue-500/10 text-blue-400 border-blue-500/15';
      case 'openai': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
      case 'anthropic': return 'bg-amber-500/10 text-amber-400 border-amber-500/15';
      case 'qwen': return 'bg-purple-500/10 text-purple-400 border-purple-500/15';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const groupedModels = MODELS.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, typeof MODELS>);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Pill selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-white/[0.08] border border-white/[0.12] text-zinc-300 hover:text-zinc-100 hover:bg-white/[0.12] rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer"
      >
        {selectedModelConfig ? (
          <ProviderIcon provider={selectedModelConfig.provider} className={`w-3.5 h-3.5 ${getProviderTextColor(selectedModelConfig.provider)}`} />
        ) : (
          <span className="w-2 h-2 rounded-full bg-zinc-500 shadow-sm" />
        )}
        <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{selectedModelConfig?.name}</span>
        <svg
          className={`w-3.5 h-3.5 text-zinc-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div 
          className={`absolute mt-2 w-[calc(100vw-24px)] max-w-72 max-h-[60vh] sm:max-h-[350px] overflow-y-auto bg-surface-2/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 p-1 z-50 animate-scale-in
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {Object.entries(groupedModels).map(([provider, models]) => (
            <div key={provider}>
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-zinc-500 tracking-wider uppercase flex items-center gap-1.5">
                <ProviderIcon provider={provider} className={`w-3.5 h-3.5 ${getProviderTextColor(provider)}`} />
                {getProviderLabel(provider)}
              </div>
              {models.map((model) => {
                const isSelected = model.id === selectedModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 text-left rounded-lg transition-all duration-200 flex items-start justify-between gap-3
                      ${isSelected 
                        ? "bg-accent-primary/[0.08] text-accent-primary" 
                        : "hover:bg-white/[0.04] text-zinc-300 hover:text-foreground"}
                    `}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className={`inline-flex items-center justify-center p-0.5 rounded border shrink-0 ${getProviderBadgeStyle(model.provider)}`}
                          title={getProviderLabel(model.provider)}
                        >
                          <ProviderIcon provider={model.provider} className="w-2.5 h-2.5" />
                        </span>
                        <span className="font-semibold text-xs truncate">{model.name}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {model.description}
                      </div>
                    </div>

                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 shrink-0 text-accent-primary mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}