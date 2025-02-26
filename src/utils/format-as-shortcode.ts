const DIACRITICS = /\p{Diacritic}/gu;
const ABBREVIATIONS = /\b([a-z])\./g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const EDGE_UNDERSCORES = /^_+|_+$/g;

export function formatAsShortcode(name: string): string {
  const shortcode = name
    // Normalize accents
    .normalize("NFD")
    // Remove remaining diacritics
    .replace(DIACRITICS, "")
    .toLowerCase()
    // Remove dots from abbreviations
    .replace(ABBREVIATIONS, "$1")
    // Replace remaining non-alphanumeric characters with underscores
    .replace(NON_ALPHANUMERIC, "_")
    // Trim leading/trailing underscores
    .replace(EDGE_UNDERSCORES, "");

  return `:${shortcode}:`;
}
