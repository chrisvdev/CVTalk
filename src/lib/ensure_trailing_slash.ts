/**
 * Asegura que una URL termine con barra diagonal
 * @param url - URL a procesar
 * @returns URL con barra diagonal al final
 */
export function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : url + '/';
}
