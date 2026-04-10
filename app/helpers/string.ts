export function sanitizeHtml(text: string): string {
  if (!text) return "";

  // Créer un élément et utiliser textContent pour échapper automatiquement
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function parseLinksInText(text: string): string {
  if (!text) return "";

  // Sanitizer d'abord (échappe tous les caractères spéciaux)
  const sanitized = sanitizeHtml(text);

  // Ensuite ajouter les liens
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  return sanitized.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>',
  );
}
