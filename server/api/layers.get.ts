import type { H3Event } from "h3";

const LAYERS = [
  { label: "Tops Assos", id: "221549", color: "green", icon: "assosiations" },
  {
    label: "Mauvaises Assos",
    id: "221570",
    color: "red",
    icon: "assosiations",
  },
  { label: "Autres Assos", id: "221571", color: "blue", icon: "assosiations" },
  { label: "SPAS", id: "221574", color: "yellow", icon: "assosiations" },
  { label: "Élevages", id: "228024", color: "purple", icon: "breeding" },
  {
    label: "Élevages Potentiels",
    id: "230084",
    color: "orange",
    icon: "breeding",
  },
];

export default defineEventHandler(async (event: H3Event) => {
  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  return LAYERS;
});
