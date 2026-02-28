// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/color-mode"],

  ssr: false,

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },

  runtimeConfig: {
    public: {
      googleMapsKey: "LEAKED_KEY_REMOVED",
    },
  },

  routeRules: {
    "/": { prerender: false },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: false,
    },
  },
});
