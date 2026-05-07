import type { Effect } from "../index"

/**
 * Efecto que silencia mensajes que comienzan con prefijos específicos.
 * Útil para ocultar comandos de bots (ej: "!", ".", "/").
 * Los prefijos se configuran mediante el parámetro URL `mute_prefixes` separados por comas.
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para continuar al siguiente efecto
 * @example
 * // URL: ?channel=micanal&mute_prefixes=!,.,/
 * // "!comando" -> no se muestra
 * // ".roll 6" -> no se muestra
 * // "Hola chat" -> se muestra normalmente
 */
const muteCommandsByPrefix: Effect = (message, next) => {
  const { mute_prefixes } = window.OBSChat.properties || {}
  if (mute_prefixes) {
    const isACommand =
      mute_prefixes.split(",").some(
        (prefix: string) => message.message.startsWith(prefix)
      )
    if (isACommand) {
      return
    }
  }
  next()
}

export default muteCommandsByPrefix