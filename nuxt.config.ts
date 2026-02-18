// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@nuxt/eslint", "@nuxt/ui"],

    imports: {
        dirs: [
            "composables/core",
            "composables/input",
            "composables/output",
            "composables/themes",
            "composables/ui",
            "composables/utils"
        ]
    },

    devtools: {
        enabled: true
    },

    css: ["~/assets/css/main.css"],

    routeRules: {
        "/": { prerender: true }
    },

    compatibilityDate: "2025-01-15",

    eslint: {
        config: {
            stylistic: {
                semi: true,
                indent: 4,
                quotes: "double",
                commaDangle: "never",
                braceStyle: "1tbs"
            }
        }
    }
});
