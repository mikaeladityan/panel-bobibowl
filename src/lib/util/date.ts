// utils/date.ts

/**
 * Format a date into user's locale, defaulting to Dubai timezone.
 *
 * @param dateInput  — a Date, timestamp, or ISO‐8601 string
 * @param options    — Intl.DateTimeFormat options (see MDN)
 * @param locale     — optional locale override (e.g. "en-US"); by default uses browser/OS locale
 * @returns formatted date string
 */
export function formatDate(
    dateInput: string | number | Date,
    options?: Intl.DateTimeFormatOptions,
    locale?: string
): string {
    // Parse input
    const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;

    // Guard invalid
    if (Number.isNaN(date.getTime())) {
        console.warn("[formatDate] Invalid date:", dateInput);
        return "";
    }

    // Determine locale (browser if client, fallback "en-US")
    const userLocale = locale ?? (typeof window !== "undefined" ? navigator.language : "en-US");

    // Build formatter with default Dubai timezone
    const formatter = new Intl.DateTimeFormat(userLocale, {
        timeZone: "Asia/Dubai", // default to Dubai
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        ...options,
    });

    return formatter.format(date);
}

// utils/date.ts

/**
 * Format a date into 'DD Month YYYY' (e.g. "22 June 2025"),
 * using user's locale (default "en-US") and Dubai timezone.
 *
 * @param dateInput  — a Date, timestamp, or ISO‐8601 string
 * @param locale     — optional locale override (default "en-US")
 * @returns formatted date string
 */
export function formatJustDate(dateInput: string | number | Date, locale: string = "en-US"): string {
    const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;

    if (Number.isNaN(date.getTime())) {
        console.warn("[formatDate] Invalid date:", dateInput);
        return "";
    }

    const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Dubai",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return formatter.format(date);
}
