<script setup lang="ts">
import LoadingSpinner from "~/components/loadingSpinner.vue";
import { useRouter } from "vue-router";
import { usePwaInstallPrompt } from "@/composables/usePwaInstallPrompt";

const { status, triggerPrompt } = usePwaInstallPrompt();

const router = useRouter();

if (status.value === "installed") {
  router.push("/");
}
</script>

<template>
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
