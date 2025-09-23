import "../styles/globals.css"
import {SessionProvider} from "next-auth/react";
import {useRouter} from "next/router";
import SpaAuthGuard from "../components/SpaAuthGuard";
import AppContainer from "../components/AppContainer";

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  const router = useRouter();

  // For authentication routes, use the original component instead of SPA
  const isAuthRoute = router.pathname && (
    router.pathname.startsWith('/auth/') ||
    router.pathname.startsWith('/api/auth/') ||
    router.pathname === '/login' ||
    router.pathname === '/login-sms'
  );

  if (isAuthRoute) {
    return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }

  // For all other routes, use SPA architecture
  return (
      <SessionProvider session={session}>
        <SpaAuthGuard>
          <AppContainer />
        </SpaAuthGuard>
      </SessionProvider>
  )
}

export default MyApp
