<script setup lang="ts">
const { status, triggerPrompt } = usePwaInstallPrompt();
</script>

<template>
  <main class="h-screen flex flex-col justify-center items-center">
    <div
      v-if="status === 'installed'"
      class="flex flex-col items-center gap-3 text-center"
    >
      <UIcon
        name="material-symbols:check-circle-outline"
        class="size-12 text-success"
      />
      <p class="font-semibold">Application déjà installée</p>
      <p class="max-w-xs text-muted text-sm">
        L'application est déjà installée sur cet appareil.
      </p>
      <UButton variant="soft" color="neutral" to="/">
        Retour à l'accueil
      </UButton>
    </div>
    <div v-else class="flex flex-col items-center gap-5">
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
