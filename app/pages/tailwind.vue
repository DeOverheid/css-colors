<template>
    <UContainer>
        <div class="tailwind-page">
            <h1 class="page-title">
                Tailwind CSS Colors Reference
            </h1>
            <p class="page-description">
                Exact Tailwind CSS color values in HSL format
            </p>

            <div class="hue-spectrum-grid">
                <div
                    v-for="colorName in colorOrder"
                    :key="colorName"
                    class="hue-spectrum-row">
                    <!-- Color name label -->
                    <span class="color-name">{{ colorName }}</span>

                    <!-- Color swatches -->
                    <div class="swatches-column">
                        <div class="swatches-row">
                            <div
                                v-for="shade in shadeOrder"
                                :key="shade"
                                class="color-swatch"
                                :style="{ backgroundColor: getHslColor(colorName, shade) }"
                                :title="getTooltip(colorName, shade)" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Shade labels -->
            <div class="shade-labels">
                <span class="color-name" />
                <div class="labels-row">
                    <span
                        v-for="shade in shadeOrder"
                        :key="shade"
                        class="shade-label">{{ shade }}</span>
                </div>
            </div>

            <USeparator class="my-6" />

            <UButton
                to="/"
                icon="i-lucide-arrow-left"
                variant="ghost">
                Back to Home
            </UButton>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
interface ShadeData {
    hue: number;
    saturation: number;
    lightness: number;
    hex: string;
}

interface ColorData {
    name: string;
    shades: Record<string, ShadeData>;
}

// Main Tailwind colors (excluding deprecated aliases)
const colorOrder = [
    "slate",
    "gray",
    "zinc",
    "neutral",
    "stone",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose"
];

const shadeOrder = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"];

