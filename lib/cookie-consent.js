export const CONSENT_STORAGE_KEY = "nrf-cookie-consent";
export const CONSENT_EVENT = "nrf-cookie-consent-change";

/** @typedef {"accepted" | "declined"} ConsentValue */

/**
 * @returns {ConsentValue | null}
 */
export function getCookieConsent() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    // Private mode / blocked storage — treat as undecided.
  }
  return null;
}

/**
 * @param {ConsentValue} value
 */
export function setCookieConsent(value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Ignore write failures; UI can still dismiss for this session.
  }
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: { consent: value } })
  );
}

/** @returns {boolean} */
export function hasAcceptedCookies() {
  return getCookieConsent() === "accepted";
}
