import isURL from 'validator/es/lib/isURL'
import type { Effect } from '..'

/**
 * Expresión regular para detectar URLs en diversos formatos
 * Cubre URLs con y sin protocolo, con múltiples subdominios
 * @constant {RegExp}
 */
const regURL =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g

/**
 * Efecto que censura enlaces/URLs en mensajes de chat.
 * Los moderadores y el broadcaster están exentos del filtro.
 * Reemplaza URLs detectadas con [🚫🔗] en el HTML y con un mensaje descriptivo en el texto plano.
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para continuar al siguiente efecto
 * @example
 * // Mensaje con link: "Mira esto https://example.com"
 * // Resultado HTML: "Mira esto [🚫🔗]"
 * // Resultado texto: "Mira esto (NombreUsuario envió un link)"
 */
const antiLinks: Effect = (message, next) => {
  const { isMod } = message.userInfo
  const isBroadcaster = message.userInfo.username === window.OBSChat.properties?.channel
  if (!(isMod || isBroadcaster)) {
    message.messageInfo.message.childNodes.forEach((node: ChildNode) => {
      if (node.nodeName === "SPAN") {
        const text = node.textContent || ""
        node.textContent = text.split(' ')
          .map((word) => {
            let url = isURL(word)
            if (regURL.test(word)) {
              url = true
            }
            return url ? `[🚫🔗]` : word
          })
          .join(' ')
      }
    })
  }
  message.message = message.message.split(' ')
    .map((word) => {
      let url = isURL(word)
      if (regURL.test(word)) {
        url = true
      }
      return url ? `(${message.userInfo.displayName} envió un link)` : word
    })
    .join(' ')
  next()
}
export default antiLinks