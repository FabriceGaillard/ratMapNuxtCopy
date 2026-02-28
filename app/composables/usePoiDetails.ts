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

      // street view url for exact location
      const apiKey = useRuntimeConfig().public.googleMapsKey;
      const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${lat},${lng}&key=${apiKey}`;

      // also attempt to get place photos via PlacesService if place_id exists
      let photos: string[] = [];
      if (geocodeResult.place_id) {
        const service = new (window as any).google.maps.places.PlacesService(
          document.createElement("div"),
        );
        const placeDetail: any = await new Promise((resolve) => {
          service.getDetails(
            { placeId: geocodeResult.place_id, fields: ["photos"] },
            (place: any, status: string) => {
              if (status === "OK" && place && place.photos) {
                resolve(place);
              } else {
                resolve(null);
              }
            },
          );
        });
        if (placeDetail && placeDetail.photos) {
          photos = placeDetail.photos.map((p: any) =>
            p.getUrl({ maxWidth: 800 }),
          );
        }
      }

      return {
        address: geocodeResult.formatted_address,
        addressComponents: geocodeResult.address_components,
        placeId: geocodeResult.place_id,
        types: geocodeResult.types,
        geometry: geocodeResult.geometry,
        photos,
        streetViewUrl,
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
        types: (details as any)?.types || [],
        photos: (details as any)?.photos || [],
        streetViewUrl: (details as any)?.streetViewUrl || "",
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
