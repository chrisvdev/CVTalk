/**
 * Módulo para generar colores RGB oscurecidos a partir de valores hexadecimales
 * @module lib/get_curated_color
 */

/**
 * Genera un color RGB oscurecido basado en un color hexadecimal proporcionado
 * o un color aleatorio oscuro si no se proporciona color.
 * El color se oscurece multiplicando por 0.5 y luego se ilumina sumando 128 a cada canal,
 * resultando en colores en el rango de aproximadamente RGB(128-255, 128-255, 128-255)
 * @param {string | undefined} color - Color hexadecimal en formato "#RRGGBB" o undefined
 * @returns {string} Color en formato CSS rgb(r, g, b)
 * @example
 * // Con color hexadecimal
 * getCuratedColor("#FF0000") // Devuelve algo como rgb(255, 128, 128)
 * 
 * // Sin color (genera aleatorio)
 * getCuratedColor(undefined) // Devuelve un rgb aleatorio oscuro
 */
export default function getCuratedColor(color: string | undefined): string {
  let r: number, g: number, b: number;
  if (color) {
    const hex = color.replace("#", "");
    r = Math.ceil(parseInt(hex.substring(0, 2), 16) * 0.5);
    g = Math.ceil(parseInt(hex.substring(2, 4), 16) * 0.5);
    b = Math.ceil(parseInt(hex.substring(4, 6), 16) * 0.5);
  } else {
    r = Math.ceil(Math.random() * 128);
    g = Math.ceil(Math.random() * 128);
    b = Math.ceil(Math.random() * 128);
  }
  return `rgb(${r + 128},${g + 128},${b + 128})`;
}