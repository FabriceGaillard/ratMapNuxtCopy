// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  sourcemap: {
    server: false,
    client: false,
  },

  modules: ["@nuxt/eslint", "@nuxt/ui", "@vite-pwa/nuxt"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {},

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  runtimeConfig: {
    public: {
      googleMapsApiKey: "",
      googleMapId: "",
    },
  },

  pwa: {
    manifest: {
      name: "RatMap",
      short_name: "RatMap",
      description: "Une carte collaborative des associations de rats.",
      theme_color: "#1a1a1a",
      background_color: "#000000",
      display: "standalone",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      screenshots: [],
      categories: ["maps"],
    },
    workbox: {
      globPatterns: [
        "**/*.{js,css,html,png,jpg,jpeg,gif,svg,webp,woff,woff2,ttf,eot}",
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@googlemaps/js-api-loader",
        "reka-ui",
        "decode-google-map-polyline",
      ],
    },
  },
});
