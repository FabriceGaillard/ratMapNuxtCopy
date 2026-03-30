import { defineNuxtPlugin } from "#app";
import { deferredPrompt, status } from "@/composables/usePwaInstallPrompt";

export default defineNuxtPlugin(async (nuxtApp) => {
  const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
  if (isInstalled) {
    status.value = "installed";
  }

  window.addEventListener("beforeinstallprompt", (event: Event) => {
    event.preventDefault();
    deferredPrompt.value = event as BeforeInstallPromptEvent;
    status.value = "readyToInstall";
  });
});
