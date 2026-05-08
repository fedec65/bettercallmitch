"use client";

import { useEffect, useState } from "react";
import { fetchMcpStatus, type McpServerHealth } from "@/app/lib/mikeApi";
import { useTranslations } from "next-intl";

export function McpStatus() {
    const t = useTranslations();
    const [status, setStatus] = useState<{
        servers: McpServerHealth[];
        allOk: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    const check = async () => {
        try {
            const data = await fetchMcpStatus();
            setStatus(data);
        } catch {
            setStatus({ servers: [], allOk: false });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        check();
        const interval = setInterval(check, 60000);
        const onFocus = () => check();
        window.addEventListener("focus", onFocus);
        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-pulse" />
                <span>{t("common.mcpStatusChecking")}</span>
            </div>
        );
    }

    const allOk = status?.allOk ?? false;
    const someOk = status && status.servers.some((s) => s.status === "ok");
    const noneOk = status && !someOk;

    let dotColor = "bg-gray-300";
    let label = t("common.mcpStatusDisconnected");

    if (allOk) {
        dotColor = "bg-emerald-500";
        label = t("common.mcpStatusConnected");
    } else if (someOk) {
        dotColor = "bg-amber-400";
        label = t("common.mcpStatusPartial");
    }

    const tooltipLines = status?.servers.length
        ? status.servers
              .map((s) => `${s.status === "ok" ? "✓" : "✗"} ${s.name}${s.error ? ` — ${s.error}` : ""}`)
              .join("\n")
        : "";

    return (
        <div
            className="flex items-center gap-1.5 text-xs text-gray-500"
            title={tooltipLines}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            <span>{label}</span>
        </div>
    );
}
