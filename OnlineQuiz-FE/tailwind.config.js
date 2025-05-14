/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: 'rgb(0, 167, 111)',
        secondary: 'rgb(84, 184, 98)',
        text: '#3b3e66',
        info: 'rgb(0, 123, 255)',
        strike: '#d1d2de',
        icon: 'rgb(99, 115, 129)',
        error: '#EB5757',
        danger: '#f83245',
      },
      boxShadow: {
        invalid: '0 0 0 0.15rem rgba(235, 87, 87, 0.2)',
        valid: '0 0 0 0.15rem rgba(84, 184, 98,.2)',
        sidebar: '0 0 15px 0 rgba(34,41,47,.05)',
        success: '0 0.25rem 0.55rem rgba(0, 167, 111,.35)',
        dangers: '0 0.25rem 0.55rem rgba(248,50,69,.35)',
        success_hover: '0 0 8px 2px rgba(0, 167, 111,.7)',
        info_hover: '0 0 8px 2px rgba(0, 123, 255,.7)',
        danger_hover: '0 0 8px 2px rgba(248,50,69,.7)',
        card: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwindcss-animated'),
  ],
};
