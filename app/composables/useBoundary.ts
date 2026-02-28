export const useBoundary = () => {
  let currentBoundary: any = null

  const drawBoundary = async (map: any, place: any) => {
    // Remove previous boundary
    if (currentBoundary) {
      currentBoundary.setMap(null)
    }

    try {
      const searchQuery = place.formatted_address || place.name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&polygon_geojson=1`
      )
      const results = await response.json()

      if (results.length > 0 && results[0].geojson && results[0].geojson.coordinates) {
        const geojson = results[0].geojson
        let polygonCoords = []

        // Handle different geometry types
        if (geojson.type === 'Polygon') {
          polygonCoords = geojson.coordinates[0].map((coord: any) => ({
            lat: coord[1],
            lng: coord[0]
          }))
        } else if (geojson.type === 'MultiPolygon') {
          polygonCoords = geojson.coordinates[0][0].map((coord: any) => ({
            lat: coord[1],
            lng: coord[0]
          }))
        }

        if (polygonCoords.length > 0) {
          currentBoundary = new (window as any).google.maps.Polygon({
            paths: polygonCoords,
            map,
            strokeColor: '#FF9800',
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: '#FF9800',
            fillOpacity: 0.15
          })
          return true
        }
      }
    } catch (err) {
      console.warn('Could not fetch boundaries:', err)
    }

    return false
  }

  return {
    drawBoundary
  }
}
