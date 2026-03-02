<template>
  <UDrawer
    :modal="false"
    :direction="drawerDirection"
    :class="[drawerHeightClass, 'w-full sm:w-150 overflow-y-auto']"
  >
    <template #body>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-x"
        class="absolute right-4 top-8"
        @click="emit('close')"
      />

      <div class="space-y-4">
        <h2 class="text-2xl font-bold">{{ poi?.name }}</h2>
        <!-- no address displayed per user request -->
        <p v-if="poi.address" class="text-dimmed -mt-4">
          <span
            v-for="addressPart in poi.address.split(',').slice(0, 2)"
            :key="addressPart"
            class="block"
            >{{ addressPart.trim() }}</span
          >
        </p>

        <div class="flex gap-2">
          <UButton color="neutral" variant="soft" icon="i-lucide-share-2">
            Partager
          </UButton>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-arrow-up-right-20-solid"
          >
            Voir plus
          </UButton>
          <UButton color="neutral" variant="soft" icon="i-lucide-map">
            Itinéraire
          </UButton>
        </div>

        <!-- street view image only -->
        <div v-if="poi.streetViewUrl" class="overflow-hidden rounded-md">
          <img
            :src="poi.streetViewUrl"
            class="w-full h-auto object-cover"
            alt="Street view of address"
          />
        </div>

        <!-- Details -->
        <div v-if="poi" class="space-y-4">
          <!-- Coordinates -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500 uppercase tracking-wider">
                Latitude
              </p>
              <p class="text-sm text-slate-900 dark:text-white font-mono mt-1">
                {{ getLat() }}
              </p>
            </div>
            <div>
              <p class="text-xs text-slate-500 uppercase tracking-wider">
                Longitude
              </p>
              <p class="text-sm text-slate-900 dark:text-white font-mono mt-1">
                {{ getLng() }}
              </p>
            </div>
          </div>

          <!-- Address (from reverse geocoding) -->

          <!-- Layer -->
          <!-- <div v-if="poi.layer">
            <p class="text-xs text-slate-500 uppercase tracking-wider">
              Catégorie
            </p>
            <p class="text-sm text-slate-900 dark:text-white mt-1">
              {{ poi.layer }}
            </p>
          </div> -->

          <!-- Description -->
          <div v-if="poi.description">
            <p class="text-xs text-slate-500 uppercase tracking-wider">
              Description
            </p>
            <p class="text-sm text-slate-900 dark:text-white mt-1">
              {{ poi.description }}
            </p>
          </div>

          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">
            Map
          </p>
          <UBadge variant="soft" :color="poi.map.color">
            {{ poi.map.label }}
          </UBadge>

          <!-- Place types -->
          <!-- <div v-if="poi.types && poi.types.length > 0">
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Types de lieu
            </p>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="type in poi.types"
                :key="type"
                variant="subtle"
                color="neutral"
              >
                {{ formatPropertyKey(type) }}
              </UBadge>
            </div>
          </div> -->
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";

const props = defineProps<{
  poi: any | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

// breakpoint "sm" (640px) – adapte si tu utilises un autre seuil
const isDesktop = useMediaQuery("(min-width: 640px)");

const drawerDirection = computed<"left" | "right" | "top" | "bottom">(() =>
  isDesktop.value ? "right" : "bottom",
);

const drawerHeightClass = computed(() =>
  isDesktop.value ? "h-full" : "h-[50vh]",
);

const getLat = () => {
  if (!props.poi) return "";
  const lat = props.poi.position?.lat;
  return typeof lat === "function" ? lat().toFixed(6) : lat?.toFixed(6) || "";
};

const getLng = () => {
  if (!props.poi) return "";
  const lng = props.poi.position?.lng;
  return typeof lng === "function" ? lng().toFixed(6) : lng?.toFixed(6) || "";
};

const formatPropertyKey = (key: string) => {
  return key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
</script>
