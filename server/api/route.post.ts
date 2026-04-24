import type { H3Event } from "h3";

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteRequestBody {
  origin: LatLng;
  destination: LatLng;
}

export default defineEventHandler(async (event: H3Event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody<RouteRequestBody>(event);

  if (
    typeof body?.origin?.lat !== "number" ||
    typeof body?.origin?.lng !== "number" ||
    typeof body?.destination?.lat !== "number" ||
    typeof body?.destination?.lng !== "number"
  ) {
    throw createError({ statusCode: 400, message: "Invalid coordinates" });
  }

  // TODO prod : remplacer par une clé dédiée restreinte à "Routes API" uniquement (NUXT_GOOGLE_ROUTES_API_KEY)
  const {
    public: { googleMapsApiKey: googleRoutesApiKey },
  } = useRuntimeConfig(event);

  const res = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googleRoutesApiKey,
        "X-Goog-FieldMask":
          "routes.polyline,routes.duration,routes.distanceMeters",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: { latitude: body.origin.lat, longitude: body.origin.lng },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: body.destination.lat,
              longitude: body.destination.lng,
            },
          },
        },
        travelMode: "DRIVE",
        polylineEncoding: "ENCODED_POLYLINE",
        polylineQuality: "OVERVIEW",
      }),
    },
  );

  const data = await res.json();

  if (!data.routes || data.routes.length === 0) {
    throw createError({ statusCode: 404, message: "Aucune route trouvée" });
  }

  return {
    encodedPolyline: data.routes[0].polyline.encodedPolyline,
    seconds: parseInt(data.routes[0].duration, 10),
    meters: data.routes[0].distanceMeters as number,
  };
});
