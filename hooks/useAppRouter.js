import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const useAppRouter = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Define route to component mapping
  const routeMap = {
    '/': 'Dashboard',
    '/dreams': 'Dreams',
    '/life-area-surveys': 'LifeAreaSurveys',
    '/care-plans': 'CarePlans',
    '/journey': 'Journey',
    '/directory': 'Directory',
    '/profile': 'Profile',
    '/clients': 'Clients',
    '/users': 'Users',
    '/settings': 'Settings',
    '/reports': 'Reports',
    '/map-of-my-dreams': 'MapOfMyDreams',
    '/disclaimer': 'Disclaimer',
    '/add-new-referral': 'AddNewReferral',
    '/new-life-area-survey': 'NewLifeAreaSurvey',
    '/login': 'Login',
    '/login-sms': 'LoginSms'
  };

  // Handle dynamic routes
  const getDynamicRoute = (pathname) => {
    if (pathname.startsWith('/user/')) return 'UserDetail';
    if (pathname.startsWith('/client/')) return 'ClientDetail';
    if (pathname.startsWith('/surveys/')) return 'SurveyDetail';
    if (pathname.startsWith('/care-plan/')) return 'CarePlanDetail';
    if (pathname.startsWith('/referral/')) return 'ReferralDetail';
    if (pathname.startsWith('/client/survey/')) return 'ClientSurvey';
    return null;
  };

  // Create reverse mapping from view names to paths
  const viewToPath = Object.entries(routeMap).reduce((acc, [path, view]) => {
    acc[view] = path;
    return acc;
  }, {});

  const navigateToView = (pathOrView, options = {}) => {
    setViewLoading(true);

    // Convert view name to path if needed
    const path = pathOrView.startsWith('/') ? pathOrView : viewToPath[pathOrView] || pathOrView;

    // Update URL without page refresh
    if (options.replace) {
      router.replace(path, undefined, { shallow: true });
    } else {
      router.push(path, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = router.pathname;

      // Skip SPA routing for authentication routes - let NextAuth handle them
      if (pathname.startsWith('/auth/') || pathname.startsWith('/api/auth/')) {
        return;
      }

      setViewLoading(true);

      let viewName = routeMap[pathname];

      if (!viewName) {
        viewName = getDynamicRoute(pathname);
      }

      if (!viewName) {
        viewName = 'NotFound';
      }

      setCurrentView(viewName);
      setViewLoading(false);
    };

    // Handle initial load
    handleRouteChange();

    // Listen for route changes
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', () => setViewLoading(false));

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', () => setViewLoading(false));
    };
  }, [router]);

  return {
    currentView,
    viewLoading,
    navigateToView,
    router
  };
};

export default useAppRouter;