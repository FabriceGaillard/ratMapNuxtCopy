// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  sourcemap: {
    server: false,
    client: false,
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vite-pwa/nuxt",
    "nuxt-auth-utils",
    "nuxt-security",
  ],

  devtools: {
    enabled: import.meta.dev,
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
    allowedEmails: "",
    session: {
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    },
    oauth: {
      google: {
        clientId: "",
        clientSecret: "",
      },
    },
    public: {
      googleMapsApiKey: "",
      googleMapId: "",
      nodeEnv: "",
      framacarteWorkerUrl: "",
    },
  },

  nitro: {
    preset: "vercel",
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'", // requis pour Nuxt SPA
          "'wasm-unsafe-eval'", // requis pour WebAssembly (Google Maps)
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
        ],
        "worker-src": ["'self'", "blob:"], // requis pour Google Maps Web Workers
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
          "https://tile.openstreetmap.org",
          "https://framacarte.org",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "connect-src": [
          "'self'",
          "data:", // requis pour Google Maps (PNG base64)
          "https://maps.googleapis.com",
          "https://routes.googleapis.com",
          "https://nominatim.openstreetmap.org",
          "https://framacarte.org",
          "https://sweet-base-5622.johanna-girodolle.workers.dev",
          "https://accounts.google.com",
          "https://www.gstatic.com",
          "https://api.iconify.design", // requis pour Nuxt UI (chargement dynamique des icônes)
        ],
        "frame-src": ["'none'"],
        "object-src": ["'none'"],
      },
      xFrameOptions: "DENY",
      xContentTypeOptions: "nosniff",
      referrerPolicy: "strict-origin-when-cross-origin",
      permissionsPolicy: {
        geolocation: ["self"],
        camera: [],
        microphone: [],
      },
    },
    rateLimiter: false, // pas de KV store dispo sur Vercel sans config supplémentaire
  },

  pwa: {
    manifest: {
      name: "BoggleMaps",
      short_name: "BoggleMaps",
      description: "Une carte collaborative des associations de rats.",
      theme_color: "transparent",
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
        "dompurify",
      ],
    },
  },
});
