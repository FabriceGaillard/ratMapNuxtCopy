// Écoute beforeinstallprompt le plus tôt possible, avant le montage des composants
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);

export const usePwaDeferred = () => deferredPrompt;

export default defineNuxtPlugin(() => {
  console.log("[PWA] plugin initialized");
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    console.log("[PWA] beforeinstallprompt fired");
    e.preventDefault();
    deferredPrompt.value = e as BeforeInstallPromptEvent;
  });
});
