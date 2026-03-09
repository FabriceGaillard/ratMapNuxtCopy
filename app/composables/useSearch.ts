import { ref } from "vue";
import { useBoundary } from "./useBoundary";

export const useSearch = () => {
  const { drawBoundary } = useBoundary();
  const selectedPlace = ref<any>(null);

  const initSearch = async (map: any) => {
    const { PlaceAutocompleteElement } = (await (
      window as any
    ).google.maps.importLibrary("places")) as any;

    // Create the PlaceAutocompleteElement
    const placeAutocomplete = new PlaceAutocompleteElement();
    placeAutocomplete.locationRestriction = map.getBounds();

    // Insert it into the container
    const searchContainer = document.getElementById("searchBox");
    if (searchContainer) {
      searchContainer.appendChild(placeAutocomplete);
    }

    const fitSearchResults = async (place: any) => {
      if (!place || !place.location) return;

      // Use a more gentle zoom approach
      map.panTo(place.location);
      map.setZoom(12); // Set a reasonable zoom level instead of fitting bounds

      // Draw boundary for the place
      await drawBoundary(map, place);
    };

    placeAutocomplete.addEventListener("gmp-select", async (event: any) => {
      const place = event.placePrediction?.toPlace?.();
      if (place) {
        await place.fetchFields({
          fields: ["location", "formattedAddress", "displayName"],
        });
        selectedPlace.value = place;
        await fitSearchResults(place);
      }
    });

    // Update locationRestriction when map bounds change
    map.addListener("bounds_changed", () => {
      placeAutocomplete.locationRestriction = map.getBounds();
    });

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
      searchBtn.addEventListener("click", async () => {
        const place = placeAutocomplete.value;
        if (place) {
          await fitSearchResults(place);
        }
      });
    }

    return placeAutocomplete;
  };

  return {
    initSearch,
    selectedPlace,
  };
};
