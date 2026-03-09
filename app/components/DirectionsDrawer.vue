<template>
  <UDrawer
    :modal="false"
    :direction="drawerDirection"
    :snapPoints="isDesktop ? undefined : [0.2, 0.5, 1]"
    :ui="{
      header: 'sticky top-0 left-0 flex',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <carIcon class="size-5" />
        <h2 class="text-xl font-semibold">Itinéraires</h2>
      </div>

      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-x"
        @click="emit('close')"
        class="ml-auto rounded-full"
        size="sm"
      />
    </template>
    <template #body>
      <p v-if="directions.length === 0" class="text-sm text-slate-500">
        Aucun itinéraire trouvé pour cette recherche.
      </p>

      <template v-else>
        <DurationSlider
          :model-value="maxHours"
          @update:model-value="emit('updateMaxHours', $event)"
          @pointerup="emit('recalculate')"
        />
        <div
          v-for="(direction, index) in directions"
          :key="index"
          class="border-b-1 border-gray-300 py-3"
        >
          <!-- Map Badge -->
          <UBadge size="xs" :color="direction.poi.map.color">
            {{ direction.poi.map.label }}
          </UBadge>
          <div class="flex items-center min-w-0">
            <!-- POI Name -->
            <h3 class="text-md font-semibold truncate">
              {{ direction.poi.name }}
            </h3>

            <!-- Duration -->
            <!-- <span class="text-md font-semibold ml-auto shrink-0">
              {{
                direction.durationText
                  .replace(/minute[s]?/, "min")
                  .replace(/heure[s]?/, "h")
              }}
            </span> -->

            <!-- Duration -->
            <UBadge
              variant="soft"
              size="md"
              color="neutral"
              class="ml-auto font-bold shrink-0"
            >
              {{
                direction.durationText
                  .replace(/minute[s]?/, "min")
                  .replace(/heure[s]?/, "h")
              }}
            </UBadge>
          </div>
          <!-- Address -->
          <p class="text-sm text-slate-500">
            {{ direction.poi.address }}
          </p>
        </div>
      </template>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import carIcon from "../../app/assets/icons/car.vue";

const props = defineProps<{
  directions: any[];
  maxHours: number;
}>();

const emit = defineEmits<{
  close: [];
  updateMaxHours: [value: number];
  recalculate: [];
}>();

// breakpoint "sm" (640px) – adapte si tu utilises un autre seuil
const isDesktop = useMediaQuery("(min-width: 640px)");

const drawerDirection = computed<"left" | "right" | "top" | "bottom">(() =>
  isDesktop.value ? "right" : "bottom",
);

const drawerHeightClass = computed(() =>
  isDesktop.value ? "h-full" : "h-[50vh]",
);
</script>
