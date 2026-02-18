import { useConfig } from "~/composables/core/baseConfig";

/**
 * Initialize CSS variables from config on app load
 * This ensures colors are set even on pages without the generator
 */
export default defineNuxtPlugin((_nuxtApp) => {
    const config = useConfig();
    // Set initial CSS variables from config
    document.documentElement.style.setProperty("--hue-slider-value", String(config.colors.hue));
    document.documentElement.style.setProperty("--saturation-slider-value", `${config.colors.saturation}%`);
    document.documentElement.style.setProperty("--lightness-slider-value", `${config.colors.lightness}%`);
});
