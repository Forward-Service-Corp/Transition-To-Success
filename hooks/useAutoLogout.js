import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const WARNING_TIME = 1 * 60 * 1000; // 1 minute warning before logout

export const useAutoLogout = (session) => {
  const router = useRouter();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [inactivityTimeout, setInactivityTimeout] = useState(1 * 60 * 1000); // Default 1 minute

  const handleLogout = useCallback(async () => {
    try {
      // Clear session storage and invalidate token for client users
      if (session?.level === 'client') {
        // Clear local storage items
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }

        // Invalidate the JWT token server-side
        try {
          await fetch('/api/invalidate-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
        } catch (invalidationError) {
          console.error('Error invalidating session:', invalidationError);
          // Continue with logout even if invalidation fails
        }
      }

      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error during auto-logout:', error);
    }
  }, [router, session]);

  const resetTimer = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    setShowWarning(false);
    setTimeRemaining(0);

    // Set warning timeout (inactivity timeout - 1 minute)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(60); // 1 minute remaining

      // Start countdown
      const countdownInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    }, inactivityTimeout - WARNING_TIME);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, inactivityTimeout);
  }, [handleLogout, inactivityTimeout]);

  const extendSession = () => {
    setShowWarning(false);
    setTimeRemaining(0);
    resetTimer();
  };

  // Fetch session timeout configuration
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

  // Activity tracking and tab close logout
  useEffect(() => {
    if (!session) return;

    // Skip auto-logout for admin, coach, inactive client, and terminated coach accounts
    if (session.level === 'admin' || session.level === 'coach' || session.level === 'inactive client' || session.level === 'terminated coach') {
      return;
    }

    const events = [
      'click',
      'keydown',
      'scroll',
      'touchstart'
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Handle tab close for client accounts
    const handleBeforeUnload = () => {
      // Only logout client accounts when tab is closed
      if (session.level === 'client') {
        handleLogout();
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Add beforeunload listener for tab close logout
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [resetTimer, session, handleLogout]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
    handleLogout
  };
};
