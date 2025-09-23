import "../styles/globals.css"
import {SessionProvider} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      // Don't show loading when going to login, auth, or login-sms pages
      if (!url.includes('/login') && !url.includes('/auth/') && !url.includes('/login-sms')) {
        setLoading(true);
      }
    };

    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
      <SessionProvider session={session}>
        {loading && (
          <div className="fixed w-full h-full bg-gray-600 bg-opacity-50 flex align-middle justify-center z-50">
            <div className="uppercase text-white self-center rounded-full p-5 bg-orange-600 shadow">
              loading...
            </div>
          </div>
        )}
        <Component {...pageProps} />
      </SessionProvider>

  )
}

export default MyApp
