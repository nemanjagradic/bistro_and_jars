"use client";

import type { Locale } from "../lib/chrome-copy";
import { useLanguage } from "./language-provider";

// Each language is named in itself, so the label reads correctly in either locale.
const LOCALE_OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: "sr", label: "SR", name: "Srpski" },
  { value: "en", label: "EN", name: "English" },
];

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale, copy } = useLanguage();

  return (
    <div
      className={`lang-switch${className ? ` ${className}` : ""}`}
      role="group"
      aria-label={copy.languageLabel}
    >
      {LOCALE_OPTIONS.map((option) =>
        locale === option.value ? (
          <span
            key={option.value}
            className="lang-switch-current"
            aria-current="true"
            aria-label={option.name}
            title={option.name}
            lang={option.value}
          >
            {option.label}
          </span>
        ) : (
          <button
            key={option.value}
            type="button"
            className="lang-switch-btn"
            aria-label={option.name}
            title={option.name}
            lang={option.value}
            onClick={() => setLocale(option.value)}
          >
            {option.label}
          </button>
        ),
      )}
    </div>
  );
}
