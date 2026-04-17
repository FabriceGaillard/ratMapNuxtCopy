import decodePolyline from "decode-google-map-polyline";

export default class RouteRepository {
  apiKey: string;

  constructor() {
    const config = useRuntimeConfig();
    this.apiKey = config.public.googleMapsApiKey;
  }

  async computeRoute(origin: LatLng, destination: LatLng) {
    // ✅ Crée le payload correct pour computeRoutes
    const res = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": this.apiKey,
          "X-Goog-FieldMask":
            "routes.polyline,routes.duration,routes.distanceMeters",
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: { latitude: origin.lat, longitude: origin.lng },
            },
          },
          destination: {
            location: {
              latLng: { latitude: destination.lat, longitude: destination.lng },
            },
          },
          travelMode: "DRIVE",
          polylineEncoding: "ENCODED_POLYLINE",
          polylineQuality: "OVERVIEW",
        }),
      },
    );

    const data = await res.json();

    if (!data.routes || data.routes.length === 0)
      throw new Error("Aucune route trouvée");

    const encoded = data.routes[0].polyline.encodedPolyline;
    const path = decodePolyline(encoded) as LatLng[];

    return {
      path,
      seconds: parseInt(data.routes[0].duration, 10),
      meters: data.routes[0].distanceMeters as number,
      origin,
      destination,
    };
  }
}
