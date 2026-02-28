export class FramacarteRepository {
  private workerUrl = "https://sweet-base-5622.johanna-girodolle.workers.dev/";
  private baseUrl = "https://framacarte.org/fr";

  /**
   * Fetch map data by ID
   */
  async getMapData(mapId: string) {
    try {
      const targetUrl = `${this.baseUrl}/map/`;
      const worker = new URL(this.workerUrl);
      worker.searchParams.set(
        "url",
        new URL(`0_${mapId}`, targetUrl).toString()
      );

      const response = await fetch(worker.toString());
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const mapSettings = doc.querySelector("#map-settings");

      if (!mapSettings) {
        throw new Error("Could not find map settings");
      }

      return JSON.parse((mapSettings as any).dataset.settings);
    } catch (error) {
      console.error("Error fetching map data:", error);
      throw error;
    }
  }

  /**
   * Fetch datalayer features by map ID and layer ID
   */
  async getDataLayer(mapId: string, layerId: string) {
    try {
      const targetUrl = `${this.baseUrl}/datalayer/${mapId}/${layerId}`;
      const worker = new URL(this.workerUrl);
      worker.searchParams.set("url", targetUrl);

      const response = await fetch(worker.toString());
      return response.json();
    } catch (error) {
      console.error("Error fetching datalayer:", error);
      throw error;
    }
  }

  /**
   * Fetch all POIs for a map
   */
  async getAllPois(mapId: string) {
    try {
      const mapData = await this.getMapData(mapId);
      const datalayers = mapData.properties.datalayers;

      console.log("Datalayers:", datalayers);

      const pois = await Promise.all(
        datalayers.map(async (layer: any) => {
          const data = await this.getDataLayer(mapId, layer.id);
          console.log(`Layer ${layer.name} data:`, data);
          return {
            layerId: layer.id,
            layerName: layer.name,
            features: data.features || []
          };
        })
      );

      return this.parsePointFeatures(pois);
    } catch (error) {
      console.error("Error fetching all POIs:", error);
      throw error;
    }
  }

  /**
   * Parse point features from datalayers
   */
  private parsePointFeatures(
    datalayers: Array<{ layerId: string; layerName: string; features: any[] }>
  ) {
    return datalayers.flatMap(layer =>
      layer.features
        .filter((poi: any) => poi.geometry && poi.geometry.type === "Point")
        .map((poi: any) => ({
          id: poi.id,
          name: poi.properties.name || "No name",
          description: poi.properties.description || "",
          position: {
            lat: poi.geometry.coordinates[1],
            lng: poi.geometry.coordinates[0]
          },
          layer: layer.layerName,
          layerId: layer.layerId,
          properties: poi.properties
        }))
    );
  }

  /**
   * Search POIs by name
   */
  searchPois(pois: any[], query: string) {
    if (!query) return pois;
    const lowerQuery = query.toLowerCase();
    return pois.filter(
      poi =>
        poi.name.toLowerCase().includes(lowerQuery)
        || poi.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter POIs by layer
   */
  filterByLayer(pois: any[], layerId: string) {
    return pois.filter(poi => poi.layerId === layerId);
  }
}

// Export singleton instance
export const framacarteRepository = new FramacarteRepository();
