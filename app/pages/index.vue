<script setup lang="ts">
import ListsDrawer from "~/components/drawers/listsDrawer.vue";
import Map from "~/components/map.vue";
import MapMarkers from "~/components/mapMarkers.vue";
import MapRoutes from "~/components/mapRoutes.vue";
import { setMarkers, checkedLayers, markers } from "~/stores/framacarte";
import GoogleRouteRepository from "~/repositories/GoogleRouteRepository";
import SearchModal from "~/components/modals/searchModal.vue";
import PlaceDrawer from "~/components/drawers/placeDrawer.vue";
import app from "~/stores/app";
import ItineraryDrawer from "~/components/drawers/itineraryDrawer.vue";
import ItineraryButton from "~/components/buttons/itineraryButton.vue";
import { ObjectHelper } from "~/utils/ObjectHelper";
import { fetchIcons } from "~/helpers/fetch";
import { layers } from "~/stores/framacarte";
import AssosationsButton from "~/components/buttons/assosationsButton.vue";
import BreedingButton from "~/components/buttons/breedingButton.vue";

definePageMeta({
  middleware: ["mobile-check"], // exact match en kebab-case
});

const { assosiations, breeding } = await fetchIcons();

const routes = ref(
  [] as Awaited<ReturnType<GoogleRouteRepository["computeRoute"]>>[],
);

const itinerary = app.itinerary;

const isOpened = ref(false);

async function setRoutes() {
  if (!app.place) return;

  const results = await Promise.all(
    checkedLayers.value
      .map((layer) =>
        layer.markers
          .filter(
            (m) =>
              m.geometry.coordinates[1] !== app.place!.location.lat ||
              m.geometry.coordinates[0] !== app.place!.location.lng,
          )
          .map(async (m) => {
            const route = await new GoogleRouteRepository().computeRoute(
              toRaw(app.place!.location),
              {
                lat: m.geometry.coordinates[1],
                lng: m.geometry.coordinates[0],
              },
            );

            return {
              ...route,
              marker: m,
              layer: ObjectHelper.pick(layer, ["label", "color"]),
            };
          }),
      )
      .flat(),
  );

  routes.value = results
    .filter((r) => r.seconds / 3600 <= itinerary.limits.hours)
    .sort((a, b) => a.seconds - b.seconds)
    .slice(0, itinerary.limits.length);
}

async function setMarkersAndRoutes() {
  await setMarkers();
  await setRoutes();
}

watch(() => checkedLayers.value.map((l) => l.id), setMarkersAndRoutes, {
  deep: true,
  immediate: true,
});
</script>

<template>
  <div>
    <ClientOnly>
      <Map
        v-slot="{ map }"
        class="h-screen"
        @select="
          {
            app.place = $event;
            if (app.mode === 'idle') {
              app.mode = 'explore';
            }
          }
        "
      >
        <div class="p-4 absolute top-0 left-0 z-10 w-full">
          <SearchModal
            v-if="['idle', 'explore'].includes(app.mode)"
            :formatted-address="app.place?.formattedAddress ?? ''"
            placeholder="Rechercher"
            @select="
              {
                app.place = $event;
                app.mode = 'explore';
                map.fitBounds($event.viewport);
              }
            "
          >
            <UButton
              icon="material-symbols:search-rounded"
              :label="app.place?.formattedAddress ?? 'Rechercher'"
              variant="outline"
              color="neutral"
              class="w-full text-muted rounded-full p-2.5 border-0 ring-0 px-2"
              size="xl"
              :ui="{
                label: app.place?.formattedAddress
                  ? 'text-highlighted'
                  : 'text-dimmed',
              }"
            >
              <template #trailing>
                <UButton
                  v-if="app.place"
                  ml-auto
                  variant="link"
                  class="p-0 px-1 ml-auto"
                  color="neutral"
                  icon="material-symbols:close-rounded"
                  @click.stop="
                    app.place = null;
                    app.mode = 'idle';
                  "
                />
              </template>
            </UButton>
          </SearchModal>
          <ItineraryController
            v-if="app.mode === 'itinerary'"
            class="bg-white dark:bg-gray-900 rounded p-2.5 mt-2 w-full max-w-100 m-auto"
            @set-routes="setRoutes()"
            @select="
              {
                app.place = $event;
                app.mode = 'itinerary';
                setRoutes();
              }
            "
          />
        </div>

        <MapRoutes :map="map" :routes="routes" />

        <MapMarkers
          :map="map"
          :markers="markers"
          @select="
            {
              app.place = $event;
              if (app.mode === 'idle') {
                app.mode = 'explore';
              }
            }
          "
        />
      </Map>

      <div class="p-4 absolute bottom-5 left-0 z-10">
        <UColorModeButton
          size="sm"
          variant="soft"
          class="w-10 h-10 rounded-xl p-2.5"
          :ui="{
            leadingIcon: 'w-full h-full',
          }"
        />
      </div>

      <div class="p-4 absolute bottom-5 right-0 z-10 flex">
        <div class="ml-auto flex-col items-end flex gap-3">
          <SearchModal
            :formatted-address="app.place?.formattedAddress ?? ''"
            placeholder="Choisir un lieu de départ"
            @select="
              {
                app.place = $event;
                app.mode = 'itinerary';
                setRoutes();
              }
            "
          >
            <ItineraryButton />
          </SearchModal>
          <div class="space-x-2">
            <AssosationsButton :icon="assosiations" />
            <BreedingButton :icon="breeding" />
            <ListsDrawer />
          </div>
        </div>
      </div>

      <Logo class="absolute bottom-2 left-4.5" />

      <PlaceDrawer
        :open="app.mode === 'explore' || isOpened"
        :place="app.place"
        @select="
          {
            app.mode = 'itinerary';
            setRoutes();
          }
        "
        @close-drawer="app.mode = 'idle'"
        @animation-end="
          {
            if (app.mode === 'idle') {
              app.place = null;
            }
          }
        "
      />
      <ItineraryDrawer
        :open="app.mode === 'itinerary' && !isOpened"
        :routes="routes"
        @close="
          app.place = null;
          app.mode = 'idle';
          routes = [];
        "
      />
    </ClientOnly>
  </div>
</template>
