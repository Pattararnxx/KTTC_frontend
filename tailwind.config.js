module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'biryani': ['Biryani', 'sans-serif'],
        'chakra': ['Chakra Petch', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'kanit': ['Kanit', 'sans-serif'], // ← ตรวจสอบบรรทัดนี้
        'lora': ['Lora', 'serif'],
        'noto-mandaic': ['Noto Sans Mandaic', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'sarabun': ['Sarabun', 'sans-serif'],
        'special-gothic': ['Special Gothic', 'sans-serif'],
        'sriracha': ['Sriracha', 'cursive'],
        'tuffy': ['Tuffy', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