// Tailwind HSL color data
const tailwindColors: Record<string, ColorData> = {
    slate: {
        name: "slate",
        shades: {
            50: { hue: 210, saturation: 40, lightness: 98.04, hex: "#F8FAFC" },
            100: { hue: 210, saturation: 40, lightness: 96.08, hex: "#F1F5F9" },
            200: { hue: 214.29, saturation: 31.82, lightness: 91.37, hex: "#E2E8F0" },
            300: { hue: 212.73, saturation: 26.83, lightness: 83.92, hex: "#CBD5E1" },
            400: { hue: 215, saturation: 20.22, lightness: 65.1, hex: "#94A3B8" },
            500: { hue: 215.38, saturation: 16.32, lightness: 46.86, hex: "#64748B" },
            600: { hue: 215.29, saturation: 19.32, lightness: 34.51, hex: "#475569" },
            700: { hue: 215.29, saturation: 25, lightness: 26.67, hex: "#334155" },
            800: { hue: 217.24, saturation: 32.58, lightness: 17.45, hex: "#1E293B" },
            900: { hue: 222.22, saturation: 47.37, lightness: 11.18, hex: "#0F172A" }
        }
    },
    gray: {
        name: "gray",
        shades: {
            50: { hue: 210, saturation: 20, lightness: 98.04, hex: "#F9FAFB" },
            100: { hue: 220, saturation: 14.29, lightness: 95.88, hex: "#F3F4F6" },
            200: { hue: 220, saturation: 13.04, lightness: 90.98, hex: "#E5E7EB" },
            300: { hue: 216, saturation: 12.2, lightness: 83.92, hex: "#D1D5DB" },
            400: { hue: 217.89, saturation: 10.61, lightness: 64.9, hex: "#9CA3AF" },
            500: { hue: 220, saturation: 8.94, lightness: 46.08, hex: "#6B7280" },
            600: { hue: 215, saturation: 13.79, lightness: 34.12, hex: "#4B5563" },
            700: { hue: 216.92, saturation: 19.12, lightness: 26.67, hex: "#374151" },
            800: { hue: 215, saturation: 27.91, lightness: 16.86, hex: "#1F2937" },
            900: { hue: 220.91, saturation: 39.29, lightness: 10.98, hex: "#111827" }
        }
    },
    zinc: {
        name: "zinc",
        shades: {
            50: { hue: 0, saturation: 0, lightness: 98.04, hex: "#FAFAFA" },
            100: { hue: 240, saturation: 4.76, lightness: 95.88, hex: "#F4F4F5" },
            200: { hue: 240, saturation: 5.88, lightness: 90, hex: "#E4E4E7" },
            300: { hue: 240, saturation: 4.88, lightness: 83.92, hex: "#D4D4D8" },
            400: { hue: 240, saturation: 5.03, lightness: 64.9, hex: "#A1A1AA" },
            500: { hue: 240, saturation: 3.83, lightness: 46.08, hex: "#71717A" },
            600: { hue: 240, saturation: 5.2, lightness: 33.92, hex: "#52525B" },
            700: { hue: 240, saturation: 5.26, lightness: 26.08, hex: "#3F3F46" },
            800: { hue: 240, saturation: 3.7, lightness: 15.88, hex: "#27272A" },
            900: { hue: 240, saturation: 5.88, lightness: 10, hex: "#18181B" }
        }
    },
    neutral: {
        name: "neutral",
        shades: {
            50: { hue: 0, saturation: 0, lightness: 98.04, hex: "#FAFAFA" },
            100: { hue: 0, saturation: 0, lightness: 96.08, hex: "#F5F5F5" },
            200: { hue: 0, saturation: 0, lightness: 89.8, hex: "#E5E5E5" },
            300: { hue: 0, saturation: 0, lightness: 83.14, hex: "#D4D4D4" },
            400: { hue: 0, saturation: 0, lightness: 63.92, hex: "#A3A3A3" },
            500: { hue: 0, saturation: 0, lightness: 45.1, hex: "#737373" },
            600: { hue: 0, saturation: 0, lightness: 32.16, hex: "#525252" },
            700: { hue: 0, saturation: 0, lightness: 25.1, hex: "#404040" },
            800: { hue: 0, saturation: 0, lightness: 14.9, hex: "#262626" },
            900: { hue: 0, saturation: 0, lightness: 9.02, hex: "#171717" }
        }
    },
    stone: {
        name: "stone",
        shades: {
            50: { hue: 60, saturation: 9.09, lightness: 97.84, hex: "#FAFAF9" },
            100: { hue: 60, saturation: 4.76, lightness: 95.88, hex: "#F5F5F4" },
            200: { hue: 20, saturation: 5.88, lightness: 90, hex: "#E7E5E4" },
            300: { hue: 24, saturation: 5.75, lightness: 82.94, hex: "#D6D3D1" },
            400: { hue: 24, saturation: 5.43, lightness: 63.92, hex: "#A8A29E" },
            500: { hue: 25, saturation: 5.26, lightness: 44.71, hex: "#78716C" },
            600: { hue: 33.33, saturation: 5.45, lightness: 32.35, hex: "#57534E" },
            700: { hue: 30, saturation: 6.25, lightness: 25.1, hex: "#44403C" },
            800: { hue: 12, saturation: 6.49, lightness: 15.1, hex: "#292524" },
            900: { hue: 24, saturation: 9.8, lightness: 10, hex: "#1C1917" }
        }
    },
    red: {
        name: "red",
        shades: {
            50: { hue: 0, saturation: 85.71, lightness: 97.25, hex: "#FEF2F2" },
            100: { hue: 0, saturation: 93.33, lightness: 94.12, hex: "#FEE2E2" },
            200: { hue: 0, saturation: 96.3, lightness: 89.41, hex: "#FECACA" },
            300: { hue: 0, saturation: 93.55, lightness: 81.76, hex: "#FCA5A5" },
            400: { hue: 0, saturation: 90.6, lightness: 70.78, hex: "#F87171" },
            500: { hue: 0, saturation: 84.24, lightness: 60.2, hex: "#EF4444" },
            600: { hue: 0, saturation: 72.22, lightness: 50.59, hex: "#DC2626" },
            700: { hue: 0, saturation: 73.71, lightness: 41.76, hex: "#B91C1C" },
            800: { hue: 0, saturation: 70, lightness: 35.29, hex: "#991B1B" },
            900: { hue: 0, saturation: 62.82, lightness: 30.59, hex: "#7F1D1D" }
        }
    },
    orange: {
        name: "orange",
        shades: {
            50: { hue: 33.33, saturation: 100, lightness: 96.47, hex: "#FFF7ED" },
            100: { hue: 34.29, saturation: 100, lightness: 91.76, hex: "#FFEDD5" },
            200: { hue: 32.13, saturation: 97.83, lightness: 82.94, hex: "#FED7AA" },
            300: { hue: 30.67, saturation: 97.16, lightness: 72.35, hex: "#FDBA74" },
            400: { hue: 27.04, saturation: 95.95, lightness: 60.78, hex: "#FB923C" },
            500: { hue: 24.58, saturation: 94.98, lightness: 53.14, hex: "#F97316" },
            600: { hue: 20.54, saturation: 90.24, lightness: 48.24, hex: "#EA580C" },
            700: { hue: 17.47, saturation: 88.33, lightness: 40.39, hex: "#C2410C" },
            800: { hue: 15, saturation: 79.07, lightness: 33.73, hex: "#9A3412" },
            900: { hue: 15.34, saturation: 74.65, lightness: 27.84, hex: "#7C2D12" }
        }
    },
    amber: {
        name: "amber",
        shades: {
            50: { hue: 48, saturation: 100, lightness: 96.08, hex: "#FFFBEB" },
            100: { hue: 48, saturation: 96.49, lightness: 88.82, hex: "#FEF3C7" },
            200: { hue: 48, saturation: 96.64, lightness: 76.67, hex: "#FDE68A" },
            300: { hue: 45.94, saturation: 96.69, lightness: 64.51, hex: "#FCD34D" },
            400: { hue: 43.26, saturation: 96.41, lightness: 56.27, hex: "#FBBF24" },
            500: { hue: 37.69, saturation: 92.13, lightness: 50.2, hex: "#F59E0B" },
            600: { hue: 32.13, saturation: 94.62, lightness: 43.73, hex: "#D97706" },
            700: { hue: 25.96, saturation: 90.48, lightness: 37.06, hex: "#B45309" },
            800: { hue: 22.73, saturation: 82.5, lightness: 31.37, hex: "#92400E" },
            900: { hue: 21.71, saturation: 77.78, lightness: 26.47, hex: "#78350F" }
        }
    },
    yellow: {
        name: "yellow",
        shades: {
            50: { hue: 54.55, saturation: 91.67, lightness: 95.29, hex: "#FEFCE8" },
            100: { hue: 54.92, saturation: 96.72, lightness: 88.04, hex: "#FEF9C3" },
            200: { hue: 52.76, saturation: 98.26, lightness: 76.86, hex: "#FEF08A" },
            300: { hue: 50.44, saturation: 97.82, lightness: 63.53, hex: "#FDE047" },
            400: { hue: 47.95, saturation: 95.82, lightness: 53.14, hex: "#FACC15" },
            500: { hue: 45.39, saturation: 93.39, lightness: 47.45, hex: "#EAB308" },
            600: { hue: 40.61, saturation: 96.12, lightness: 40.39, hex: "#CA8A04" },
            700: { hue: 35.49, saturation: 91.67, lightness: 32.94, hex: "#A16207" },
            800: { hue: 31.77, saturation: 80.95, lightness: 28.82, hex: "#854D0E" },
            900: { hue: 28.43, saturation: 72.52, lightness: 25.69, hex: "#713F12" }
        }
    },
    lime: {
        name: "lime",
        shades: {
            50: { hue: 78.26, saturation: 92, lightness: 95.1, hex: "#F7FEE7" },
            100: { hue: 79.62, saturation: 89.09, lightness: 89.22, hex: "#ECFCCB" },
            200: { hue: 80.89, saturation: 88.46, lightness: 79.61, hex: "#D9F99D" },
            300: { hue: 82, saturation: 84.54, lightness: 67.06, hex: "#BEF264" },
            400: { hue: 82.74, saturation: 78.04, lightness: 55.49, hex: "#A3E635" },
            500: { hue: 83.74, saturation: 80.53, lightness: 44.31, hex: "#84CC16" },
            600: { hue: 84.78, saturation: 85.22, lightness: 34.51, hex: "#65A30D" },
            700: { hue: 85.83, saturation: 78.38, lightness: 27.45, hex: "#4D7C0F" },
            800: { hue: 86.35, saturation: 68.97, lightness: 22.75, hex: "#3F6212" },
            900: { hue: 87.59, saturation: 61.33, lightness: 20.39, hex: "#365314" }
        }
    },
    green: {
        name: "green",
        shades: {
            50: { hue: 138.46, saturation: 76.47, lightness: 96.67, hex: "#F0FDF4" },
            100: { hue: 140.62, saturation: 84.21, lightness: 92.55, hex: "#DCFCE7" },
            200: { hue: 141.12, saturation: 78.87, lightness: 85.1, hex: "#BBF7D0" },
            300: { hue: 141.72, saturation: 76.64, lightness: 73.14, hex: "#86EFAC" },
            400: { hue: 141.89, saturation: 69.16, lightness: 58.04, hex: "#4ADE80" },
            500: { hue: 142.09, saturation: 70.56, lightness: 45.29, hex: "#22C55E" },
            600: { hue: 142.13, saturation: 76.22, lightness: 36.27, hex: "#16A34A" },
            700: { hue: 142.36, saturation: 71.81, lightness: 29.22, hex: "#15803D" },
            800: { hue: 142.78, saturation: 64.23, lightness: 24.12, hex: "#166534" },
            900: { hue: 143.79, saturation: 61.16, lightness: 20.18, hex: "#14532D" }
        }
    },
    emerald: {
        name: "emerald",
        shades: {
            50: { hue: 151.76, saturation: 80.95, lightness: 95.88, hex: "#ECFDF5" },
            100: { hue: 149.29, saturation: 80.39, lightness: 90, hex: "#D1FAE5" },
            200: { hue: 152.37, saturation: 76, lightness: 80.39, hex: "#A7F3D0" },
            300: { hue: 156.2, saturation: 71.6, lightness: 66.86, hex: "#6EE7B7" },
            400: { hue: 158.11, saturation: 64.37, lightness: 51.57, hex: "#34D399" },
            500: { hue: 160.12, saturation: 84.08, lightness: 39.41, hex: "#10B981" },
            600: { hue: 161.38, saturation: 93.55, lightness: 30.39, hex: "#059669" },
            700: { hue: 162.93, saturation: 93.55, lightness: 24.31, hex: "#047857" },
            800: { hue: 163.15, saturation: 88.12, lightness: 19.8, hex: "#065F46" },
            900: { hue: 164.17, saturation: 85.71, lightness: 16.47, hex: "#064E3B" }
        }
    },
    teal: {
        name: "teal",
        shades: {
            50: { hue: 166.15, saturation: 76.47, lightness: 96.67, hex: "#F0FDFA" },
            100: { hue: 167.23, saturation: 85.45, lightness: 89.22, hex: "#CCFBF1" },
            200: { hue: 168.39, saturation: 83.78, lightness: 78.24, hex: "#99F6E4" },
            300: { hue: 170.57, saturation: 76.92, lightness: 64.31, hex: "#5EEAD4" },
            400: { hue: 172.46, saturation: 66.01, lightness: 50.39, hex: "#2DD4BF" },
            500: { hue: 173.41, saturation: 80.39, lightness: 40, hex: "#14B8A6" },
            600: { hue: 174.67, saturation: 83.85, lightness: 31.57, hex: "#0D9488" },
            700: { hue: 175.34, saturation: 77.44, lightness: 26.08, hex: "#0F766E" },
            800: { hue: 176.1, saturation: 69.37, lightness: 21.76, hex: "#115E59" },
            900: { hue: 175.93, saturation: 60.82, lightness: 19.02, hex: "#134E4A" }
        }
    },
    cyan: {
        name: "cyan",
        shades: {
            50: { hue: 183.16, saturation: 100, lightness: 96.27, hex: "#ECFEFF" },
            100: { hue: 185.11, saturation: 95.92, lightness: 90.39, hex: "#CFFAFE" },
            200: { hue: 186.21, saturation: 93.55, lightness: 81.76, hex: "#A5F3FC" },
            300: { hue: 186.99, saturation: 92.41, lightness: 69.02, hex: "#67E8F9" },
            400: { hue: 187.94, saturation: 85.71, lightness: 53.33, hex: "#22D3EE" },
            500: { hue: 188.74, saturation: 94.5, lightness: 42.75, hex: "#06B6D4" },
            600: { hue: 191.65, saturation: 91.4, lightness: 36.47, hex: "#0891B2" },
            700: { hue: 192.92, saturation: 82.28, lightness: 30.98, hex: "#0E7490" },
            800: { hue: 194.37, saturation: 69.57, lightness: 27.06, hex: "#155E75" },
            900: { hue: 196.36, saturation: 63.64, lightness: 23.73, hex: "#164E63" }
        }
    },
    sky: {
        name: "sky",
        shades: {
            50: { hue: 204, saturation: 100, lightness: 97.06, hex: "#F0F9FF" },
            100: { hue: 204, saturation: 93.75, lightness: 93.73, hex: "#E0F2FE" },
            200: { hue: 200.6, saturation: 94.37, lightness: 86.08, hex: "#BAE6FD" },
            300: { hue: 199.37, saturation: 95.49, lightness: 73.92, hex: "#7DD3FC" },
            400: { hue: 198.44, saturation: 93.2, lightness: 59.61, hex: "#38BDF8" },
            500: { hue: 198.63, saturation: 88.66, lightness: 48.43, hex: "#0EA5E9" },
            600: { hue: 200.41, saturation: 98.01, lightness: 39.41, hex: "#0284C7" },
            700: { hue: 201.27, saturation: 96.34, lightness: 32.16, hex: "#0369A1" },
            800: { hue: 200.95, saturation: 90, lightness: 27.45, hex: "#075985" },
            900: { hue: 202.04, saturation: 80.33, lightness: 23.92, hex: "#0C4A6E" }
        }
    },
    blue: {
        name: "blue",
        shades: {
            50: { hue: 213.75, saturation: 100, lightness: 96.86, hex: "#EFF6FF" },
            100: { hue: 214.29, saturation: 94.59, lightness: 92.75, hex: "#DBEAFE" },
            200: { hue: 213.33, saturation: 96.92, lightness: 87.25, hex: "#BFDBFE" },
            300: { hue: 211.7, saturation: 96.36, lightness: 78.43, hex: "#93C5FD" },
            400: { hue: 213.12, saturation: 93.9, lightness: 67.84, hex: "#60A5FA" },
            500: { hue: 217.22, saturation: 91.22, lightness: 59.8, hex: "#3B82F6" },
            600: { hue: 221.21, saturation: 83.19, lightness: 53.33, hex: "#2563EB" },
            700: { hue: 224.28, saturation: 76.33, lightness: 48.04, hex: "#1D4ED8" },
            800: { hue: 225.93, saturation: 70.73, lightness: 40.2, hex: "#1E40AF" },
            900: { hue: 224.44, saturation: 64.29, lightness: 32.94, hex: "#1E3A8A" }
        }
    },
    indigo: {
        name: "indigo",
        shades: {
            50: { hue: 225.88, saturation: 100, lightness: 96.67, hex: "#EEF2FF" },
            100: { hue: 226.45, saturation: 100, lightness: 93.92, hex: "#E0E7FF" },
            200: { hue: 228, saturation: 96.49, lightness: 88.82, hex: "#C7D2FE" },
            300: { hue: 229.66, saturation: 93.55, lightness: 81.76, hex: "#A5B4FC" },
            400: { hue: 234.45, saturation: 89.47, lightness: 73.92, hex: "#818CF8" },
            500: { hue: 238.73, saturation: 83.53, lightness: 66.67, hex: "#6366F1" },
            600: { hue: 243.4, saturation: 75.36, lightness: 58.63, hex: "#4F46E5" },
            700: { hue: 244.52, saturation: 57.94, lightness: 50.59, hex: "#4338CA" },
            800: { hue: 243.65, saturation: 54.5, lightness: 41.37, hex: "#3730A3" },
            900: { hue: 242.17, saturation: 47.43, lightness: 34.31, hex: "#312E81" }
        }
    },
    violet: {
        name: "violet",
        shades: {
            50: { hue: 250, saturation: 100, lightness: 97.65, hex: "#F5F3FF" },
            100: { hue: 251.43, saturation: 91.3, lightness: 95.49, hex: "#EDE9FE" },
            200: { hue: 250.5, saturation: 95.24, lightness: 91.76, hex: "#DDD6FE" },
            300: { hue: 252.5, saturation: 94.74, lightness: 85.1, hex: "#C4B5FD" },
            400: { hue: 255.14, saturation: 91.74, lightness: 76.27, hex: "#A78BFA" },
            500: { hue: 258.31, saturation: 89.53, lightness: 66.27, hex: "#8B5CF6" },
            600: { hue: 262.12, saturation: 83.26, lightness: 57.84, hex: "#7C3AED" },
            700: { hue: 263.39, saturation: 69.96, lightness: 50.39, hex: "#6D28D9" },
            800: { hue: 263.36, saturation: 69.3, lightness: 42.16, hex: "#5B21B6" },
            900: { hue: 263.5, saturation: 67.42, lightness: 34.9, hex: "#4C1D95" }
        }
    },
    purple: {
        name: "purple",
        shades: {
            50: { hue: 270, saturation: 100, lightness: 98.04, hex: "#FAF5FF" },
            100: { hue: 268.7, saturation: 100, lightness: 95.49, hex: "#F3E8FF" },
            200: { hue: 268.57, saturation: 100, lightness: 91.76, hex: "#E9D5FF" },
            300: { hue: 269.19, saturation: 97.37, lightness: 85.1, hex: "#D8B4FE" },
            400: { hue: 270, saturation: 95.24, lightness: 75.29, hex: "#C084FC" },
            500: { hue: 270.74, saturation: 91.01, lightness: 65.1, hex: "#A855F7" },
            600: { hue: 271.48, saturation: 81.33, lightness: 55.88, hex: "#9333EA" },
            700: { hue: 272.09, saturation: 71.67, lightness: 47.06, hex: "#7E22CE" },
            800: { hue: 272.89, saturation: 67.16, lightness: 39.41, hex: "#6B21A8" },
            900: { hue: 273.64, saturation: 65.64, lightness: 31.96, hex: "#581C87" }
        }
    },
    fuchsia: {
        name: "fuchsia",
        shades: {
            50: { hue: 289.09, saturation: 100, lightness: 97.84, hex: "#FDF4FF" },
            100: { hue: 286.96, saturation: 100, lightness: 95.49, hex: "#FAE8FF" },
            200: { hue: 288.26, saturation: 95.83, lightness: 90.59, hex: "#F5D0FE" },
            300: { hue: 291.11, saturation: 93.1, lightness: 82.94, hex: "#F0ABFC" },
            400: { hue: 292.03, saturation: 91.43, lightness: 72.55, hex: "#E879F9" },
            500: { hue: 292.19, saturation: 84.08, lightness: 60.59, hex: "#D946EF" },
            600: { hue: 293.41, saturation: 69.48, lightness: 48.82, hex: "#C026D3" },
            700: { hue: 294.69, saturation: 72.41, lightness: 39.8, hex: "#A21CAF" },
            800: { hue: 295.42, saturation: 70.24, lightness: 32.94, hex: "#86198F" },
            900: { hue: 296.7, saturation: 63.64, lightness: 28.04, hex: "#701A75" }
        }
    },
    pink: {
        name: "pink",
        shades: {
            50: { hue: 327.27, saturation: 73.33, lightness: 97.06, hex: "#FDF2F8" },
            100: { hue: 325.71, saturation: 77.78, lightness: 94.71, hex: "#FCE7F3" },
            200: { hue: 325.91, saturation: 84.62, lightness: 89.8, hex: "#FBCFE8" },
            300: { hue: 327.41, saturation: 87.1, lightness: 81.76, hex: "#F9A8D4" },
            400: { hue: 328.62, saturation: 85.53, lightness: 70.2, hex: "#F472B6" },
            500: { hue: 330.37, saturation: 81.19, lightness: 60.39, hex: "#EC4899" },
            600: { hue: 333.33, saturation: 71.43, lightness: 50.59, hex: "#DB2777" },
            700: { hue: 335.06, saturation: 77.57, lightness: 41.96, hex: "#BE185D" },
            800: { hue: 335.82, saturation: 74.44, lightness: 35.29, hex: "#9D174D" },
            900: { hue: 335.89, saturation: 69.03, lightness: 30.39, hex: "#831843" }
        }
    },
    rose: {
        name: "rose",
        shades: {
            50: { hue: 355.71, saturation: 100, lightness: 97.25, hex: "#FFF1F2" },
            100: { hue: 355.56, saturation: 100, lightness: 94.71, hex: "#FFE4E6" },
            200: { hue: 352.65, saturation: 96.08, lightness: 90, hex: "#FECDD3" },
            300: { hue: 352.58, saturation: 95.7, lightness: 81.76, hex: "#FDA4AF" },
            400: { hue: 351.3, saturation: 94.52, lightness: 71.37, hex: "#FB7185" },
            500: { hue: 349.72, saturation: 89.16, lightness: 60.2, hex: "#F43F5E" },
            600: { hue: 346.84, saturation: 77.17, lightness: 49.8, hex: "#E11D48" },
            700: { hue: 345.35, saturation: 82.69, lightness: 40.78, hex: "#BE123C" },
            800: { hue: 343.4, saturation: 79.66, lightness: 34.71, hex: "#9F1239" },
            900: { hue: 341.54, saturation: 75.48, lightness: 30.39, hex: "#881337" }
        }
    }
};

