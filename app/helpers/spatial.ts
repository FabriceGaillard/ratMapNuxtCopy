export function getDistance(a: LatLng, b: LatLng) {
  const R = 6371; // km

  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const aVal =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));

  return R * c; // distance en km
}

export function getNearestPoints(
  origin: LatLng,
  points: LatLng[],
  maxTimeHours: number,
  limit = 5,
) {
  const speedKmH = 50;

  const maxDistance = maxTimeHours != null ? speedKmH * maxTimeHours : Infinity;

  return points
    .map((point) => ({
      ...point,
      distance: getDistance(origin, point),
    }))
    .filter((point) => point.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
