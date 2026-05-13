import type { Properties } from "@/scripts/global";
import type { CommandCallback } from "../commands_container";

/**
 * Comando para administración remota del widget CVTalk desde el chat de Twitch.
 * Permite modificar las propiedades del widget en tiempo real sin necesidad de recargar la página.
 * 
 * **Comandos disponibles:**
 * - `!remoteAdmin <propiedad> <valor>` - Formato completo
 * - `!cvsudo <propiedad> <valor>` - Alias corto
 * 
 * **Modos de seguridad:**
 * - `remoteAdmin=""` - Deshabilitado (default)
 * - `remoteAdmin="streamer"` - Solo el streamer puede ejecutar comandos
 * - `remoteAdmin="moderators"` - Streamer y moderadores pueden ejecutar comandos
 * 
 * **Propiedades modificables:**
 * - `messageTTL` - Tiempo de vida de mensajes (number)
 * - `pato_bot` - Habilitar PatoBot (boolean)
 * - `mute_bots` - Silenciar bots (boolean)
 * - `mute_replays` - Silenciar respuestas (boolean)
 * - `mute_prefixes` - Prefijos a silenciar (string)
 * - `tts` - Habilitar TTS (string)
 * - `tts_accent` - Acento TTS (string)
 * - `tts_variant` - Variante TTS (number)
 * - `insecureHTML` - Modo HTML (string: "", "onCommand", "onHighlight")
 * 
 * **Propiedades protegidas (no modificables):**
 * - `remoteAdmin` - No se puede cambiar su propio nivel de seguridad
 * - `baseUrl` - URL base del sistema
 * - `channel` - Canal de Twitch conectado
 * 
 * @param {UserMessageInfoType} message - El mensaje del chat
 * @returns {boolean} true (siempre, para no renderizar el comando)
 * 
 * @example
 * // Streamer cambia tiempo de vida de mensajes a 15 segundos
 * !remoteAdmin messageTTL 15000
 * 
 * @example
 * // Moderador activa PatoBot
 * !cvsudo pato_bot true
 * 
 * @example
 * // Streamer cambia acento TTS
 * !remoteAdmin tts_accent es-MX
 * 
 * @example
 * // Moderador configura prefijos a silenciar
 * !cvsudo mute_prefixes !,.,/
 * 
 * @security
 * ⚠️ Este comando permite control remoto del widget. Configurar cuidadosamente
 * el nivel de acceso según el nivel de confianza en moderadores.
 * 
 * @author ChrisVDev
 */
const remoteAdminCommand: CommandCallback = (message) => {
  const { remoteAdmin, channel } = window.OBSChat.properties || {}
  const properties = Object.keys(window.OBSChat.properties || {}).filter(key => key !== 'remoteAdmin' && key !== 'baseUrl' && key !== 'channel')
  const { userInfo: { isMod, displayName }, username, } = message
  const isStreamer = channel === username
  let executeCommand = false
  if (remoteAdmin === "streamer" && isStreamer) executeCommand = true
  if (remoteAdmin === "moderators" && (isStreamer || isMod)) executeCommand = true
  
  if (executeCommand) {
    console.log(`Comando remoto de administración ejecutado por ${displayName} (${username})`)
    const words = message.message.split(' ')
    const key = words[0] as keyof Omit<Properties, 'remoteAdmin' | 'baseUrl'>
    const value = words.slice(1).join(' ')
    const mutableProperties = window.OBSChat.properties as Record<string, unknown>
    console.log(`Variable: ${key}, valor actual: ${mutableProperties[key]}, nuevo valor: ${value}`)
    if (window.OBSChat.properties) {
      if (properties.includes(key)) {
        switch (typeof mutableProperties[key]) {
          case "boolean":
            mutableProperties[key] = value === "true"
            break
          case "number":
            mutableProperties[key] = Number(value)
            break
          default:
            mutableProperties[key] = value
        }
      } else {
        console.warn(`Propiedad ${key} no encontrada en las propiedades globales.`)
      }
    }
  } else {
    console.warn(`Intento de comando remoto denegado: ${displayName} (${username}) no tiene permisos.`)
  }
  return true
}

export default remoteAdminCommand