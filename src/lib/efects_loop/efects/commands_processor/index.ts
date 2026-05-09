
import type { Effect } from '../..'
import { speak, config, reset } from './commands/speak'
import ComManzContainer from './commands_container'

/**
 * Procesador de comandos de chat.
 * Inicializa y registra los comandos disponibles (!speak, !s, etc.) 
 * si la funcionalidad TTS está habilitada en las propiedades.
 * 
 * @module commands_processor
 */

const commandsContainer = ComManzContainer.getInstance()
const { tts } = window.OBSChat.properties || {}
if (tts) {
  commandsContainer.addCommand('!speak', speak)
  commandsContainer.addCommand('!s', speak)
  commandsContainer.addCommand('!speak -config', config)
  commandsContainer.addCommand('!speak -reset', reset)
}

/**
 * Efecto que procesa comandos en mensajes del chat.
 * Ignora mensajes de bots y busca comandos registrados en el contenedor.
 * Si encuentra un comando, lo ejecuta; si el comando retorna true, no renderiza el mensaje.
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {Function} next - Callback para continuar con el siguiente efecto
 * 
 * @example
 * // Usuario escribe: "!speak Hola mundo"
 * // El comando se procesa y el mensaje no se renderiza
 */
const commandsProcessor: Effect = (message, next) => {
  const { userInfo: { isBot } } = message
  let noRender = false
  if (!isBot) {
    const command = commandsContainer.foundCommand(message)
    noRender = command && command(message)
  }
  if (!noRender) next()
}
export default commandsProcessor