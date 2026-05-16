export function formatPrice(value) {
  return `${Math.round(value).toLocaleString("sv-SE")} SEK`;
}
