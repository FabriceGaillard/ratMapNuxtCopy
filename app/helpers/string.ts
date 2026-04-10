export function parseLinksInText(text: string): string {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    '<a href="$1" target="_blank" class="text-blue-500 hover:underline">$1</a>',
  );
}
