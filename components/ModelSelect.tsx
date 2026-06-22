"use client";

import React, { useState, useRef, useEffect } from "react";
import { ModelType, MODELS } from "@/lib/models";

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Pill selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-foreground/[0.03] border border-foreground/[0.06] text-zinc-300 hover:text-foreground hover:bg-foreground/[0.08] rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
      >
        <span className={`w-2 h-2 rounded-full ${selectedModelConfig ? getProviderColor(selectedModelConfig.provider) : 'bg-zinc-500'} shadow-sm`} />
        <span className="truncate max-w-[120px] sm:max-w-none">{selectedModelConfig?.name}</span>
        <svg
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-foreground" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Glassmorphic Dropdown List */}
      {isOpen && (
        <div 
          className={`absolute mt-2 w-72 max-h-[350px] overflow-y-auto glass-panel shadow-2xl rounded-2xl p-1.5 z-50 border border-foreground/[0.08] animate-in fade-in slide-in-from-top-2 duration-200
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-500 tracking-wider uppercase border-b border-foreground/[0.04] mb-1">
            Choose AI Model
          </div>
          <div className="space-y-1">
            {MODELS.map((model) => {
              const isSelected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left rounded-xl transition-all duration-200 flex items-start justify-between gap-3 border border-transparent
                    ${isSelected 
                      ? "bg-accent-primary/10 border-accent-primary/20 text-accent-primary" 
                      : "hover:bg-foreground/[0.03] text-zinc-300 hover:text-foreground"}
                  `}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${getProviderColor(model.provider)}`} />
                      <span className="font-semibold text-xs truncate">{model.name}</span>
                      <span className="text-[9px] bg-foreground/[0.05] px-1.5 py-0.5 rounded text-zinc-400 font-medium">
                        {getProviderLabel(model.provider)}
                      </span>
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
        </div>
      )}
    </div>
  );
} 