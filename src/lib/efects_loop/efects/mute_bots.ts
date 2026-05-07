import type { Effect } from "../index"

/**
 * Efecto que silencia mensajes provenientes de bots.
 * Interrumpe la cadena de efectos si el mensaje es de un bot,
 * evitando que se renderice en el chat.
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para continuar al siguiente efecto
 * @example
 * // Si message.userInfo.isBot === true, el mensaje no se procesa
 * // Activar con: ?channel=micanal&mute_bots=true
 */
const muteBots: Effect = (message, next) => {
  if (message.userInfo.isBot) {
    return
  } else {
    next()
  }
}

export default muteBots