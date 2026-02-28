export const useSearch = () => {
  const { drawBoundary } = useBoundary();

  const initSearch = (map: any) => {
    const searchBox = new (window as any).google.maps.places.SearchBox(
      document.getElementById("searchBox")
    );

    const fitSearchResults = async (searchBox: any) => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      const bounds = new (window as any).google.maps.LatLngBounds();

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      map.fitBounds(bounds);

      // Draw boundary for the place
      await drawBoundary(map, place);
    };

    searchBox.addListener("places_changed", () => fitSearchResults(searchBox));

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => fitSearchResults(searchBox));
    }

    return searchBox;
  };

  return {
    initSearch
  };
};
