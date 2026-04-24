import fetch from "~/helpers/fetch";

export default class FramacarteRepository {
  private workerUrl = useRuntimeConfig().public.framacarteWorkerUrl;
  private baseUrl = "https://framacarte.org/fr";

  /**
   * Fetch map data by ID
   */
  async getMapData(mapId: string) {
    const html = await fetch(
      `${this.workerUrl}?url=${this.baseUrl}/map/0_${mapId}`,
    ).then((res) => res.text());

    const mapSettings = new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("#map-settings");

    if (!mapSettings) {
      throw new Error("Could not find map settings");
    }

    return JSON.parse((mapSettings as any).dataset.settings);
  }

  /**
   * Fetch datalayer features by map ID and layer ID
   */
  async getDataLayer(mapId: string, layerId: string) {
    return fetch(
      `${this.workerUrl}?url=${this.baseUrl}/datalayer/${mapId}/${layerId}`,
    ).then((res) => res.json());
  }

  /**
   * Fetch all markers for a map
   */
  async getMarkers(mapId: string) {
    const mapData = await this.getMapData(mapId);

    const marks = await Promise.all(
      mapData.properties.datalayers.map(async (layer: any) =>
        this.getDataLayer(mapId, layer.id),
      ),
    ).then((layers) => layers.flatMap((layer) => layer.features));

    return marks;
  }
}
