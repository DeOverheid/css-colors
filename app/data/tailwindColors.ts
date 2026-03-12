/**
 * Tailwind CSS v3 default color palette — HSL values only.
 * Source: https://tailwindcss.com/docs/customizing-colors
 */

export interface TailwindShade {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface TailwindColor {
    name: string;
    shades: Record<string, TailwindShade>;
}

export const colorOrder = [
    "slate", "gray", "zinc", "neutral", "stone",
    "red", "orange", "amber", "yellow", "lime",
    "green", "emerald", "teal", "cyan", "sky",
    "blue", "indigo", "violet", "purple", "fuchsia",
    "pink", "rose"
];

export const shadeOrder = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"];

export const tailwindColors: Record<string, TailwindColor> = {
    slate: {
        name: "slate",
        shades: {
            50: { hue: 210, saturation: 40, lightness: 98.04 },
            100: { hue: 210, saturation: 40, lightness: 96.08 },
            200: { hue: 214.29, saturation: 31.82, lightness: 91.37 },
            300: { hue: 212.73, saturation: 26.83, lightness: 83.92 },
            400: { hue: 215, saturation: 20.22, lightness: 65.1 },
            500: { hue: 215.38, saturation: 16.32, lightness: 46.86 },
            600: { hue: 215.29, saturation: 19.32, lightness: 34.51 },
            700: { hue: 215.29, saturation: 25, lightness: 26.67 },
            800: { hue: 217.24, saturation: 32.58, lightness: 17.45 },
            900: { hue: 222.22, saturation: 47.37, lightness: 11.18 }
        }
    },
    gray: {
        name: "gray",
        shades: {
            50: { hue: 210, saturation: 20, lightness: 98.04 },
            100: { hue: 220, saturation: 14.29, lightness: 95.88 },
            200: { hue: 220, saturation: 13.04, lightness: 90.98 },
            300: { hue: 216, saturation: 12.2, lightness: 83.92 },
            400: { hue: 217.89, saturation: 10.61, lightness: 64.9 },
            500: { hue: 220, saturation: 8.94, lightness: 46.08 },
            600: { hue: 215, saturation: 13.79, lightness: 34.12 },
            700: { hue: 216.92, saturation: 19.12, lightness: 26.67 },
            800: { hue: 215, saturation: 27.91, lightness: 16.86 },
            900: { hue: 220.91, saturation: 39.29, lightness: 10.98 }
        }
    },
    zinc: {
        name: "zinc",
        shades: {
            50: { hue: 0, saturation: 0, lightness: 98.04 },
            100: { hue: 240, saturation: 4.76, lightness: 95.88 },
            200: { hue: 240, saturation: 5.88, lightness: 90 },
            300: { hue: 240, saturation: 4.88, lightness: 83.92 },
            400: { hue: 240, saturation: 5.03, lightness: 64.9 },
            500: { hue: 240, saturation: 3.83, lightness: 46.08 },
            600: { hue: 240, saturation: 5.2, lightness: 33.92 },
            700: { hue: 240, saturation: 5.26, lightness: 26.08 },
            800: { hue: 240, saturation: 3.7, lightness: 15.88 },
            900: { hue: 240, saturation: 5.88, lightness: 10 }
        }
    },
    neutral: {
        name: "neutral",
        shades: {
            50: { hue: 0, saturation: 0, lightness: 98.04 },
            100: { hue: 0, saturation: 0, lightness: 96.08 },
            200: { hue: 0, saturation: 0, lightness: 89.8 },
            300: { hue: 0, saturation: 0, lightness: 83.14 },
            400: { hue: 0, saturation: 0, lightness: 63.92 },
            500: { hue: 0, saturation: 0, lightness: 45.1 },
            600: { hue: 0, saturation: 0, lightness: 32.16 },
            700: { hue: 0, saturation: 0, lightness: 25.1 },
            800: { hue: 0, saturation: 0, lightness: 14.9 },
            900: { hue: 0, saturation: 0, lightness: 9.02 }
        }
    },
    stone: {
        name: "stone",
        shades: {
            50: { hue: 60, saturation: 9.09, lightness: 97.84 },
            100: { hue: 60, saturation: 4.76, lightness: 95.88 },
            200: { hue: 20, saturation: 5.88, lightness: 90 },
            300: { hue: 24, saturation: 5.75, lightness: 82.94 },
            400: { hue: 24, saturation: 5.43, lightness: 63.92 },
            500: { hue: 25, saturation: 5.26, lightness: 44.71 },
            600: { hue: 33.33, saturation: 5.45, lightness: 32.35 },
            700: { hue: 30, saturation: 6.25, lightness: 25.1 },
            800: { hue: 12, saturation: 6.49, lightness: 15.1 },
            900: { hue: 24, saturation: 9.8, lightness: 10 }
        }
    },
    red: {
        name: "red",
        shades: {
            50: { hue: 0, saturation: 85.71, lightness: 97.25 },
            100: { hue: 0, saturation: 93.33, lightness: 94.12 },
            200: { hue: 0, saturation: 96.3, lightness: 89.41 },
            300: { hue: 0, saturation: 93.55, lightness: 81.76 },
            400: { hue: 0, saturation: 90.6, lightness: 70.78 },
            500: { hue: 0, saturation: 84.24, lightness: 60.2 },
            600: { hue: 0, saturation: 72.22, lightness: 50.59 },
            700: { hue: 0, saturation: 73.71, lightness: 41.76 },
            800: { hue: 0, saturation: 70, lightness: 35.29 },
            900: { hue: 0, saturation: 62.82, lightness: 30.59 }
        }
    },
    orange: {
        name: "orange",
        shades: {
            50: { hue: 33.33, saturation: 100, lightness: 96.47 },
            100: { hue: 34.29, saturation: 100, lightness: 91.76 },
            200: { hue: 32.13, saturation: 97.83, lightness: 82.94 },
            300: { hue: 30.67, saturation: 97.16, lightness: 72.35 },
            400: { hue: 27.04, saturation: 95.95, lightness: 60.78 },
            500: { hue: 24.58, saturation: 94.98, lightness: 53.14 },
            600: { hue: 20.54, saturation: 90.24, lightness: 48.24 },
            700: { hue: 17.47, saturation: 88.33, lightness: 40.39 },
            800: { hue: 15, saturation: 79.07, lightness: 33.73 },
            900: { hue: 15.34, saturation: 74.65, lightness: 27.84 }
        }
    },
    amber: {
        name: "amber",
        shades: {
            50: { hue: 48, saturation: 100, lightness: 96.08 },
            100: { hue: 48, saturation: 96.49, lightness: 88.82 },
            200: { hue: 48, saturation: 96.64, lightness: 76.67 },
            300: { hue: 45.94, saturation: 96.69, lightness: 64.51 },
            400: { hue: 43.26, saturation: 96.41, lightness: 56.27 },
            500: { hue: 37.69, saturation: 92.13, lightness: 50.2 },
            600: { hue: 32.13, saturation: 94.62, lightness: 43.73 },
            700: { hue: 25.96, saturation: 90.48, lightness: 37.06 },
            800: { hue: 22.73, saturation: 82.5, lightness: 31.37 },
            900: { hue: 21.71, saturation: 77.78, lightness: 26.47 }
        }
    },
    yellow: {
        name: "yellow",
        shades: {
            50: { hue: 54.55, saturation: 91.67, lightness: 95.29 },
            100: { hue: 54.92, saturation: 96.72, lightness: 88.04 },
            200: { hue: 52.76, saturation: 98.26, lightness: 76.86 },
            300: { hue: 50.44, saturation: 97.82, lightness: 63.53 },
            400: { hue: 47.95, saturation: 95.82, lightness: 53.14 },
            500: { hue: 45.39, saturation: 93.39, lightness: 47.45 },
            600: { hue: 40.61, saturation: 96.12, lightness: 40.39 },
            700: { hue: 35.49, saturation: 91.67, lightness: 32.94 },
            800: { hue: 31.77, saturation: 80.95, lightness: 28.82 },
            900: { hue: 28.43, saturation: 72.52, lightness: 25.69 }
        }
    },
    lime: {
        name: "lime",
        shades: {
            50: { hue: 78.26, saturation: 92, lightness: 95.1 },
            100: { hue: 79.62, saturation: 89.09, lightness: 89.22 },
            200: { hue: 80.89, saturation: 88.46, lightness: 79.61 },
            300: { hue: 82, saturation: 84.54, lightness: 67.06 },
            400: { hue: 82.74, saturation: 78.04, lightness: 55.49 },
            500: { hue: 83.74, saturation: 80.53, lightness: 44.31 },
            600: { hue: 84.78, saturation: 85.22, lightness: 34.51 },
            700: { hue: 85.83, saturation: 78.38, lightness: 27.45 },
            800: { hue: 86.35, saturation: 68.97, lightness: 22.75 },
            900: { hue: 87.59, saturation: 61.33, lightness: 20.39 }
        }
    },
    green: {
        name: "green",
        shades: {
            50: { hue: 138.46, saturation: 76.47, lightness: 96.67 },
            100: { hue: 140.62, saturation: 84.21, lightness: 92.55 },
            200: { hue: 141.12, saturation: 78.87, lightness: 85.1 },
            300: { hue: 141.72, saturation: 76.64, lightness: 73.14 },
            400: { hue: 141.89, saturation: 69.16, lightness: 58.04 },
            500: { hue: 142.09, saturation: 70.56, lightness: 45.29 },
            600: { hue: 142.13, saturation: 76.22, lightness: 36.27 },
            700: { hue: 142.36, saturation: 71.81, lightness: 29.22 },
            800: { hue: 142.78, saturation: 64.23, lightness: 24.12 },
            900: { hue: 143.79, saturation: 61.16, lightness: 20.18 }
        }
    },
    emerald: {
        name: "emerald",
        shades: {
            50: { hue: 151.76, saturation: 80.95, lightness: 95.88 },
            100: { hue: 149.29, saturation: 80.39, lightness: 90 },
            200: { hue: 152.37, saturation: 76, lightness: 80.39 },
            300: { hue: 156.2, saturation: 71.6, lightness: 66.86 },
            400: { hue: 158.11, saturation: 64.37, lightness: 51.57 },
            500: { hue: 160.12, saturation: 84.08, lightness: 39.41 },
            600: { hue: 161.38, saturation: 93.55, lightness: 30.39 },
            700: { hue: 162.93, saturation: 93.55, lightness: 24.31 },
            800: { hue: 163.15, saturation: 88.12, lightness: 19.8 },
            900: { hue: 164.17, saturation: 85.71, lightness: 16.47 }
        }
    },
    teal: {
        name: "teal",
        shades: {
            50: { hue: 166.15, saturation: 76.47, lightness: 96.67 },
            100: { hue: 167.23, saturation: 85.45, lightness: 89.22 },
            200: { hue: 168.39, saturation: 83.78, lightness: 78.24 },
            300: { hue: 170.57, saturation: 76.92, lightness: 64.31 },
            400: { hue: 172.46, saturation: 66.01, lightness: 50.39 },
            500: { hue: 173.41, saturation: 80.39, lightness: 40 },
            600: { hue: 174.67, saturation: 83.85, lightness: 31.57 },
            700: { hue: 175.34, saturation: 77.44, lightness: 26.08 },
            800: { hue: 176.1, saturation: 69.37, lightness: 21.76 },
            900: { hue: 175.93, saturation: 60.82, lightness: 19.02 }
        }
    },
    cyan: {
        name: "cyan",
        shades: {
            50: { hue: 183.16, saturation: 100, lightness: 96.27 },
            100: { hue: 185.11, saturation: 95.92, lightness: 90.39 },
            200: { hue: 186.21, saturation: 93.55, lightness: 81.76 },
            300: { hue: 186.99, saturation: 92.41, lightness: 69.02 },
            400: { hue: 187.94, saturation: 85.71, lightness: 53.33 },
            500: { hue: 188.74, saturation: 94.5, lightness: 42.75 },
            600: { hue: 191.65, saturation: 91.4, lightness: 36.47 },
            700: { hue: 192.92, saturation: 82.28, lightness: 30.98 },
            800: { hue: 194.37, saturation: 69.57, lightness: 27.06 },
            900: { hue: 196.36, saturation: 63.64, lightness: 23.73 }
        }
    },
    sky: {
        name: "sky",
        shades: {
            50: { hue: 204, saturation: 100, lightness: 97.06 },
            100: { hue: 204, saturation: 93.75, lightness: 93.73 },
            200: { hue: 200.6, saturation: 94.37, lightness: 86.08 },
            300: { hue: 199.37, saturation: 95.49, lightness: 73.92 },
            400: { hue: 198.44, saturation: 93.2, lightness: 59.61 },
            500: { hue: 198.63, saturation: 88.66, lightness: 48.43 },
            600: { hue: 200.41, saturation: 98.01, lightness: 39.41 },
            700: { hue: 201.27, saturation: 96.34, lightness: 32.16 },
            800: { hue: 200.95, saturation: 90, lightness: 27.45 },
            900: { hue: 202.04, saturation: 80.33, lightness: 23.92 }
        }
    },
    blue: {
        name: "blue",
        shades: {
            50: { hue: 213.75, saturation: 100, lightness: 96.86 },
            100: { hue: 214.29, saturation: 94.59, lightness: 92.75 },
            200: { hue: 213.33, saturation: 96.92, lightness: 87.25 },
            300: { hue: 211.7, saturation: 96.36, lightness: 78.43 },
            400: { hue: 213.12, saturation: 93.9, lightness: 67.84 },
            500: { hue: 217.22, saturation: 91.22, lightness: 59.8 },
            600: { hue: 221.21, saturation: 83.19, lightness: 53.33 },
            700: { hue: 224.28, saturation: 76.33, lightness: 48.04 },
            800: { hue: 225.93, saturation: 70.73, lightness: 40.2 },
            900: { hue: 224.44, saturation: 64.29, lightness: 32.94 }
        }
    },
    indigo: {
        name: "indigo",
        shades: {
            50: { hue: 225.88, saturation: 100, lightness: 96.67 },
            100: { hue: 226.45, saturation: 100, lightness: 93.92 },
            200: { hue: 228, saturation: 96.49, lightness: 88.82 },
            300: { hue: 229.66, saturation: 93.55, lightness: 81.76 },
            400: { hue: 234.45, saturation: 89.47, lightness: 73.92 },
            500: { hue: 238.73, saturation: 83.53, lightness: 66.67 },
            600: { hue: 243.4, saturation: 75.36, lightness: 58.63 },
            700: { hue: 244.52, saturation: 57.94, lightness: 50.59 },
            800: { hue: 243.65, saturation: 54.5, lightness: 41.37 },
            900: { hue: 242.17, saturation: 47.43, lightness: 34.31 }
        }
    },
    violet: {
        name: "violet",
        shades: {
            50: { hue: 250, saturation: 100, lightness: 97.65 },
            100: { hue: 251.43, saturation: 91.3, lightness: 95.49 },
            200: { hue: 250.5, saturation: 95.24, lightness: 91.76 },
            300: { hue: 252.5, saturation: 94.74, lightness: 85.1 },
            400: { hue: 255.14, saturation: 91.74, lightness: 76.27 },
            500: { hue: 258.31, saturation: 89.53, lightness: 66.27 },
            600: { hue: 262.12, saturation: 83.26, lightness: 57.84 },
            700: { hue: 263.39, saturation: 69.96, lightness: 50.39 },
            800: { hue: 263.36, saturation: 69.3, lightness: 42.16 },
            900: { hue: 263.5, saturation: 67.42, lightness: 34.9 }
        }
    },
    purple: {
        name: "purple",
        shades: {
            50: { hue: 270, saturation: 100, lightness: 98.04 },
            100: { hue: 268.7, saturation: 100, lightness: 95.49 },
            200: { hue: 268.57, saturation: 100, lightness: 91.76 },
            300: { hue: 269.19, saturation: 97.37, lightness: 85.1 },
            400: { hue: 270, saturation: 95.24, lightness: 75.29 },
            500: { hue: 270.74, saturation: 91.01, lightness: 65.1 },
            600: { hue: 271.48, saturation: 81.33, lightness: 55.88 },
            700: { hue: 272.09, saturation: 71.67, lightness: 47.06 },
            800: { hue: 272.89, saturation: 67.16, lightness: 39.41 },
            900: { hue: 273.64, saturation: 65.64, lightness: 31.96 }
        }
    },
    fuchsia: {
        name: "fuchsia",
        shades: {
            50: { hue: 289.09, saturation: 100, lightness: 97.84 },
            100: { hue: 286.96, saturation: 100, lightness: 95.49 },
            200: { hue: 288.26, saturation: 95.83, lightness: 90.59 },
            300: { hue: 291.11, saturation: 93.1, lightness: 82.94 },
            400: { hue: 292.03, saturation: 91.43, lightness: 72.55 },
            500: { hue: 292.19, saturation: 84.08, lightness: 60.59 },
            600: { hue: 293.41, saturation: 69.48, lightness: 48.82 },
            700: { hue: 294.69, saturation: 72.41, lightness: 39.8 },
            800: { hue: 295.42, saturation: 70.24, lightness: 32.94 },
            900: { hue: 296.7, saturation: 63.64, lightness: 28.04 }
        }
    },
    pink: {
        name: "pink",
        shades: {
            50: { hue: 327.27, saturation: 73.33, lightness: 97.06 },
            100: { hue: 325.71, saturation: 77.78, lightness: 94.71 },
            200: { hue: 325.91, saturation: 84.62, lightness: 89.8 },
            300: { hue: 327.41, saturation: 87.1, lightness: 81.76 },
            400: { hue: 328.62, saturation: 85.53, lightness: 70.2 },
            500: { hue: 330.37, saturation: 81.19, lightness: 60.39 },
            600: { hue: 333.33, saturation: 71.43, lightness: 50.59 },
            700: { hue: 335.06, saturation: 77.57, lightness: 41.96 },
            800: { hue: 335.82, saturation: 74.44, lightness: 35.29 },
            900: { hue: 335.89, saturation: 69.03, lightness: 30.39 }
        }
    },
    rose: {
        name: "rose",
        shades: {
            50: { hue: 355.71, saturation: 100, lightness: 97.25 },
            100: { hue: 355.56, saturation: 100, lightness: 94.71 },
            200: { hue: 352.65, saturation: 96.08, lightness: 90 },
            300: { hue: 352.58, saturation: 95.7, lightness: 81.76 },
            400: { hue: 351.3, saturation: 94.52, lightness: 71.37 },
            500: { hue: 349.72, saturation: 89.16, lightness: 60.2 },
            600: { hue: 346.84, saturation: 77.17, lightness: 49.8 },
            700: { hue: 345.35, saturation: 82.69, lightness: 40.78 },
            800: { hue: 343.4, saturation: 79.66, lightness: 34.71 },
            900: { hue: 341.54, saturation: 75.48, lightness: 30.39 }
        }
    }
};
