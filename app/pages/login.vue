<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const error = computed(() => route.query.error);
const errorMessage = computed(() => {
  if (error.value === "unauthorized")
    return "Ton compte Google n'est pas autorisé à accéder à cette app.";
  if (error.value === "oauth_failed")
    return "La connexion via Google a échoué. Réessaie.";
  return null;
});
</script>

<template>
  <main class="h-screen flex flex-col justify-center items-center gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold text-white">BoggleMaps</h1>
      <p class="text-sm text-neutral-400">
        La carte collaborative des associations de rats
      </p>
    </div>

    <UAlert
      v-if="errorMessage"
      icon="i-lucide-alert-circle"
      color="error"
      variant="soft"
      title="Accès refusé"
      :description="errorMessage"
      class="max-w-xs"
    />

    <UButton
      size="lg"
      color="neutral"
      variant="solid"
      icon="i-simple-icons-google"
      to="/auth/google"
      external
    >
      Se connecter avec Google
    </UButton>
  </main>
</template>
