"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export interface CantonOption {
    code: string;
    name: string;
    region: string;
}

const CANTONS: CantonOption[] = [
    { code: "ZH", name: "Zurich", region: "German" },
    { code: "BE", name: "Bern", region: "Bilingual (DE/FR)" },
    { code: "GE", name: "Geneva", region: "French" },
    { code: "VD", name: "Vaud", region: "French" },
    { code: "TI", name: "Ticino", region: "Italian" },
    { code: "BS", name: "Basel-Stadt", region: "German" },
    { code: "AG", name: "Aargau", region: "German" },
    { code: "LU", name: "Luzern", region: "German" },
    { code: "SG", name: "St. Gallen", region: "German" },
    { code: "ZG", name: "Zug", region: "German" },
    { code: "SZ", name: "Schwyz", region: "German" },
    { code: "BL", name: "Basel-Landschaft", region: "German" },
    { code: "SO", name: "Solothurn", region: "German" },
    { code: "TG", name: "Thurgau", region: "German" },
    { code: "SH", name: "Schaffhausen", region: "German" },
    { code: "NW", name: "Nidwalden", region: "German" },
    { code: "OW", name: "Obwalden", region: "German" },
    { code: "UR", name: "Uri", region: "German" },
    { code: "GL", name: "Glarus", region: "German" },
    { code: "AR", name: "Appenzell Ausserrhoden", region: "German" },
    { code: "AI", name: "Appenzell Innerrhoden", region: "German" },
    { code: "FR", name: "Fribourg", region: "Bilingual (DE/FR)" },
    { code: "NE", name: "Neuchâtel", region: "French" },
    { code: "JU", name: "Jura", region: "French" },
    { code: "GR", name: "Graubünden", region: "Bilingual (DE/IT/RM)" },
    { code: "VS", name: "Valais", region: "Bilingual (DE/FR)" },
];

const GROUP_ORDER = ["German", "French", "Italian", "Bilingual (DE/FR)", "Bilingual (DE/IT/RM)"];

interface Props {
    value: string | null;
    onChange: (canton: string | null) => void;
    disabled?: boolean;
}

export function CantonSelector({ value, onChange, disabled }: Props) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = CANTONS.find((c) => c.code === value);

    const filtered = search.trim()
        ? CANTONS.filter(
              (c) =>
                  c.code.toLowerCase().includes(search.toLowerCase()) ||
                  c.name.toLowerCase().includes(search.toLowerCase()),
          )
        : CANTONS;

    const grouped = filtered.reduce<Record<string, CantonOption[]>>((acc, c) => {
        const group = acc[c.region] || [];
        group.push(c);
        acc[c.region] = group;
        return acc;
    }, {});

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
                className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors ${
                    disabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
                <MapPin className="h-3.5 w-3.5 text-red-600" />
                <span className="max-w-[120px] truncate">
                    {selected ? `${selected.code} — ${selected.name}` : t("common.federalDefault")}
                </span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {open && (
                <div className="absolute bottom-full left-0 z-50 mb-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-2">
                        <input
                            type="text"
                            placeholder={t("common.searchCanton")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm outline-none focus:border-red-400"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-64 overflow-auto py-1">
                        <button
                            type="button"
                            onClick={() => {
                                onChange(null);
                                setOpen(false);
                                setSearch("");
                            }}
                            className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                                value === null ? "bg-red-50 text-red-700" : "text-gray-700"
                            }`}
                        >
                            <span className="flex h-4 w-4 items-center justify-center">
                                {value === null && <Check className="h-3.5 w-3.5" />}
                            </span>
                            <span>{t("common.federalDefault")}</span>
                        </button>

                        {GROUP_ORDER.map((region) => {
                            const items = grouped[region];
                            if (!items || items.length === 0) return null;
                            return (
                                <div key={region}>
                                    <div className="px-3 py-1 text-xs font-medium text-gray-400">
                                        {region}
                                    </div>
                                    {items.map((c) => (
                                        <button
                                            type="button"
                                            key={c.code}
                                            onClick={() => {
                                                onChange(c.code);
                                                setOpen(false);
                                                setSearch("");
                                            }}
                                            className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                                                value === c.code
                                                    ? "bg-red-50 text-red-700"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            <span className="flex h-4 w-4 items-center justify-center">
                                                {value === c.code && (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}
                                            </span>
                                            <span>
                                                {c.code} — {c.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
