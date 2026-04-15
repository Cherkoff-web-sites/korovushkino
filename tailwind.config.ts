import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }: { addComponents: (c: Record<string, Record<string, string>>) => void }) {
      addComponents({
        '.container': {
          width: '100%',
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
      })
    },
  ],
}
export default config

