"use client";

import { useCallback } from "react";
import { Globe } from "lucide-react";

const LOCALES = [
    { code: "de", label: "DE", name: "Deutsch" },
    { code: "fr", label: "FR", name: "Français" },
    { code: "it", label: "IT", name: "Italiano" },
    { code: "en", label: "EN", name: "English" },
];

export function LanguageSwitcher() {
    const setLocale = useCallback((locale: string) => {
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
        window.location.reload();
    }, []);

    return (
        <div className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5 text-gray-400" />
            {LOCALES.map((loc) => (
                <button
                    key={loc.code}
                    type="button"
                    onClick={() => setLocale(loc.code)}
                    className="rounded px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    title={loc.name}
                >
                    {loc.label}
                </button>
            ))}
        </div>
    );
}
