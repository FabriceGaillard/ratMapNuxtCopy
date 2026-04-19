export default reactive({
  mode: "idle", // 'explore', 'itinerary', 'idle'

  place: null as google.maps.places.PlaceResult | null,

  itinerary: {
    limits: {
      length: 20,
      hours: 1.5,
    },
  },
});
