module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Adjust based on your file types
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      // You can add custom colors, spacing, etc. here if needed
      colors: {
        'gray-500': '#6B7280',
        'red-600': '#EF4444',
        'red-400': '#F87171',
    },
    },
  },
  plugins: [],
};
