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

  /**
   * Search boundary polygon by place name (e.g. "Gironde, France").
   * More reliable than reverse geocoding for named administrative areas.
   */
  async getBoundaryByQuery(query: string): Promise<NominatimGeoJSON | null> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&polygon_geojson=1&format=json&limit=3`;

    try {
      const results: any[] = await globalThis
        .fetch(url, {
          headers: {
            "Accept-Language": "fr",
          },
        })
        .then((res) => res.json());

      if (!Array.isArray(results)) return null;

      for (const result of results) {
        const { geojson } = result;
        if (!geojson) continue;
        if (geojson.type === "Polygon" || geojson.type === "MultiPolygon") {
          return geojson as NominatimGeoJSON;
        }
      }

      return null;
    } catch {
      return null;
    }
  }
}
