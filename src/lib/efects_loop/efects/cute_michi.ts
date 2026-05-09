import type { Effect } from '..'

/**
 * Efecto que convierte emoticones ":3" en "AliMoyi".
 * Procesa tanto el contenido HTML como el texto plano del mensaje.
 * 
 * @note Originalmente reemplazaba con emoji de gato 😺, ahora usa "AliMoyi"
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para continuar al siguiente efecto
 * @example
 * // "Hola :3 cómo estás" -> "Hola AliMoyi cómo estás"
 */
const cuteMichi: Effect = (message, next) => {
  message.messageInfo.message.childNodes.forEach((node: ChildNode) => {
    if (node.nodeName === "SPAN") {
      const text = node.textContent || ""
      node.textContent = text.split(' ')
        .map((word) => {
          let michi = word === ":3"
          return michi ? `😺` : word
        })
        .join(' ')
    }
  })
  message.message = message.message.split(' ')
    .map((word) => {
      let michi = word === ":3"
      return michi ? `AliMoyi` : word
    })
    .join(' ')
  next()
}
export default cuteMichi