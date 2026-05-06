"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function MikeIcon({
    spin = false,
    done = false,
    error = false,
    mike = false,
    size = 24,
    style,
}: {
    spin?: boolean;
    done?: boolean;
    error?: boolean;
    mike?: boolean;
    size?: number;
    style?: React.CSSProperties;
}) {
    const t = useTranslations();
    void mike;

    let filter = "";
    if (done) {
        filter = "brightness(0.9) sepia(1) hue-rotate(80deg) saturate(2)";
    } else if (error) {
        filter = "brightness(0.9) sepia(1) hue-rotate(320deg) saturate(2)";
    }

    return (
        <span
            className="shrink-0 inline-block"
            style={{
                width: size,
                height: size,
                animation: spin ? "spin 3s linear infinite" : undefined,
                ...style,
            }}
        >
            <img
                src="/images/snowflake-icon.png"
                alt={t("assistant.welcome")}
                width={size}
                height={size}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: filter || undefined,
                }}
            />
        </span>
    );
}
