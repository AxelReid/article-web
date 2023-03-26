import { ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { IBM_Plex_Sans } from 'next/font/google'
import type { AppProps } from 'next/app'
import useInitColorScheme from '~/hooks/useInitColorScheme'
import theme from '~/styles/theme'
import { RouterTransition } from '../components/RouterTransition'

const font = IBM_Plex_Sans({
  variable: '--imb-plex-sans',
  weight: ['400', '500', '600', '700'],
})

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const { colorScheme, toggleColorScheme } = useInitColorScheme()

  return (
    <main className={font.variable}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={theme(colorScheme)}
        >
          <Notifications />
          <RouterTransition />
          <Component {...pageProps} />
        </MantineProvider>
      </ColorSchemeProvider>
    </main>
  )
}

// App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
//   // get color scheme from cookie
//   colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
// })
