export const useBoundary = () => {
  let currentBoundaries: any[] = [];

  const drawBoundary = async (map: any, place: any) => {
    // Remove previous boundaries
    currentBoundaries.forEach((boundary) => boundary.setMap(null));
    currentBoundaries = [];

    try {
      const searchQuery = place.formattedAddress || place.displayName;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&polygon_geojson=1`,
      );
      const results = await response.json();

      // Process only the first result but display all its polygons
      const resultsToProcess = results.length > 0 ? [results[0]] : [];
      resultsToProcess.forEach((result) => {
        if (result.geojson && result.geojson.coordinates) {
          const geojson = result.geojson;
          const polygons = [];

          // Handle different geometry types
          if (geojson.type === "Polygon") {
            polygons.push(geojson.coordinates[0]);
          } else if (geojson.type === "MultiPolygon") {
            // Add all polygons from the MultiPolygon
            geojson.coordinates.forEach((polygon: any) => {
              polygons.push(polygon[0]);
            });
          }

          // Create a polygon for each geometry
          polygons.forEach((coords: any) => {
            const polygonCoords = coords.map((coord: any) => ({
              lat: coord[1],
              lng: coord[0],
            }));

            if (polygonCoords.length > 0) {
              const boundary = new (window as any).google.maps.Polygon({
                paths: polygonCoords,
                map,
                strokeColor: "#006aff",
                strokeOpacity: 0.9,
                strokeWeight: 2,
                fillColor: "#006aff",
                fillOpacity: 0.15,
              });
              currentBoundaries.push(boundary);
            }
          });
        }
      });

      return currentBoundaries.length > 0;
    } catch (err) {
      console.warn("Could not fetch boundaries:", err);
    }

    return false;
  };

  return {
    drawBoundary,
  };
};
