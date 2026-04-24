import decodePolyline from "decode-google-map-polyline";

export default class RouteRepository {
  async computeRoute(origin: LatLng, destination: LatLng) {
    const data = await $fetch<{
      encodedPolyline: string;
      seconds: number;
      meters: number;
    }>("/api/route", {
      method: "POST",
      body: { origin, destination },
    });

    const path = decodePolyline(data.encodedPolyline) as LatLng[];

    return {
      path,
      seconds: data.seconds,
      meters: data.meters,
      origin,
      destination,
    };
  }
}
