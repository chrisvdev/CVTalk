import type { Effect } from '..'

/**
 * La palabra más larga del español (23 caracteres)
 * Usada como referencia para limitar longitud de palabras
 * @constant {string}
 */
const mostLongWordInSpanish = 'electroencefalografista'

/**
 * Efecto que censura palabras excesivamente largas en los mensajes.
 * Considera "excesivamente larga" cualquier palabra mayor a 23 caracteres
 * (más larga que "electroencefalografista", la palabra más larga en español).
 * Reemplaza con [🚫📏] en HTML y con una palabra turca famosamente larga en texto.
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para continuar al siguiente efecto
 * @example
 * // "esto es aaaaaaaaaaaaaaaaaaaaaaaaa spam" 
 * // HTML: "esto es [🚫📏] spam"
 * // Texto: "esto es Muvaffakiyetsezlestiricilestiriveremeyebileceklerimizdenmissinizcesine spam"
 */
const antiLongWords: Effect = (message, next) => {
  message.messageInfo.message.childNodes.forEach((node: ChildNode) => {
    if (node.nodeName === "SPAN") {
      const text = node.textContent || ""
      node.textContent = text.split(' ')
        .map((word) => {
          const longerWord = mostLongWordInSpanish.length < word.length
          return longerWord
            ? `[🚫📏]`
            : word
        })
        .join(' ')
    }
  })
  message.message = message.message.split(' ')
    .map((word) => {
      const longerWord = mostLongWordInSpanish.length < word.length
      return longerWord
        ? `Muvaffakiyetsezlestiricilestiriveremeyebileceklerimizdenmissinizcesine`
        : word
    })
    .join(' ')
  next()
}
export default antiLongWords