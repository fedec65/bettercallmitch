import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./src/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Fallback: read NEXT_LOCALE cookie directly (needed for localePrefix: "never")
    if (!locale || !routing.locales.includes(locale as any)) {
        const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
        if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
            locale = cookieLocale;
        }
    }

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
