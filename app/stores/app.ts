export default reactive({
  mode: "idle", // 'explore', 'itinerary', 'idle'

  place: null as google.maps.places.PlaceResult | null,

  itinerary: {
    limits: {
      length: Infinity,
      hours: 3,
    },
  },
});
