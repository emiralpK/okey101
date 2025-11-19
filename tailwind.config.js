/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'okey-red': '#E63946',
                'okey-blue': '#457B9D',
                'okey-yellow': '#F4A261',
                'okey-black': '#1D3557',
            }
        },
    },
    plugins: [],
}
