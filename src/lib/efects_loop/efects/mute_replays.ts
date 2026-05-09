import type { Effect } from "../index"

/**
 * Efecto que silencia (mute) mensajes que son respuestas a otros mensajes.
 * Filtra los mensajes basándose en la presencia de información de reply.
 * 
 * @author tadeo_dev
 * @param {UserMessageInfoType} message - El mensaje a evaluar
 * @param {Function} next - Callback para continuar con el siguiente efecto
 * @returns {void} No continúa si es una respuesta, caso contrario pasa al siguiente efecto
 * 
 * @example
 * // Mensaje con reply será silenciado
 * // Mensaje sin reply pasará al siguiente efecto
 */
const muteReplays: Effect = (message, next) => {
  if (message.replyInfo) {
    return
  } else {
    next()
  }
}

export default muteReplays