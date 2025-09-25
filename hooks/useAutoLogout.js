import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_TIME = 1 * 60 * 1000; // 1 minute warning before logout

export const useAutoLogout = (session) => {
  const router = useRouter();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error during auto-logout:', error);
    }
  }, [router]);

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

    // Set warning timeout (9 minutes)
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
      
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set logout timeout (10 minutes)
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  const extendSession = () => {
    setShowWarning(false);
    setTimeRemaining(0);
    resetTimer();
  };

  // Activity tracking
  useEffect(() => {
    if (!session) return;

    // Skip auto-logout for admin, coach, inactive client, and terminated coach accounts
    if (session.level === 'admin' || session.level === 'coach' || session.level === 'inactive client' || session.level === 'terminated coach') {
      return;
    }

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [resetTimer, session]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
    handleLogout
  };
};
