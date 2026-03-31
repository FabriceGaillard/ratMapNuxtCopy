import { computed } from "vue";
import FramacarteRepository from "~/repositories/FramacarteRepository";

export const layers = reactive([
  {
    label: "Tops Assos",
    description: "Description",
    id: "221549",
    color: "green",
    icon: "/icons/family_home.svg",
    checked: true,
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
  {
    label: "Mauvaises Assos",
    description: "Description",
    id: "221570",
    color: "red",
    icon: "/icons/family_home.svg",
    checked: false,
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
  {
    label: "Autres Assos",
    description: "Description",
    id: "221571",
    color: "blue",
    icon: "/icons/family_home.svg",
    checked: false,
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
  {
    label: "SPAS",
    description: "Description",
    id: "221574",
    color: "yellow",
    icon: "/icons/rat.svg",
    checked: false,
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },

  {
    label: "Élevages",
    description: "Description",
    id: "228024",
    color: "purple",
    icon: "/icons/rat.svg",
    checked: false,
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
  {
    label: "Élevages Potentiels",
    description: "Description",
    id: "230084",
    color: "yellow",
    icon: "/icons/rat.svg",
    checked: false,
    markers: [] as Awaited<ReturnType<FramacarteRepository["getMarkers"]>>,
  },
]);

export const checkedLayers = computed(() =>
  layers.filter((layer) => layer.checked),
);

export const markers = computed(() =>
  checkedLayers.value.flatMap((layer) =>
    layer.markers.map((m) => ({ ...m, color: layer.color, icon: layer.icon })),
  ),
);

async function setMarker(layer: (typeof layers)[number]) {
  if (layer.markers.length) return;
  layer.markers = await new FramacarteRepository().getMarkers(layer.id);
}

export async function setMarkers() {
  await Promise.all(checkedLayers.value.map(setMarker));
}
