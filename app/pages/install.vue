<script setup lang="ts">
const router = useRouter();
const { $pwa } = useNuxtApp();

onMounted(() => {
  const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
  if (isInstalled) router.push("/");

  // Fallback Android : si après 3s l'event n'est pas disponible
  const isAndroid = /android/i.test(navigator.userAgent);
  if (isAndroid) {
    setTimeout(() => {
      if (!$pwa?.showInstallPrompt) {
        router.replace("/?androidInstall=true");
      }
    }, 3000);
  }
});
</script>

<template>
  <main class="h-screen flex flex-col justify-center items-center">
    <div class="flex flex-col items-center gap-5">
      <UButton
        variant="soft"
        color="neutral"
        :icon="
          $pwa?.showInstallPrompt
            ? 'material-symbols:download'
            : 'material-symbols:close'
        "
        :disabled="!$pwa?.showInstallPrompt"
        @click="$pwa?.install()"
      >
        <span>{{
          $pwa?.showInstallPrompt ? "Installer" : "Installation impossible"
        }}</span>
      </UButton>
      <p
        v-if="!$pwa?.showInstallPrompt"
        class="max-w-xs text-center text-muted"
      >
        L'installation n'est pas disponible sur cet appareil.
      </p>
    </div>
  </main>
</template>
