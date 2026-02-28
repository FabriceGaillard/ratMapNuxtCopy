export const useDirections = () => {
  const { calculateDistance } = useMapUtils();
  let directionsRenderers: any[] = [];

  const clearDirections = () => {
    directionsRenderers.forEach((renderer: any) => {
      renderer.setMap(null);
    });
    directionsRenderers = [];
  };

  const initDirections = (
    map: any,
    pois: any[] = [],
    origin: string = "Montpellier, France",
    maxHours: number = 5
  ) => {
    clearDirections();
    const directionsService = new (
      window as any
    ).google.maps.DirectionsService();

    if (pois.length === 0) {
      console.warn("No POIs available");
      return;
    }

    // Geocode the origin to get its coordinates for distance calculation
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: origin }, (results: any, status: string) => {
      if (status !== "OK") {
        console.error("Geocoding error:", status);
        return;
      }

      const originLat = results[0].geometry.location.lat();
      const originLng = results[0].geometry.location.lng();

      // Find the 5 closest POIs from the origin
      const closestPois = pois
        .map((poi: any) => ({
          ...poi,
          distance: calculateDistance(
            originLat,
            originLng,
            poi.position.lat,
            poi.position.lng
          ),
        }))
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 5);

      // Show directions to each of the 5 closest POIs
      closestPois.forEach((poi: any, index: number) => {
        directionsService.route(
          {
            origin,
            destination: poi.position,
            travelMode: (window as any).google.maps.TravelMode.DRIVING,
          },
          (result: any, status: string) => {
            if (status !== "OK") {
              console.error("Directions error:", status);
              return;
            }

            // Extract duration in hours
            const leg = result.routes[0].legs[0];
            const durationText = leg.duration.text;
            const durationValue = leg.duration.value; // in seconds
            const durationHours = durationValue / 3600;

            // Skip if duration exceeds max hours
            if (durationHours > maxHours) {
              return;
            }

            const renderer = new (window as any).google.maps.DirectionsRenderer(
              {
                map,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#45B7D1",
                },
              }
            );
            renderer.setDirections(result);
            directionsRenderers.push(renderer);

            // Display info window with POI name
            const path = result.routes[0].overview_path;
            const midIndex = Math.floor(path.length / 2);
            const midPoint = path[midIndex];

            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `<div>${poi.name}<br/>${durationText}</div>`,
              position: midPoint,
            });

            infoWindow.open(map);
          }
        );
      });
    });
  };

  return {
    initDirections,
    clearDirections,
  };
};