function getHslColor(colorName: string, shade: string): string {
    const color = tailwindColors[colorName];
    if (!color) return "transparent";
    const shadeData = color.shades[shade];
    if (!shadeData) return "transparent";
    return `hsl(${shadeData.hue}, ${shadeData.saturation}%, ${shadeData.lightness}%)`;
}

function getTooltip(colorName: string, shade: string): string {
    const color = tailwindColors[colorName];
    if (!color) return "";
    const shadeData = color.shades[shade];
    if (!shadeData) return "";
    return `${colorName}-${shade}\nH: ${shadeData.hue.toFixed(1)}° S: ${shadeData.saturation.toFixed(1)}% L: ${shadeData.lightness.toFixed(1)}%\n${shadeData.hex}`;
}
</script>

<style scoped>
.tailwind-page {
    padding: 2rem 0;
}

.page-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.page-description {
    opacity: 0.7;
    margin-bottom: 2rem;
}

.hue-spectrum-grid {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.hue-spectrum-row {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0.5rem;
    align-items: center;
}

.color-name {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    opacity: 0.8;
}

.swatches-column {
    display: flex;
    flex-direction: column;
}

.swatches-row {
    display: flex;
    gap: 0;
}

.color-swatch {
    flex: 1;
    aspect-ratio: 2 / 1;
    min-width: 0;
}

.shade-labels {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.labels-row {
    display: flex;
    gap: 0;
}

.shade-label {
    flex: 1;
    text-align: center;
    font-size: 0.625rem;
    opacity: 0.6;
}
</style>
