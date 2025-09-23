import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const WARNING_TIME = 1 * 60 * 1000; // 1 minute warning before logout

export const useAutoLogout = (session) => {
  const router = useRouter();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [inactivityTimeout, setInactivityTimeout] = useState(1 * 60 * 1000); // Default 1 minute

  const handleLogout = useCallback(async () => {
    try {
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
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    // Clear existing timeouts and intervals
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setShowWarning(false);
    setTimeRemaining(0);

    // Set warning timeout (inactivity timeout - 1 minute)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(60); // 1 minute remaining

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
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

  const extendSession = useCallback(() => {
    // Clear the countdown interval when extending session
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setShowWarning(false);
    setTimeRemaining(0);
    resetTimer();
  }, [resetTimer]);

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

  // Timer-based logout and tab close logout
  useEffect(() => {
    if (!session) return;

    // Apply auto-logout to all authenticated users
    // Different timeout durations can be configured per user level via API

    // Handle tab close - apply stricter logout for client accounts
    const handleBeforeUnload = () => {
      if (session.level === 'client') {
        handleLogout();
      }
    };

    // Add beforeunload listener for tab close logout (clients only)
    if (session.level === 'client') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    // Initial timer setup - applies to all users
    resetTimer();

    // Cleanup
    return () => {
      if (session.level === 'client') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
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
