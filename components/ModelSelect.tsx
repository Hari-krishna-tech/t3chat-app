"use client";

import { useState, useRef, useEffect } from "react";
import { ModelType, MODELS } from "@/lib/models";

interface ModelSelectProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export default function ModelSelect({ selectedModel, onModelChange }: ModelSelectProps) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-background-dark hover:bg-accent-primary/20 text-foreground rounded-lg transition-colors border border-background-dark shadow"
      >
        <span>{selectedModelConfig?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 w-64 bg-background-dark rounded-lg shadow-lg border border-accent-primary z-50">
          <div className="py-1">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors rounded-lg
                  ${model.id === selectedModel ? "bg-accent-primary/30 text-accent-primary font-bold" : "hover:bg-accent-primary/10 hover:text-accent-primary"}
                `}
              >
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-zinc-400">{model.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 