/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // --- MUDANÇA PRINCIPAL AQUI ---
    // Nós estamos dizendo ao Tailwind como a classe 'container' deve se comportar.
    container: {
      center: true, // Isso garante que o container seja sempre centralizado.
      padding: {
        DEFAULT: '1rem', // Equivalente a 'px-4' em telas pequenas.
        sm: '2rem',      // Equivalente a 'px-8' em telas sm.
        lg: '4rem',      // Equivalente a 'px-16' em telas lg.
        xl: '5rem',      // etc...
      },
    },
    extend: {
      colors: {
        cream: '#F5F5F1',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}