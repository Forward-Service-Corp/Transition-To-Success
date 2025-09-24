import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

// Duration to show warning modal before automatic logout
const WARNING_TIME = 10 * 1000; // 10 seconds warning before logout

/**
 * Custom hook for managing automatic logout functionality
 * Handles inactivity detection, warning modals, and session extension
 * @param {Object} session - NextAuth session object
 * @returns {Object} Auto-logout state and control functions
 */
export const useAutoLogout = (session) => {
  const router = useRouter();
  
  // Refs to store timeout IDs for cleanup
  const timeoutRef = useRef(null); // Main logout timeout
  const warningTimeoutRef = useRef(null); // Warning modal timeout
  
  // State for warning modal visibility and countdown
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Configurable inactivity timeout (fetched from API)
  const [inactivityTimeout, setInactivityTimeout] = useState(1 * 60 * 1000); // Default 1 minute

  /**
   * Handles the logout process with security cleanup
   * Clears sensitive data from storage and redirects to login
   */
  const handleLogout = useCallback(async () => {
    try {
      console.log('Auto-logout triggered at:', new Date().toISOString(), 'from page:', window.location.pathname);

      // Clear local storage for security
      if (typeof window !== 'undefined') {
        // Only clear TTS-specific storage keys to avoid affecting other applications
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('tts-') || key.startsWith('nextauth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Clear session storage
        sessionStorage.clear();
      }

      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error during auto-logout:', error);
      // Even if signOut fails, try to redirect to login
      router.push('/login');
    }
  }, [router]);

  /**
   * Resets the inactivity timer and sets up new timeouts
   * Clears existing timeouts, hides warning modal, and starts fresh timers
   */
  const resetTimer = useCallback(() => {
    console.log('Timer reset at:', new Date().toISOString(), 'timeout:', inactivityTimeout + 'ms');

    // Clear existing timeouts to prevent multiple timers running
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Reset warning modal state
    setShowWarning(false);
    setTimeRemaining(0);

    const warningDelay = inactivityTimeout - WARNING_TIME;

    // Set warning timeout (shows modal before logout)
    warningTimeoutRef.current = setTimeout(() => {
      console.log('Auto-logout warning shown at:', new Date().toISOString());
      setShowWarning(true);
      setTimeRemaining(WARNING_TIME / 1000); // Start countdown based on WARNING_TIME

      // Start countdown timer that decrements every second
      const countdownInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    }, warningDelay);

    // Set main logout timeout (triggers actual logout)
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, inactivityTimeout);
  }, [handleLogout, inactivityTimeout]);

  /**
   * Extends the current session by hiding warning modal and resetting timer
   * Called when user clicks "Stay Logged In" button
   */
  const extendSession = useCallback(() => {
    setShowWarning(false);
    setTimeRemaining(0);
    resetTimer();
  }, [resetTimer]);

  /**
   * Fetch session timeout configuration from API
   * Allows dynamic timeout configuration without code changes
   */
  useEffect(() => {
    const fetchTimeout = async () => {
      try {
        const response = await fetch('/api/config/session-timeout');
        if (response.ok) {
          const data = await response.json();
          setInactivityTimeout(data.timeoutMilliseconds);
        }
      } catch (error) {
        console.error('Failed to fetch session timeout config:', error);
      }
    };

    fetchTimeout();
  }, []);

  /**
   * Main effect for setting up inactivity detection and cleanup
   * Handles both timer-based logout and activity detection
   */
  useEffect(() => {
    if (!session) return;

    // Apply auto-logout to all authenticated users
    // Different timeout durations can be configured per user level via API

    // Activity events that should reset the inactivity timer
    const activityEvents = [
      'mousedown',
      'keypress',
      'touchstart',
      'click'
    ];

    // Throttled activity handler to prevent excessive timer resets
    let lastActivityTime = 0;
    const ACTIVITY_THROTTLE = 5000; // Only reset timer once every 5 seconds

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > ACTIVITY_THROTTLE) {
        lastActivityTime = now;
        resetTimer();
      }
    };

    // Add activity event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer setup - applies to all users
    resetTimer();

    // Cleanup function - clears timeouts and removes event listeners
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }

      // Remove activity event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetTimer, session, handleLogout]);

  // Return hook interface for components to use
  return {
    showWarning,      // Boolean: whether warning modal should be shown
    timeRemaining,    // Number: seconds remaining before logout
    extendSession,    // Function: extends session when user clicks "Stay Logged In"
    handleLogout      // Function: manually triggers logout process
  };
};
