export type Callback = () => void;

/**
 * Factory para setTimeout que se limpia automáticamente después de ejecutar
 * @param {Callback} callback - Función a ejecutar
 * @param {number} delay - Tiempo en milisegundos
 * @returns {ReturnType<typeof setTimeout>} ID del timeout
 * @example
 * const timer = createTimeout(() => console.log('Timeout ejecutado'), 1000);
 */
export function createTimeout(callback: Callback, delay: number) {
  const id = setTimeout(() => {
    callback();
    clearTimeout(id);
  }, delay);
  return id;
}

/**
 * Factory para setInterval con método para detener y limpiar
 * @param {Callback} callback - Función a ejecutar repetidamente
 * @param {number} interval - Intervalo en milisegundos
 * @returns {{stop: () => void}} Objeto con método para detener el intervalo
 * @example
 * const interval = createInterval(() => console.log('Interval ejecutado'), 500);
 * setTimeout(() => interval.stop(), 3000); // Detener después de 3 segundos
 */
export function createInterval(callback: Callback, interval: number) {
  const id = setInterval(callback, interval);
  return {
    stop: () => {
      clearInterval(id);
    }
  };
}