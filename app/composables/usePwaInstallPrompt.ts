// ~/composables/usePwaInstallPrompt.ts
import { ref, onMounted } from "vue";

export const usePwaInstallPrompt = () => {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
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

    // Chrome / Android
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      console.log("Before install prompt event triggered");
      e.preventDefault();
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      status.value = "readyToInstall";
    });

    // iOS
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandaloneMode =
      "standalone" in window.navigator && (window.navigator as any).standalone;
    if (isIos && !isInStandaloneMode) {
      status.value = "iosBanner";
    }
  });

  // 🔹 on exporte juste le composable, pas deferredPrompt directement
  return { status, triggerPrompt, deferredPrompt };
};
