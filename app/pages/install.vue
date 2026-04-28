<script setup lang="ts">
const router = useRouter();
const { status, triggerPrompt } = usePwaInstallPrompt();

onMounted(() => {
  const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
  if (isInstalled) router.push("/");
});
</script>

<template>
  <div
    style="
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      background: red;
      color: white;
      padding: 8px;
      font-size: 12px;
    "
  >
    PWA status: {{ status }}
  </div>
  <main class="h-screen flex flex-col justify-center items-center">
    <div class="flex flex-col items-center gap-5">
      <UButton
        label="Install"
        variant="soft"
        color="neutral"
        :icon="
          status === 'unavailable'
            ? 'material-symbols:close'
            : 'material-symbols:download'
        "
        :disabled="status === 'unavailable'"
        :is-loading="status === 'pending'"
        @click="triggerPrompt"
      >
        <span>{{
          status === "unavailable" ? "Installation impossible" : "Installer"
        }}</span>
        <LoadingSpinner
          v-if="status === 'pending'"
          color="white"
          class="size-5"
        />
      </UButton>
      <p
        v-if="status === 'unavailable'"
        class="max-w-xs text-center text-muted"
      >
        L'installation n'est pas disponible sur cet appareil.
      </p>
    </div>
  </main>
</template>
