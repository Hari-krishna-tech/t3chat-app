import React from "react";

interface ProviderIconProps {
  provider: string;
  className?: string;
}

export function ProviderIcon({ provider, className = "w-3.5 h-3.5" }: ProviderIconProps) {
  const normProvider = provider.toLowerCase();

  switch (normProvider) {
    case "google":
      // Google Gemini sparkle logo SVG
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2c0 5.523-4.477 10-10 10 5.523 0 10 4.477 10 10 0-5.523 4.477-10 10-10-5.523 0-10-4.477-10-10z" />
        </svg>
      );

    case "openai":
      // OpenAI flower spiral logo SVG
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M21.3 10.92a5.27 5.27 0 0 0-2.3-4.2c.07-.15.11-.31.11-.48a5.22 5.22 0 0 0-5.23-5.23c-.5 0-.96.11-1.39.31a5.27 5.27 0 0 0-4.22-2.3A5.22 5.22 0 0 0 3.04 4.25c-.15-.07-.31-.11-.48-.11a5.22 5.22 0 0 0-2.3 9.38c.07.15.11.31.11.48a5.22 5.22 0 0 0 5.23 5.23c.5 0 .96-.11 1.39-.31a5.27 5.27 0 0 0 4.22 2.3 5.22 5.22 0 0 0 5.23-5.23c.15.07.31.11.48.11a5.22 5.22 0 0 0 2.3-9.38c-.07-.15-.11-.31-.11-.48a5.2 5.2 0 0 0 1.91-1.33zm-9.35 8.92a3.63 3.63 0 0 1-1.82-.49l2.4-1.39a.9.9 0 0 0 .45-.78v-3.48l1.91 1.1c.1.06.16.17.16.29v2.93A3.63 3.63 0 0 1 11.95 19.84zm-6.5-2.73a3.63 3.63 0 0 1-.91-1.58l2.4-1.39a.9.9 0 0 0 .45-.78v-3.48l1.91 1.1c.1.06.16.17.16.29v2.93A3.63 3.63 0 0 1 5.45 17.11zm-2.03-6.5a3.63 3.63 0 0 1 1.82-.49l2.4 1.39a.9.9 0 0 0 .45.78v3.48l-1.91-1.1a.34.34 0 0 1-.16-.29V11.1A3.63 3.63 0 0 1 3.42 10.61zm6.5-5.16a3.63 3.63 0 0 1 .91 1.58L8.43 8.42a.9.9 0 0 0-.45.78v3.48l-1.91-1.1a.34.34 0 0 1-.16-.29V8.38A3.63 3.63 0 0 1 9.92 5.45zm8.63 5.16a3.63 3.63 0 0 1-1.82.49l-2.4-1.39a.9.9 0 0 0-.45-.78V6.44l1.91 1.1c.1.06.16.17.16.29v2.93A3.63 3.63 0 0 1 18.55 10.61zm-6.5 5.16a3.63 3.63 0 0 1-.91-1.58l2.4 1.39c.28.16.45.46.45.78v3.48l-1.94-1.12Z" />
        </svg>
      );

    case "anthropic":
      // Anthropic Claude A logo SVG
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2L3.5 22h3.8l1.9-4.8h9.6l1.9 4.8h3.8L12 2zm-2 12l2-5.1 2 5.1H10z" />
        </svg>
      );

    case "qwen":
      // Qwen sphere/network logo SVG
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8a7.93 7.93 0 0 1 2.37-5.63l1.42 1.42A5.96 5.96 0 0 0 6 12c0 3.31 2.69 6 6 6a5.96 5.96 0 0 0 4.21-1.79l1.42 1.42A7.93 7.93 0 0 1 12 20zm5.63-5.63l-1.42-1.42A3.98 3.98 0 0 0 16 12c0-2.21-1.79-4-4-4a3.98 3.98 0 0 0-1.21.19L9.37 6.77A5.96 5.96 0 0 1 12 6c3.31 0 6 2.69 6 6a5.96 5.96 0 0 1-.37 2.37z" />
        </svg>
      );

    default:
      // Fallback: Smart chip / CPU icon for other providers
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="16" height="16" x="4" y="4" rx="2" />
          <rect width="6" height="6" x="9" y="9" rx="1" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </svg>
      );
  }
}
