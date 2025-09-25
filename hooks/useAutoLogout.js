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

  // Utility function to clear client session storage
  const clearClientSessionStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      
      // Clear NextAuth-related localStorage items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('nextauth.') || key.includes('next-auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // Clear session storage and invalidate token for client users
      if (session?.level === 'client') {
        clearClientSessionStorage();
        
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
  }, [router, session, clearClientSessionStorage]);

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

  // Activity tracking and tab close logout
  useEffect(() => {
    if (!session) return;

    // Only apply auto-logout to users with 'client' level
    if (session.level !== 'client') {
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

    // Handle tab closure for client users - force logout
    const handleBeforeUnload = () => {
      // Clear session storage to force fresh authentication
      clearClientSessionStorage();
      
      // Invalidate the JWT token server-side using sendBeacon for reliability
      if (navigator.sendBeacon) {
        const data = new Blob([JSON.stringify({})], {type: 'application/json'});
        navigator.sendBeacon('/api/invalidate-session', data);
      } else {
        // Fallback for browsers that don't support sendBeacon
        fetch('/api/invalidate-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
          keepalive: true
        }).catch(() => {
          // Ignore errors since the page is unloading
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is being hidden/closed - force logout for clients
        handleBeforeUnload();
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Add tab closure handlers for client users
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      // Remove tab closure handlers
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
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
