module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        accent: '#657786',
        background: '#F5F8FA',
        surface: '#FFFFFF'
      },
      spacing: {
        128: '32rem',
        144: '36rem'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif']
      }
    }
  }
};
