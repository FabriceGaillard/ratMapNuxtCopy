/**
 * Extrait le nom de la ville d'un résultat de géocodage Google
 * @param result - Le résultat du géocodage
 * @returns Le nom de la ville ou l'adresse complète en fallback
 */
export function extractCityFromGeocodeResult(
  result: google.maps.GeocoderResult
): string {
  // Rechercher un composant de type "locality" (ville)
  const cityComponent = result.address_components.find((component) =>
    component.types.includes("locality")
  );

  if (cityComponent) {
    return cityComponent.long_name;
  }

  // Fallback: chercher "administrative_area_level_2"
  const adminAreaComponent = result.address_components.find((component) =>
    component.types.includes("administrative_area_level_2")
  );

  if (adminAreaComponent) {
    return adminAreaComponent.long_name;
  }

  // Dernier fallback: adresse complète
  return result.formatted_address;
}
