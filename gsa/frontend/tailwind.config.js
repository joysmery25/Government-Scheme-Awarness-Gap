/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#F8FAFC',
                primary: '#2563EB',
                secondary: '#60A5FA',
                accent: '#10B981',
                textMain: '#1E293B',
                borders: '#E2E8F0'
            }
        },
    },
    plugins: [],
}
