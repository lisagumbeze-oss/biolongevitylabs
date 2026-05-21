const CONSENT_STORAGE_KEY = "biolongevity_consent";
const CONSENT_COOKIE_NAME = "biolongevity_consent";
/** 1 year — one successful verification per device */
const CONSENT_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

function readCookie(): boolean {
    if (typeof document === "undefined") return false;
    return document.cookie
        .split(";")
        .some((part) => part.trim().startsWith(`${CONSENT_COOKIE_NAME}=1`));
}

/** Whether this browser has already completed age & RUO verification. */
export function hasStoredConsent(): boolean {
    if (typeof window === "undefined") return false;
    try {
        if (localStorage.getItem(CONSENT_STORAGE_KEY) === "true") return true;
        if (sessionStorage.getItem(CONSENT_STORAGE_KEY) === "true") return true;
        return readCookie();
    } catch {
        return readCookie();
    }
}

/**
 * Persist verification so the modal is not shown again on this device.
 * Uses localStorage and a long-lived cookie for reliability across visits.
 */
export function storeConsent(): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(CONSENT_STORAGE_KEY, "true");
        sessionStorage.setItem(CONSENT_STORAGE_KEY, "true");
    } catch {
        // localStorage may be blocked; cookie still applies
    }
    document.cookie = `${CONSENT_COOKIE_NAME}=1; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax`;
}
