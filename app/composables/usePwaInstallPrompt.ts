// ~/composables/usePwaInstallPrompt.ts
import { ref, onMounted } from "vue";
import { usePwaDeferred } from "~/plugins/pwa-install.client";

export const usePwaInstallPrompt = () => {
  const deferredPrompt = usePwaDeferred();
  const status = ref<
    "pending" | "readyToInstall" | "installed" | "iosBanner" | "unavailable"
  >("unavailable");

  const triggerPrompt = async () => {
    if (deferredPrompt.value) {
      status.value = "pending";
      await deferredPrompt.value.prompt();
      const choiceResult = await deferredPrompt.value.userChoice;
      if (choiceResult.outcome === "accepted") {
        status.value = "installed";
      } else {
        status.value = "readyToInstall";
      }
      // on vide l'événement après utilisation
      deferredPrompt.value = null;
    }
  };

  onMounted(() => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    if (isInstalled) {
      status.value = "installed";
      return;
    }

    // Si l'event a déjà été capturé par le plugin avant le montage
    if (deferredPrompt.value) {
      status.value = "readyToInstall";
    }

    // Au cas où l'event arrive après le montage
    watch(deferredPrompt, (val) => {
      if (val) status.value = "readyToInstall";
    });

    // iOS
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandaloneMode =
      "standalone" in window.navigator && (window.navigator as any).standalone;
    if (isIos && !isInStandaloneMode) {
      status.value = "iosBanner";
    }
  });

  return { status, triggerPrompt, deferredPrompt };
};
