import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SpaAuthGuard = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuth = () => {
      // Define public routes that don't require authentication
      const publicRoutes = [
        '/login',
        '/login-sms',
        '/auth/sign-in',
        '/auth/verify-request',
        '/auth/no-account',
        '/auth/error',
        '/auth/signin',
        '/api/auth'
      ];
      const isPublicRoute = publicRoutes.some(route => router.pathname.startsWith(route));

      if (status === 'loading') {
        // Still checking authentication status
        setIsLoading(true);
        return;
      }

      if (!session && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        router.push('/login');
        return;
      }

      if (session && isPublicRoute) {
        // User is authenticated but on a public route (like login)
        router.push('/');
        return;
      }

      // All good, show the page
      setIsLoading(false);
    };

    handleAuth();
  }, [session, status, router]);

  // Show loading screen while checking authentication or redirecting
  if (isLoading || status === 'loading') {
    return (
      <div className="fixed w-full h-full bg-gray-900 flex align-middle justify-center z-50">
        <div className="uppercase text-white self-center rounded-full p-5 bg-orange-600 shadow">
          loading...
        </div>
      </div>
    );
  }

  return children;
};

export default SpaAuthGuard;