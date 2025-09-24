/**
 * Utility functions for handling phone number formats
 */

/**
 * Extract just the 10-digit phone number from any format
 * @param {string} phone - Phone number in any format
 * @returns {string} - 10-digit phone number (e.g., "5556667777")
 */
export function extractPhoneDigits(phone) {
    if (!phone) return '';

    // Remove all non-digits
    let digits = phone.replace(/\D/g, '');

    // If it's 11 digits starting with 1, remove the 1 (US country code)
    if (digits.length === 11 && digits.startsWith('1')) {
        digits = digits.slice(1);
    }

    return digits;
}

/**
 * Format phone for Twilio (they expect +15556667777)
 * @param {string} phone - Phone number in any format
 * @returns {string} - Twilio format (+15556667777)
 */
export function formatPhoneForTwilio(phone) {
    if (!phone) return '';

    // If already in correct Twilio format, return as-is
    if (phone.match(/^\+1\d{10}$/)) {
        return phone;
    }

    const digits = extractPhoneDigits(phone);

    if (digits.length === 10) {
        return `+1${digits}`;
    }

    // If we can't format properly, return original (will likely cause API error, which is better than silent failure)
    console.warn(`Warning: Could not format phone number for Twilio: ${phone}`);
    return phone;
}

/**
 * Generate all possible search patterns for a phone number
 * @param {string} phone - Phone number in any format
 * @returns {Array} - Array of possible phone formats to search for
 */
export function generatePhoneSearchPatterns(phone) {
    const digits = extractPhoneDigits(phone);

    if (digits.length !== 10) {
        return [phone]; // Return original if not a valid US phone number
    }

    // Generate all common formats users might have stored
    return [
        digits,                                              // 5556667777
        `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`, // 555-666-7777
        `+1${digits}`,                                       // +15556667777
        `+1-${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`, // +1-555-666-7777
        `1${digits}`,                                        // 15556667777
        `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`, // (555) 666-7777
        `+1 (${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`, // +1 (555) 666-7777
    ];
}

/**
 * Normalize phone to our standard API format (+1-555-666-7777)
 * @param {string} phone - Phone number in any format
 * @returns {string} - Standardized format
 */
export function normalizePhoneForAPI(phone) {
    const digits = extractPhoneDigits(phone);

    if (digits.length === 10) {
        return `+1-${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    }

    return phone; // Return original if not valid
}