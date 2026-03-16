/**
 * Tailwind CSS v4 default color palette — HSL values.
 * Converted from official OKLCH values.
 * Source: https://tailwindcss.com/docs/colors
 *
 * Categories:
 *   chromatic     — Full-saturation colors (avg sat > 50%)
 *   grey-high     — Strongly tinted greys: slate, gray (avg sat 25-36%)
 *   grey-low      — Lightly tinted greys: zinc, stone, taupe, mauve, mist, olive (avg sat 5-12%)
 *   neutral       — Pure achromatic grey (0% saturation)
 */

export interface TailwindShade {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface TailwindColor {
    name: string;
    category: "chromatic" | "grey-high" | "grey-low" | "neutral";
    shades: Record<string, TailwindShade>;
}

/** Visual ordering: chromatic first (hue wheel), then greys (by saturation) */
export const colorOrder = [
    // Chromatic (hue wheel order)
    "red", "rose", "pink", "fuchsia", "purple", "violet",
    "indigo", "blue", "sky", "cyan", "teal", "emerald",
    "green", "lime", "yellow", "amber", "orange",
    // Greys (high -> low saturation -> neutral)
    "slate", "gray",
    "mauve", "mist", "olive", "taupe", "stone", "zinc",
    "neutral"
];

export const shadeOrder = ["950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50"];

export const categoryLabels: Record<string, string> = {
    chromatic: "Chromatic",
    "grey-high": "Tinted Greys \u2014 High Saturation",
    "grey-low": "Tinted Greys \u2014 Low Saturation",
    neutral: "Neutral"
};

export const categoryOrder = ["chromatic", "grey-high", "grey-low", "neutral"] as const;

export const tailwindColors: Record<string, TailwindColor> = {
    // Chromatic

    red: {
        name: "Red",
        category: "chromatic",
        shades: {
            50: { hue: 0, saturation: 85.71, lightness: 97.25 },
            100: { hue: 0, saturation: 93.33, lightness: 94.12 },
            200: { hue: 0, saturation: 96.3, lightness: 89.41 },
            300: { hue: 0, saturation: 93.55, lightness: 81.76 },
            400: { hue: 0, saturation: 90.6, lightness: 70.78 },
            500: { hue: 357, saturation: 96, lightness: 60.2 },
            600: { hue: 357, saturation: 94, lightness: 50.59 },
            700: { hue: 358, saturation: 77, lightness: 41.76 },
            800: { hue: 358, saturation: 73, lightness: 35.29 },
            900: { hue: 357, saturation: 69.3, lightness: 30.59 },
            950: { hue: 359, saturation: 79.4, lightness: 15.35 }
        }
    },
    orange: {
        name: "Orange",
        category: "chromatic",
        shades: {
            50: { hue: 33, saturation: 100, lightness: 96.47 },
            100: { hue: 34, saturation: 100, lightness: 91.76 },
            200: { hue: 32, saturation: 97.8, lightness: 82.94 },
            300: { hue: 31, saturation: 97.2, lightness: 72.35 },
            400: { hue: 27, saturation: 96, lightness: 60.78 },
            500: { hue: 25, saturation: 100, lightness: 53.14 },
            600: { hue: 21, saturation: 90.2, lightness: 48.24 },
            700: { hue: 17, saturation: 88.3, lightness: 40.39 },
            800: { hue: 15, saturation: 83.1, lightness: 33.73 },
            900: { hue: 15, saturation: 74.7, lightness: 27.84 },
            950: { hue: 13, saturation: 84.8, lightness: 14.42 }
        }
    },
    amber: {
        name: "Amber",
        category: "chromatic",
        shades: {
            50: { hue: 48, saturation: 100, lightness: 96.08 },
            100: { hue: 48, saturation: 96.5, lightness: 88.82 },
            200: { hue: 48, saturation: 96.6, lightness: 76.67 },
            300: { hue: 46, saturation: 96.7, lightness: 64.51 },
            400: { hue: 43, saturation: 96.4, lightness: 56.27 },
            500: { hue: 36, saturation: 100, lightness: 50.2 },
            600: { hue: 32, saturation: 94.6, lightness: 43.73 },
            700: { hue: 26, saturation: 90.5, lightness: 37.06 },
            800: { hue: 23, saturation: 92.6, lightness: 31.37 },
            900: { hue: 22, saturation: 90.2, lightness: 26.47 },
            950: { hue: 21, saturation: 96.7, lightness: 13.94 }
        }
    },
    yellow: {
        name: "Yellow",
        category: "chromatic",
        shades: {
            50: { hue: 55, saturation: 91.7, lightness: 95.29 },
            100: { hue: 55, saturation: 96.7, lightness: 88.04 },
            200: { hue: 53, saturation: 98.3, lightness: 76.86 },
            300: { hue: 50, saturation: 97.8, lightness: 63.53 },
            400: { hue: 48, saturation: 95.8, lightness: 53.14 },
            500: { hue: 44, saturation: 100, lightness: 47.45 },
            600: { hue: 41, saturation: 96.1, lightness: 40.39 },
            700: { hue: 35, saturation: 91.7, lightness: 32.94 },
            800: { hue: 32, saturation: 83.3, lightness: 28.82 },
            900: { hue: 28, saturation: 72.5, lightness: 25.69 },
            950: { hue: 26, saturation: 87.5, lightness: 13.96 }
        }
    },
    lime: {
        name: "Lime",
        category: "chromatic",
        shades: {
            50: { hue: 78, saturation: 92, lightness: 95.1 },
            100: { hue: 80, saturation: 89.1, lightness: 89.22 },
            200: { hue: 81, saturation: 88.5, lightness: 79.61 },
            300: { hue: 82, saturation: 84.5, lightness: 67.06 },
            400: { hue: 83, saturation: 78, lightness: 55.49 },
            500: { hue: 84, saturation: 100, lightness: 44.31 },
            600: { hue: 85, saturation: 85.2, lightness: 34.51 },
            700: { hue: 86, saturation: 78.4, lightness: 27.45 },
            800: { hue: 86, saturation: 71.1, lightness: 22.75 },
            900: { hue: 88, saturation: 71.1, lightness: 20.39 },
            950: { hue: 89, saturation: 88.6, lightness: 9.61 }
        }
    },
    green: {
        name: "Green",
        category: "chromatic",
        shades: {
            50: { hue: 138, saturation: 76.5, lightness: 96.67 },
            100: { hue: 141, saturation: 84.2, lightness: 92.55 },
            200: { hue: 141, saturation: 78.9, lightness: 85.1 },
            300: { hue: 142, saturation: 76.6, lightness: 73.14 },
            400: { hue: 142, saturation: 69.2, lightness: 58.04 },
            500: { hue: 144, saturation: 100, lightness: 45.29 },
            600: { hue: 142, saturation: 76.2, lightness: 36.27 },
            700: { hue: 142, saturation: 73.1, lightness: 29.22 },
            800: { hue: 143, saturation: 73.3, lightness: 24.12 },
            900: { hue: 150, saturation: 87.6, lightness: 20.18 },
            950: { hue: 145, saturation: 87.6, lightness: 9.65 }
        }
    },
    emerald: {
        name: "Emerald",
        category: "chromatic",
        shades: {
            50: { hue: 152, saturation: 80.9, lightness: 95.88 },
            100: { hue: 149, saturation: 80.4, lightness: 90 },
            200: { hue: 152, saturation: 76, lightness: 80.39 },
            300: { hue: 156, saturation: 71.6, lightness: 66.86 },
            400: { hue: 158, saturation: 64.4, lightness: 51.57 },
            500: { hue: 160, saturation: 100, lightness: 39.41 },
            600: { hue: 161, saturation: 93.6, lightness: 30.39 },
            700: { hue: 163, saturation: 93.6, lightness: 24.31 },
            800: { hue: 163, saturation: 88.1, lightness: 19.8 },
            900: { hue: 164, saturation: 85.7, lightness: 16.47 },
            950: { hue: 166, saturation: 100, lightness: 8.68 }
        }
    },
    teal: {
        name: "Teal",
        category: "chromatic",
        shades: {
            50: { hue: 166, saturation: 76.5, lightness: 96.67 },
            100: { hue: 167, saturation: 85.5, lightness: 89.22 },
            200: { hue: 168, saturation: 83.8, lightness: 78.24 },
            300: { hue: 171, saturation: 76.9, lightness: 64.31 },
            400: { hue: 172, saturation: 76, lightness: 50.39 },
            500: { hue: 174, saturation: 100, lightness: 40 },
            600: { hue: 175, saturation: 83.9, lightness: 31.57 },
            700: { hue: 175, saturation: 77.4, lightness: 26.08 },
            800: { hue: 176, saturation: 69.4, lightness: 21.76 },
            900: { hue: 176, saturation: 60.8, lightness: 19.02 },
            950: { hue: 179, saturation: 91.6, lightness: 9.64 }
        }
    },
    cyan: {
        name: "Cyan",
        category: "chromatic",
        shades: {
            50: { hue: 183, saturation: 100, lightness: 96.27 },
            100: { hue: 185, saturation: 95.9, lightness: 90.39 },
            200: { hue: 186, saturation: 93.6, lightness: 81.76 },
            300: { hue: 187, saturation: 92.4, lightness: 69.02 },
            400: { hue: 188, saturation: 85.7, lightness: 53.33 },
            500: { hue: 189, saturation: 100, lightness: 42.75 },
            600: { hue: 192, saturation: 91.4, lightness: 36.47 },
            700: { hue: 193, saturation: 82.3, lightness: 30.98 },
            800: { hue: 194, saturation: 72.1, lightness: 27.06 },
            900: { hue: 196, saturation: 63.6, lightness: 23.73 },
            950: { hue: 197, saturation: 85.4, lightness: 14.55 }
        }
    },
    sky: {
        name: "Sky",
        category: "chromatic",
        shades: {
            50: { hue: 204, saturation: 100, lightness: 97.06 },
            100: { hue: 204, saturation: 93.8, lightness: 93.73 },
            200: { hue: 201, saturation: 94.4, lightness: 86.08 },
            300: { hue: 199, saturation: 95.5, lightness: 73.92 },
            400: { hue: 198, saturation: 93.2, lightness: 59.61 },
            500: { hue: 199, saturation: 100, lightness: 48.43 },
            600: { hue: 200, saturation: 98, lightness: 39.41 },
            700: { hue: 201, saturation: 96.3, lightness: 32.16 },
            800: { hue: 201, saturation: 90, lightness: 27.45 },
            900: { hue: 202, saturation: 87.2, lightness: 23.92 },
            950: { hue: 204, saturation: 87.2, lightness: 15.52 }
        }
    },
    blue: {
        name: "Blue",
        category: "chromatic",
        shades: {
            50: { hue: 214, saturation: 100, lightness: 96.86 },
            100: { hue: 214, saturation: 94.6, lightness: 92.75 },
            200: { hue: 213, saturation: 96.9, lightness: 87.25 },
            300: { hue: 212, saturation: 96.4, lightness: 78.43 },
            400: { hue: 213, saturation: 93.9, lightness: 67.84 },
            500: { hue: 217, saturation: 100, lightness: 59.8 },
            600: { hue: 221, saturation: 83.2, lightness: 53.33 },
            700: { hue: 224, saturation: 76.3, lightness: 48.04 },
            800: { hue: 226, saturation: 70.7, lightness: 40.2 },
            900: { hue: 224, saturation: 64.3, lightness: 32.94 },
            950: { hue: 227, saturation: 58.7, lightness: 21.15 }
        }
    },
    indigo: {
        name: "Indigo",
        category: "chromatic",
        shades: {
            50: { hue: 226, saturation: 100, lightness: 96.67 },
            100: { hue: 226, saturation: 100, lightness: 93.92 },
            200: { hue: 228, saturation: 96.5, lightness: 88.82 },
            300: { hue: 230, saturation: 93.6, lightness: 81.76 },
            400: { hue: 234, saturation: 89.5, lightness: 73.92 },
            500: { hue: 241, saturation: 100, lightness: 66.67 },
            600: { hue: 243, saturation: 75.4, lightness: 58.63 },
            700: { hue: 245, saturation: 57.9, lightness: 50.59 },
            800: { hue: 244, saturation: 54.5, lightness: 41.37 },
            900: { hue: 242, saturation: 49.1, lightness: 34.31 },
            950: { hue: 244, saturation: 49.1, lightness: 20.16 }
        }
    },
    violet: {
        name: "Violet",
        category: "chromatic",
        shades: {
            50: { hue: 250, saturation: 100, lightness: 97.65 },
            100: { hue: 251, saturation: 91.3, lightness: 95.49 },
            200: { hue: 251, saturation: 95.2, lightness: 91.76 },
            300: { hue: 253, saturation: 94.7, lightness: 85.1 },
            400: { hue: 255, saturation: 91.7, lightness: 76.27 },
            500: { hue: 261, saturation: 100, lightness: 66.27 },
            600: { hue: 262, saturation: 83.3, lightness: 57.84 },
            700: { hue: 263, saturation: 74.3, lightness: 50.39 },
            800: { hue: 263, saturation: 69.3, lightness: 42.16 },
            900: { hue: 264, saturation: 67.4, lightness: 34.9 },
            950: { hue: 262, saturation: 77.7, lightness: 22.86 }
        }
    },
    purple: {
        name: "Purple",
        category: "chromatic",
        shades: {
            50: { hue: 270, saturation: 100, lightness: 98.04 },
            100: { hue: 269, saturation: 100, lightness: 95.49 },
            200: { hue: 269, saturation: 100, lightness: 91.76 },
            300: { hue: 269, saturation: 97.4, lightness: 85.1 },
            400: { hue: 270, saturation: 95.2, lightness: 75.29 },
            500: { hue: 273, saturation: 100, lightness: 65.1 },
            600: { hue: 271, saturation: 81.3, lightness: 55.88 },
            700: { hue: 272, saturation: 72.4, lightness: 47.06 },
            800: { hue: 273, saturation: 73.5, lightness: 39.41 },
            900: { hue: 274, saturation: 72.6, lightness: 31.96 },
            950: { hue: 274, saturation: 94.3, lightness: 20.66 }
        }
    },
    fuchsia: {
        name: "Fuchsia",
        category: "chromatic",
        shades: {
            50: { hue: 289, saturation: 100, lightness: 97.84 },
            100: { hue: 287, saturation: 100, lightness: 95.49 },
            200: { hue: 288, saturation: 95.8, lightness: 90.59 },
            300: { hue: 291, saturation: 93.1, lightness: 82.94 },
            400: { hue: 292, saturation: 91.4, lightness: 72.55 },
            500: { hue: 293, saturation: 96, lightness: 60.59 },
            600: { hue: 293, saturation: 69.5, lightness: 48.82 },
            700: { hue: 295, saturation: 72.4, lightness: 39.8 },
            800: { hue: 295, saturation: 72.3, lightness: 32.94 },
            900: { hue: 297, saturation: 72.3, lightness: 28.04 },
            950: { hue: 297, saturation: 99.1, lightness: 15.6 }
        }
    },
    pink: {
        name: "Pink",
        category: "chromatic",
        shades: {
            50: { hue: 327, saturation: 73.3, lightness: 97.06 },
            100: { hue: 326, saturation: 77.8, lightness: 94.71 },
            200: { hue: 326, saturation: 84.6, lightness: 89.8 },
            300: { hue: 327, saturation: 87.1, lightness: 81.76 },
            400: { hue: 329, saturation: 85.5, lightness: 70.2 },
            500: { hue: 328, saturation: 92, lightness: 60.39 },
            600: { hue: 333, saturation: 71.4, lightness: 50.59 },
            700: { hue: 335, saturation: 77.6, lightness: 41.96 },
            800: { hue: 336, saturation: 74.4, lightness: 35.29 },
            900: { hue: 336, saturation: 71.1, lightness: 30.39 },
            950: { hue: 335, saturation: 90.9, lightness: 16.65 }
        }
    },
    rose: {
        name: "Rose",
        category: "chromatic",
        shades: {
            50: { hue: 356, saturation: 100, lightness: 97.25 },
            100: { hue: 356, saturation: 100, lightness: 94.71 },
            200: { hue: 353, saturation: 96.1, lightness: 90 },
            300: { hue: 353, saturation: 95.7, lightness: 81.76 },
            400: { hue: 351, saturation: 94.5, lightness: 71.37 },
            500: { hue: 345, saturation: 100, lightness: 60.2 },
            600: { hue: 347, saturation: 89.5, lightness: 49.8 },
            700: { hue: 345, saturation: 82.7, lightness: 40.78 },
            800: { hue: 343, saturation: 79.7, lightness: 34.71 },
            900: { hue: 339, saturation: 75.5, lightness: 30.39 },
            950: { hue: 342, saturation: 94.4, lightness: 15.6 }
        }
    },

    // Grey - High Saturation

    slate: {
        name: "Slate",
        category: "grey-high",
        shades: {
            50: { hue: 210, saturation: 34.5, lightness: 98.04 },
            100: { hue: 210, saturation: 40.5, lightness: 96.08 },
            200: { hue: 214, saturation: 33, lightness: 91.37 },
            300: { hue: 213, saturation: 29.9, lightness: 83.92 },
            400: { hue: 215, saturation: 22.6, lightness: 64.51 },
            500: { hue: 215, saturation: 18.4, lightness: 46.96 },
            600: { hue: 215, saturation: 22, lightness: 34.78 },
            700: { hue: 215, saturation: 27.9, lightness: 26.86 },
            800: { hue: 217, saturation: 36.1, lightness: 17.45 },
            900: { hue: 222, saturation: 49.4, lightness: 11.27 },
            950: { hue: 229, saturation: 85.1, lightness: 5 }
        }
    },
    gray: {
        name: "Gray",
        category: "grey-high",
        shades: {
            50: { hue: 210, saturation: 24.2, lightness: 98.12 },
            100: { hue: 220, saturation: 15, lightness: 95.88 },
            200: { hue: 220, saturation: 13.6, lightness: 90.98 },
            300: { hue: 216, saturation: 13.1, lightness: 83.92 },
            400: { hue: 218, saturation: 11.9, lightness: 64.31 },
            500: { hue: 220, saturation: 10.3, lightness: 46.27 },
            600: { hue: 215, saturation: 15.7, lightness: 34.31 },
            700: { hue: 217, saturation: 21.1, lightness: 26.86 },
            800: { hue: 215, saturation: 31, lightness: 16.86 },
            900: { hue: 221, saturation: 41.7, lightness: 11.08 },
            950: { hue: 224, saturation: 72.2, lightness: 4.17 }
        }
    },

    // Grey - Low Saturation

    mauve: {
        name: "Mauve",
        category: "grey-low",
        shades: {
            50: { hue: 0, saturation: 0, lightness: 98.03 },
            100: { hue: 300, saturation: 6.8, lightness: 94.86 },
            200: { hue: 300, saturation: 5.7, lightness: 90 },
            300: { hue: 300, saturation: 7.9, lightness: 82.91 },
            400: { hue: 295, saturation: 5.9, lightness: 64.08 },
            500: { hue: 293, saturation: 8, lightness: 44.71 },
            600: { hue: 292, saturation: 8.9, lightness: 32.73 },
            700: { hue: 296, saturation: 10.8, lightness: 25.11 },
            800: { hue: 289, saturation: 14.3, lightness: 15.11 },
            900: { hue: 293, saturation: 15.6, lightness: 10.17 },
            950: { hue: 300, saturation: 13.9, lightness: 4.1 }
        }
    },
    mist: {
        name: "Mist",
        category: "grey-low",
        shades: {
            50: { hue: 180, saturation: 19.5, lightness: 98.11 },
            100: { hue: 180, saturation: 7.3, lightness: 94.96 },
            200: { hue: 192, saturation: 10.8, lightness: 89.95 },
            300: { hue: 195, saturation: 9.2, lightness: 83.14 },
            400: { hue: 192, saturation: 8, lightness: 64.13 },
            500: { hue: 191, saturation: 9.2, lightness: 44.49 },
            600: { hue: 191, saturation: 9.7, lightness: 32.52 },
            700: { hue: 193, saturation: 10.8, lightness: 25.12 },
            800: { hue: 193, saturation: 12.2, lightness: 15.09 },
            900: { hue: 197, saturation: 12.9, lightness: 10.03 },
            950: { hue: 200, saturation: 14.1, lightness: 4.14 }
        }
    },
    olive: {
        name: "Olive",
        category: "grey-low",
        shades: {
            50: { hue: 60, saturation: 23, lightness: 98.06 },
            100: { hue: 60, saturation: 14.6, lightness: 94.93 },
            200: { hue: 60, saturation: 10.3, lightness: 90.01 },
            300: { hue: 60, saturation: 9.5, lightness: 83.12 },
            400: { hue: 60, saturation: 8.2, lightness: 64.13 },
            500: { hue: 60, saturation: 9.3, lightness: 44.48 },
            600: { hue: 60, saturation: 9.7, lightness: 32.51 },
            700: { hue: 60, saturation: 11.1, lightness: 25.12 },
            800: { hue: 60, saturation: 11.8, lightness: 15.08 },
            900: { hue: 60, saturation: 13.7, lightness: 9.98 },
            950: { hue: 60, saturation: 13.6, lightness: 4.13 }
        }
    },
    taupe: {
        name: "Taupe",
        category: "grey-low",
        shades: {
            50: { hue: 30, saturation: 24, lightness: 98.08 },
            100: { hue: 0, saturation: 7.2, lightness: 94.93 },
            200: { hue: 12, saturation: 10.8, lightness: 90.06 },
            300: { hue: 15, saturation: 9.1, lightness: 83.13 },
            400: { hue: 16, saturation: 8.1, lightness: 64.12 },
            500: { hue: 17, saturation: 9.2, lightness: 44.51 },
            600: { hue: 15, saturation: 9.4, lightness: 32.52 },
            700: { hue: 13, saturation: 10.7, lightness: 25.12 },
            800: { hue: 13, saturation: 11.4, lightness: 15.14 },
            900: { hue: 17, saturation: 13.9, lightness: 9.98 },
            950: { hue: 20, saturation: 13.8, lightness: 4.12 }
        }
    },
    stone: {
        name: "Stone",
        category: "grey-low",
        shades: {
            50: { hue: 60, saturation: 7.1, lightness: 97.84 },
            100: { hue: 60, saturation: 3.6, lightness: 95.88 },
            200: { hue: 20, saturation: 6.9, lightness: 90 },
            300: { hue: 24, saturation: 6.7, lightness: 82.94 },
            400: { hue: 24, saturation: 5.8, lightness: 63.92 },
            500: { hue: 25, saturation: 5.9, lightness: 44.71 },
            600: { hue: 33, saturation: 6.3, lightness: 32.35 },
            700: { hue: 30, saturation: 7.2, lightness: 25.1 },
            800: { hue: 12, saturation: 7.2, lightness: 15.1 },
            900: { hue: 24, saturation: 9.6, lightness: 10 },
            950: { hue: 20, saturation: 13.8, lightness: 4.13 }
        }
    },
    zinc: {
        name: "Zinc",
        category: "grey-low",
        shades: {
            50: { hue: 0, saturation: 0, lightness: 98.04 },
            100: { hue: 240, saturation: 3.5, lightness: 95.88 },
            200: { hue: 240, saturation: 5.9, lightness: 90 },
            300: { hue: 240, saturation: 5.4, lightness: 83.92 },
            400: { hue: 240, saturation: 5.7, lightness: 64.31 },
            500: { hue: 240, saturation: 4.4, lightness: 46.27 },
            600: { hue: 240, saturation: 6, lightness: 34.18 },
            700: { hue: 240, saturation: 5.7, lightness: 26.08 },
            800: { hue: 240, saturation: 4, lightness: 15.88 },
            900: { hue: 240, saturation: 6, lightness: 10 },
            950: { hue: 240, saturation: 11.2, lightness: 3.98 }
        }
    },

    // Neutral (Pure Grey)

    neutral: {
        name: "Neutral",
        category: "neutral",
        shades: {
            50: { hue: 0, saturation: 0, lightness: 98.04 },
            100: { hue: 0, saturation: 0, lightness: 96.08 },
            200: { hue: 0, saturation: 0, lightness: 89.8 },
            300: { hue: 0, saturation: 0, lightness: 83.14 },
            400: { hue: 0, saturation: 0, lightness: 63 },
            500: { hue: 0, saturation: 0, lightness: 45.1 },
            600: { hue: 0, saturation: 0, lightness: 32.16 },
            700: { hue: 0, saturation: 0, lightness: 25.1 },
            800: { hue: 0, saturation: 0, lightness: 14.9 },
            900: { hue: 0, saturation: 0, lightness: 9.02 },
            950: { hue: 0, saturation: 0, lightness: 3.94 }
        }
    }
};
