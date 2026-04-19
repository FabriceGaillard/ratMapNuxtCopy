<script setup lang="ts">
import { DialogTitle, DialogDescription } from "reka-ui";
import { formatDuration } from "~/helpers/duration";
import { colorMap } from "~/utils/colors";
import CloseButton from "../buttons/closeButton.vue";
import app from "~/stores/app";
import GoogleRouteRepository from "~/repositories/GoogleRouteRepository";

const snapPoints = reactive([] as (string | number)[]);
const activeSnapPoint = ref<string | number | null>(null);
const listEl = ref<{ $el: HTMLElement } | null>(null);

const props = defineProps<{
  loadingRoutes?: boolean;
  routes: (Awaited<ReturnType<GoogleRouteRepository["computeRoute"]>> & {
    marker: Record<string, any>;
    layer: Record<string, any>;
  })[];
}>();

const emit = defineEmits<{
  close: [];
  selectRoute: [route: (typeof props.routes)[number]];
}>();

onMounted(() => {
  snapPoints.push(...["230px", `${window.innerHeight - 150}px`, 1]);
});

watch(activeSnapPoint, (val) => {
  if (val !== 1) {
    listEl.value?.$el?.scrollTo({ top: 0 });
  }
});
</script>

<template>
  <UDrawer
    :modal="false"
    :dismissible="false"
    direction="bottom"
    :snapPoints="snapPoints"
    @update:activeSnapPoint="activeSnapPoint = $event"
    :ui="{
      content: 'max-h-none px-3 pt-3 pb-1 min-h-[130px]',
      body: 'overflow-y-auto',
    }"
  >
    <template #content>
      <div class="flex flex-col h-full min-h-0">
        <div class="flex items-center gap-2 w-full flex-shrink-0">
          <DialogTitle class="text-lg font-semibold flex items-center gap-2">
            <UIcon
              name="material-symbols:my-location-rounded"
              class="w-5 h-5"
            />
            {{ "Itinéraires" }}
          </DialogTitle>
          <UBadge variant="soft" color="neutral" size="sm" class="ml-0">
            pour {{ formatDuration(app.itinerary.limits.hours * 3600) }} de
            trajet maximum
          </UBadge>

          <DialogDescription class="sr-only">
            {{ "Listes disponibles d'itineraires" }}
          </DialogDescription>
          <CloseButton @close="$emit('close')" />
        </div>

        <span
          v-if="loadingRoutes"
          class="text-dimmed text-sm flex items-center gap-2"
        >
          <UIcon
            name="material-symbols:hourglass-top-rounded"
            class="w-4 h-4 animate-spin"
          />
          Calcul des itinéraires en cours…
        </span>
        <span v-else-if="!routes.length" class="text-dimmed text-sm">
          Aucun itinéraire disponible pour la durée choisie
        </span>
        <UPageList
          ref="listEl"
          divide
          v-else
          :class="[
            'flex-1 min-h-0',
            activeSnapPoint === 1 ? 'overflow-y-auto' : 'overflow-y-hidden',
          ]"
        >
          <UPageCard
            v-for="route in routes"
            :key="`${route.destination.lat}-${route.destination.lng}`"
            variant="ghost"
            :ui="{
              container: 'px-0 w-full',
              body: 'w-full',
            }"
            class="cursor-pointer"
            @click="emit('selectRoute', route)"
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
      </div>
    </template>
  </UDrawer>
</template>
