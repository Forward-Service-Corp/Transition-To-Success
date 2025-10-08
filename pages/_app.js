import "../styles/globals.css"
import {SessionProvider} from "next-auth/react";

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
      <SessionProvider session={session} refetchInterval={30}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }


export default MyApp
