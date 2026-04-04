<script setup lang="ts">
import { DialogTitle, DialogDescription } from "reka-ui";
import { formatDuration } from "~/helpers/duration";
import { colorMap } from "~/utils/colors";
import CloseButton from "../buttons/closeButton.vue";

const snapPoints = reactive([] as (string | number)[])

defineProps<{
  routes: Awaited<ReturnType<GoogleRouteRepository["computeRoute"]>>[];
}>();

onMounted(()=>{
  snapPoints.push(...['230px', `${window.innerHeight - 150}px`, 1])
})
</script>

<template>
  <UDrawer
    :modal="false"
    :dismissible="false"
    route="bottom"
    :snapPoints="snapPoints"
    :ui="{
      content: 'z-30 max-h-none px-3 pt-3 pb-1',
      body: 'overflow-y-auto',
    }"
  >
    <template #content>
      <div class="flex items-center gap-2 w-full">
        <DialogTitle class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="material-symbols:my-location-rounded" class="w-5 h-5" />
          {{ "Itinéraires" }}
        </DialogTitle>

        <DialogDescription class="sr-only">
          {{ "Listes disponibles d'itineraires" }}
        </DialogDescription>
        <CloseButton @close="$emit('close')" />
      </div>

      <span v-if="!routes.length" class="text-dimmed text-sm">
        Aucun itinéraire disponible
      </span>
      <UPageList divide v-else>
        <UPageCard
          v-for="route in routes"
          :key="route.id"
          variant="ghost"
          :ui="{
            container: 'px-0',
            body: 'w-full',
          }"
        >
          <template #body>
            <UBadge size="md" color="neutral" variant="soft">
              {{ route.layer.label }}
              <template #leading>
                <UChip
                  standalone
                  inset
                  size="xl"
                  :ui="{
                    base: `${colorMap[route.layer.color]}`,
                  }"
                />
              </template>
            </UBadge>
            <div class="flex items-center min-w-0">
              <h3 class="text-sm font-semibold truncate">
                {{ route.marker.properties.name }}
              </h3>

              <UBadge
                variant="soft"
                size="md"
                color="neutral"
                class="ml-auto font-bold shrink-0"
              >
                {{ formatDuration(route.seconds) }}
              </UBadge>
            </div>
          </template>
        </UPageCard>
      </UPageList>
    </template>
  </UDrawer>
</template>
