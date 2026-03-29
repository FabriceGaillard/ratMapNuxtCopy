export const usePwaServiceWorker = () => {
  const isInstalled = ref(false);
  const isSupported = ref(false);

  const updateAvailable = ref(false);
  const registration = ref<ServiceWorkerRegistration | null>(null);

  onMounted(() => {
    if ("serviceWorker" in navigator) {
      isSupported.value = true;

      // Vérifier si l'app est installée
      isInstalled.value = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;

      // Écouter les mises à jour du service worker
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        updateAvailable.value = true;
      });
    }
  });

  const reloadPage = () => {
    window.location.reload();
  };

  return {
    isInstalled,
    isSupported,
    updateAvailable,
    registration,
    reloadPage,
  };
};
