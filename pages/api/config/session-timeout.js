// API endpoint to configure session timeout for auto-logout
// This controls how long clients can be inactive before being logged out
// Reads from SESSION_AUTO_LOGOUT_LENGTH_IN_MINUTES environment variable

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
        // Read from environment variable, default to 30 minutes if not set
        const timeoutMinutes = parseInt(process.env.SESSION_AUTO_LOGOUT_LENGTH_IN_MINUTES) || 30;
        const timeoutMilliseconds = timeoutMinutes * 60 * 1000;
        
        // This only affects users with level "client" (not coaches/admins)
        res.json({
            timeoutMilliseconds,
            timeoutMinutes,
            warningSeconds: 10 // How long before timeout to show warning
        });
    } catch (error) {
        console.error("session-timeout: Error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

