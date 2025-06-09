import '../styles/globals.css'
import {SessionProvider} from "next-auth/react";
import Script from "next/script";

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
      <SessionProvider session={session}>
          <Script id={'dark-mode-script'}>
              {`if (localStorage.theme === "dark" || (!('theme' in localStorage) )) {
                  document.documentElement.classList.remove('dark')
              }`}
          </Script>
        <Component {...pageProps} />
      </SessionProvider>

  )
}

export default MyApp
