import { framacarteRepository } from "~/repositories/FramacarteRepository";

export const usePois = () => {
  const getPois = async (mapId: string) => {
    try {
      const pois = await framacarteRepository.getAllPois(mapId);
      return pois.map(poi => ({
        id: poi.id,
        name: poi.name,
        position: {
          lat: poi.position.lat,
          lng: poi.position.lng
        },
        description: poi.description,
        layer: poi.layer,
        properties: poi.properties
      }));
    } catch (error) {
      console.error("Error fetching POIs:", error);
      return [];
    }
  };

  return {
    getPois
  };
};
