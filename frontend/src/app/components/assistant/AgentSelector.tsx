"use client";

import { useState, useRef, useEffect } from "react";
import { Users, ChevronDown, Check } from "lucide-react";
import type { AgentInfo } from "@/app/lib/mikeApi";
import { listAgents } from "@/app/lib/mikeApi";
import { useTranslations } from "next-intl";

interface Props {
    value: string | null;
    onChange: (agentId: string | null) => void;
    disabled?: boolean;
}

export function AgentSelector({ value, onChange, disabled }: Props) {
    const t = useTranslations("agents");
    const [open, setOpen] = useState(false);
    const [agents, setAgents] = useState<AgentInfo[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listAgents().then(setAgents).catch(() => {});
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = agents.find((a) => a.id === value);

    if (disabled) {
        return (
            <div className="inline-flex items-center gap-1.5 px-2 h-8 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                <Users className="h-3 w-3" />
                {selected ? t(selected.id) : t("general")}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-1 px-2 h-8 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <Users className="h-3 w-3" />
                <span className="max-w-[100px] truncate">
                    {selected ? t(selected.id) : t("general")}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute bottom-full left-0 mb-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {agents.map((agent) => (
                        <button
                            key={agent.id}
                            type="button"
                            onClick={() => {
                                onChange(agent.id === "general" ? null : agent.id);
                                setOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                                value === agent.id || (!value && agent.id === "general") ? "bg-gray-50" : ""
                            }`}
                        >
                            <Check
                                className={`h-3.5 w-3.5 ${
                                    value === agent.id || (!value && agent.id === "general")
                                        ? "text-gray-900"
                                        : "text-transparent"
                                }`}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{t(agent.id)}</div>
                                <div className="text-xs text-gray-500 truncate">{agent.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
