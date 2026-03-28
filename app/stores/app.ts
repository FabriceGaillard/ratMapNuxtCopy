export default reactive({
  mode: "idle", // 'explore', 'itinerary', 'idle'

  place: null as google.maps.places.PlaceResult | null,

  itinerary: {
    limits: {
      length: 5,
      hours: 3,
    },
  },
});
