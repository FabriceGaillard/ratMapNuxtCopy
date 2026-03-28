const formatter = new Intl.DurationFormat("fr", {
  style: "short",
});
export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const duration: any = {};

  if (h) duration.hours = h;
  if (m) duration.minutes = m;
  if (!h && !m) duration.seconds = s; // 👈 uniquement si pas d'autres unités

  return formatter.format(duration);
}
