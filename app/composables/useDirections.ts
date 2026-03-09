import { ref } from "vue";
import { useMapUtils } from "./useMapUtils";

export const useDirections = () => {
  const { calculateDistance } = useMapUtils();
  let mapPolylines: any[] = [];
  let mapMarkers: any[] = [];
  let infoWindows: any[] = [];
  const directions = ref<any[]>([]);

  const clearDirections = () => {
    mapPolylines.forEach((polyline: any) => {
      polyline.setMap(null);
    });
    mapPolylines = [];
    mapMarkers.forEach((marker: any) => {
      marker.map = null;
    });
    mapMarkers = [];
    infoWindows.forEach((infoWindow: any) => {
      infoWindow.close();
    });
    infoWindows = [];
    directions.value = [];
  };

  const initDirections = async (
    map: any,
    pois: any[] = [],
    origin: string = "Montpellier, France",
    maxHours: number = 5,
  ): Promise<any[]> => {
    clearDirections();

    if (pois.length === 0) {
      console.warn("No POIs available");
      return [];
    }

    try {
      // Use the legacy DirectionsService but with manual polyline/marker creation
      const directionsService = new (
        window as any
      ).google.maps.DirectionsService();

      // Geocode the origin to get its coordinates for distance calculation
      const geocoder = new (window as any).google.maps.Geocoder();
      const geocodeResults = await new Promise<any[]>((resolve, reject) => {
        geocoder.geocode(
          { address: origin },
          (results: any, status: string) => {
            if (status === "OK") {
              resolve(results);
            } else {
              reject(new Error(`Geocoding error: ${status}`));
            }
          },
        );
      });

      const originLat = geocodeResults[0].geometry.location.lat();
      const originLng = geocodeResults[0].geometry.location.lng();

      // Find the 5 closest POIs from the origin
      const closestPois = pois
        .map((poi: any) => ({
          ...poi,
          distance: calculateDistance(
            originLat,
            originLng,
            poi.position.lat,
            poi.position.lng,
          ),
        }))
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 5);

      const results: any[] = [];

      // Show directions to each of the 5 closest POIs
      for (const poi of closestPois) {
        try {
          console.log("POI position:", poi.position); // Debug log

          const request = {
            origin: new (window as any).google.maps.LatLng(
              originLat,
              originLng,
            ),
            destination: new (window as any).google.maps.LatLng(
              poi.position.lat,
              poi.position.lng,
            ),
            travelMode: (window as any).google.maps.TravelMode.DRIVING,
          };

          const response = await new Promise<any>((resolve, reject) => {
            directionsService.route(request, (result: any, status: string) => {
              if (status === "OK") {
                resolve(result);
              } else {
                reject(new Error(`Directions error: ${status}`));
              }
            });
          });

          console.log("Directions response:", response); // Debug log

          if (!response.routes || response.routes.length === 0) {
            console.warn(`No route found for ${poi.name}`);
            continue;
          }

          const route = response.routes[0];
          const leg = route.legs?.[0];

          if (!leg) {
            console.warn(`No leg data for ${poi.name}`);
            continue;
          }

          console.log("Leg data:", leg); // Debug log

          // Extract duration from leg
          const durationText = leg.duration?.text || "";
          const durationValue = leg.duration?.value || 0; // in seconds
          const durationHours = durationValue / 3600;

          console.log("Duration data:", {
            durationText,
            durationValue,
            durationHours,
          }); // Debug log

          // Skip if duration exceeds max hours
          if (durationHours > maxHours) {
            continue;
          }

          // Store direction data
          const directionData = {
            poi,
            durationText,
            durationValue,
            durationHours,
            result: response,
          };
          results.push(directionData);

          // Create polylines manually from the detailed route path
          try {
            if (leg.steps && leg.steps.length > 0) {
              // Combine all step paths for detailed route following
              const detailedPath: any[] = [];
              leg.steps.forEach((step: any) => {
                if (step.path && step.path.length > 0) {
                  detailedPath.push(...step.path);
                }
              });

              if (detailedPath.length > 0) {
                const polyline = new (window as any).google.maps.Polyline({
                  path: detailedPath,
                  strokeColor: "#45B7D1",
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                });
                polyline.setMap(map);
                mapPolylines.push(polyline);
              }
            }
          } catch (error) {
            console.warn(`Error creating polylines for ${poi.name}:`, error);
          }

          // Create markers manually
          try {
            // Create start marker
            const startMarker = new (
              window as any
            ).google.maps.marker.AdvancedMarkerElement({
              map,
              position: leg.start_location,
              title: "Départ",
            });
            mapMarkers.push(startMarker);

            // Create end marker
            const endMarker = new (
              window as any
            ).google.maps.marker.AdvancedMarkerElement({
              map,
              position: leg.end_location,
              title: poi.name,
            });
            mapMarkers.push(endMarker);
          } catch (error) {
            console.warn(`Error creating markers for ${poi.name}:`, error);
          }

          // Display info window with POI name
          if (route.overview_path && route.overview_path.length > 0) {
            const path = route.overview_path;
            const midIndex = Math.floor(path.length / 2);
            const midPoint = path[midIndex];

            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `<div>${poi.name}<br/>${durationText}</div>`,
              position: midPoint,
            });

            infoWindow.open(map);
            infoWindows.push(infoWindow);
          }
        } catch (error) {
          console.error(`Error computing route for ${poi.name}:`, error);
        }
      }

      directions.value = results;
      return results;
    } catch (error) {
      console.error("Error initializing directions:", error);
      return [];
    }
  };

  return {
    initDirections,
    clearDirections,
    directions,
  };
};
