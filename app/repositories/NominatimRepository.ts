export interface NominatimGeoJSON {
  type: string;
  coordinates: any;
}

export default class NominatimRepository {
  private baseUrl = "https://nominatim.openstreetmap.org";

  /**
   * Fetch the boundary polygon of the administrative area containing a lat/lng.
   * Uses Nominatim reverse geocoding — free, no API key required.
   * Returns a Polygon or MultiPolygon, or null if not found.
   */
  async getBoundaryByLatLng(
    lat: number,
    lng: number,
    nominatimZoom = 10,
  ): Promise<NominatimGeoJSON | null> {
    const url = `${this.baseUrl}/reverse?lat=${lat}&lon=${lng}&polygon_geojson=1&format=json&zoom=${nominatimZoom}`;

    try {
      const result: any = await globalThis
        .fetch(url, {
          headers: {
            "Accept-Language": "fr",
          },
        })
        .then((res) => res.json());

      if (!result?.geojson) return null;
      const { type } = result.geojson;
      if (type !== "Polygon" && type !== "MultiPolygon") return null;

      return result.geojson as NominatimGeoJSON;
    } catch {
      return null;
    }
  }
}
