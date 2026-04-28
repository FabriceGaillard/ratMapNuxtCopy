<script setup lang="ts">
onMounted(() => {
  if (import.meta.client && window.location.search.includes("debug")) {
    import("eruda").then((e) => e.default.init());
  }
});

useHead({
  meta: [
    { charset: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
    { name: "theme-color", content: "#1a1a1a" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    { name: "apple-mobile-web-app-title", content: "BoggleMaps" },
    { name: "theme-color", content: "transparent" },
    { name: "color-scheme", content: "dark" },
  ],
  link: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/pwa-192x192.png" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
  ],
});
</script>

<template>
  <UApp :toaster="{ position: 'top-center' }">
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
