import { computed } from "vue";
import FramacarteRepository from "~/repositories/FramacarteRepository";

export const layers = reactive([
  {
    label: "Tops Assos",
    description: "Description",
    id: "221549",
    color: "green",
    checked: true,
    // icon: "material-symbols:location-on",
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
  {
    label: "Mauvaises Assos",
    description: "Description",
    id: "221570",
    color: "red",
    checked: false,
    // icon: "material-symbols:location-on",
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
  {
    label: "Autres Assos",
    description: "Description",
    id: "221571",
    color: "blue",
    checked: false,
    // icon: "material-symbols:location-on",
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
  {
    label: "SPAS",
    description: "Description",
    id: "221574",
    color: "yellow",
    checked: false,
    // icon: "material-symbols:location-on",
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
]);

export const checkedLayers = computed(() =>
  layers.filter((layer) => layer.checked),
);

export const markers = computed(() =>
  checkedLayers.value.flatMap((layer) => layer.markers),
);

async function setMarker(layer: (typeof layers)[number]) {
  if (layer.markers.length) return;
  layer.markers = await new FramacarteRepository().getMarkers(layer.id);
}

export async function setMarkers() {
  await Promise.all(checkedLayers.value.map(setMarker));
}
