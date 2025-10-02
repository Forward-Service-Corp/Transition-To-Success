/**
 * Server-side helper utilities for getServerSideProps
 * Provides consistent error handling and validation across pages
 */

/**
 * Validates session and ensures required user data exists
 * @param {Object} session - NextAuth session object
 * @returns {Object|null} - Returns redirect object if invalid, null if valid
 */
export function validateSession(session) {
    if (!session) {
        return { redirect: { destination: "/login", permanent: false } };
    }
    
    if (!session.user?._id) {
        console.error("Session missing user._id:", JSON.stringify(session, null, 2));
        return { redirect: { destination: "/login", permanent: false } };
    }
    
    return null; // Valid session
}

/**
 * Safely fetches data with error handling
 * @param {string} url - URL to fetch
 * @param {string} context - Context for error logging
 * @returns {Promise<Object|null>} - Returns parsed JSON or null on error
 */
export async function safeFetch(url, context = "API") {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`${context} fetch failed:`, {
                url,
                status: response.status,
                statusText: response.statusText
            });
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.error(`${context} fetch error:`, {
            url,
            error: error.message
        });
        return null;
    }
}

/**
 * Gets the base URL for API calls
 * @param {Object} req - Next.js request object
 * @returns {string} - Base URL
 */
export function getBaseUrl(req) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    return req ? `${protocol}://${req.headers.host}` : '';
}

