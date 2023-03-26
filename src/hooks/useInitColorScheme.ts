import { ColorScheme } from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'

const useInitColorScheme = (/*initialCS?: ColorScheme*/) => {
  /////////////////// SESSION

  // const [colorScheme, setColorScheme] = useState<ColorScheme>(
  //   initialCS || 'dark'
  // )
  // const toggleColorScheme = useCallback(
  //   (value?: ColorScheme) => {
  //     const nextColorScheme =
  //       value || (colorScheme === 'dark' ? 'light' : 'dark')
  //     setColorScheme(nextColorScheme)
  //     setCookie('mantine-color-scheme', nextColorScheme, {
  //       maxAge: 60 * 60 * 24 * 30,
  //     })
  //   },
  //   [colorScheme]
  // )

  /////////////////// LOCAL STOTAGE

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return { colorScheme, toggleColorScheme }
}

export default useInitColorScheme
