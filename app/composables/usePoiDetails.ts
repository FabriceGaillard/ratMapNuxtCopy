export const usePoiDetails = () => {
  const getDetailedInfo = async (lat: number, lng: number) => {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const location = { lat, lng };

      const geocodeResult: any = await new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      return {
        address: geocodeResult.formatted_address
          .split(",")
          .splice(1, 1)
          .join(","),
        addressComponents: geocodeResult.address_components,
        placeId: geocodeResult.place_id,
        types: geocodeResult.types,
        geometry: geocodeResult.geometry,
      };
    } catch (error) {
      console.error("Error getting detailed info:", error);
      return null;
    }
  };

  const enrichPoiData = async (poi: any) => {
    try {
      const details = await getDetailedInfo(poi.position.lat, poi.position.lng);

      return {
        ...poi,
        address: (details as any)?.address || "Adresse non trouvée",
        addressComponents: (details as any)?.addressComponents || [],
        placeId: (details as any)?.placeId || "",
      };
    } catch (error) {
      console.error("Error enriching POI:", error);
      return poi;
    }
  };

  return {
    getDetailedInfo,
    enrichPoiData,
  };
};
