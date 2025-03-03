export const basePreset = {
    theme: {
        extend: {
            zIndex: {
                index2000: "2000",
            },
            fontSize: {
                notFound: "300px",
            },
            gridTemplateColumns: {
                "2-auto": "repeat(2,auto)",
                "3-auto": "repeat(3,auto)",
                "4-auto": "repeat(4,auto)",
                "2-1fr": "repeat(2,1fr)",
            },
            colors: {
                blue: "#2C74B3",
                purple: "#4F46E5",
                black: "#0A2540",
                dark: "#111827",
                dark_gray: "#1C1C1E",
                dark_teal: "#004953",
                black_secondary: "#1C2634",
                gray: "#61677A",
                gray_light: "#F5F7F8",
                green: "#42d392",
                dark_shadow: "#222222",
                light_bg: "rgb(240 249 255 / .4)",
                'gradient-1': '#00BFFF',
                'gradient-2': '#1E90FF',
                'gradient-3': '#4169E1',
                'gradient-4': '#0000FF',
                'gradient-5': '#00008B',
                discord: {
                    piurple: '#7D7AFF',
                    blurple: '#7289da',
                    purple: '#5865f2',
                },
                grey: {
                    50: '#f9fafb',
                    100: '#eaeaeb',
                    200: '#cacbcd',
                    300: '#a7a9ac',
                    400: '#696c71',
                    500: '#282d34',
                    600: '#24292f',
                    700: '#181b20',
                    800: '#121518',
                    900: '#0c0e10',
                },
                primary: {
                    50: '#e0f2ff',
                    100: '#b3d9ff',
                    200: '#80bfff',
                    300: '#4da6ff',
                    400: '#1a8cff',
                    500: '#0066cc',
                    600: '#005bb5',
                    700: '#004c99',
                    800: '#003d7a',
                    900: '#00264d',
                },
                secondary: {
                    50: '#f2f2f2',
                    100: '#d9d9d9',
                    200: '#bfbfbf',
                    300: '#a6a6a6',
                    400: '#8c8c8c',
                    500: '#737373',
                    600: '#595959',
                    700: '#404040',
                    800: '#262626',
                    900: '#0d0d0d',
                },
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to bottom, #111827 45%, #1c2634 72.5%, #1c2634 100%)',
                'status-card-text': 'linear-gradient(315deg, #2c74b3 25%, #42d392);'
            },
            keyframes: {
                pop: {
                    '0%': { transform: 'scale(0) rotate(-45deg)' },
                    '50%': { transform: 'scale(1.2) rotate(0deg)' },
                    '100%': { transform: 'scale(1) rotate(0deg)' }
                },
                confetti: {
                    '0%': {
                        transform: 'translateY(0) rotate(0deg)',
                        opacity: '1'
                    },
                    '100%': {
                        transform: 'translateY(-100px) rotate(360deg)',
                        opacity: '0'
                    }
                }
            },
            animation: {
                'pop': 'pop 0.5s ease-out forwards',
                'confetti': 'confetti 1s ease-out forwards'
            }
        },
    },
};
