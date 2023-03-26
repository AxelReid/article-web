import {
  ColorScheme,
  CSSObject,
  MantineTheme,
  MantineThemeOverride,
} from '@mantine/core'

const theme = (colorScheme: ColorScheme): MantineThemeOverride => ({
  fontFamily: 'var(--imb-plex-sans) !important',
  colorScheme,
  globalStyles,
})
export default theme

const globalStyles = (theme: MantineTheme): CSSObject => ({
  body: {
    background:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
})
