import { type UserMessageInfoType } from "mtmi";
import TTS from '@/lib/tts'
import TTSConfigVault from "@/lib/config_vault";

/**
 * @module speak
 * @description Módulo que implementa comandos TTS (Text-to-Speech) para el chat.
 * Proporciona tres comandos principales:
 * - !speak / !s: Sintetiza texto a voz
 * - !speak -config: Configura acento y variante personalizados
 * - !speak -reset: Resetea configuración personalizada
 */

const tts = TTS.getInstance()
const ttsConfigVault = TTSConfigVault.getInstance()

/**
 * Verifica si un carácter es alfabético (a-z, A-Z).
 * @param {string} char - El carácter a verificar
 * @returns {boolean} true si es alfabético, false en caso contrario
 * @private
 */
function isAlphabetCharacter(char: string) {
  return /^[a-zA-Z]$/.test(char)
}

/**
 * Normaliza un acento al formato estándar xx-XX (ej: es-ar -> es-AR).
 * Valida que el formato sea correcto (2 letras, guión, 2 letras).
 * 
 * @param {string} accent - El acento a normalizar
 * @returns {string} El acento normalizado o 'nt-VD' si es inválido
 * @private
 * 
 * @example
 * normalize('es-ar') // returns 'es-AR'
 * normalize('en-us') // returns 'en-US'
 * normalize('invalid') // returns 'nt-VD'
 */
function normalize(accent: string) {
  const chars = accent.split('')
  if (
    chars.length === 5 &&
    chars.reduce(
      (prev, char, index) =>
        prev && (index === 2 ? char === '-' : isAlphabetCharacter(char)),
      true
    )
  ) {
    let [prev, post] = accent.split('-')
    prev = prev.toLowerCase()
    post = post.toUpperCase()
    return `${prev}-${post}`
  }
  return 'nt-VD'
}

/**
 * Verifica si un acento es válido consultando el gestor TTS.
 * @param {string} toEvaluate - El acento a evaluar
 * @returns {boolean} true si el acento está disponible
 * @private
 */
function isAnAccent(toEvaluate: string) {
  const result = tts.isAValidVoice(toEvaluate)
  return result
}

const ACC = 0
const VAR = 1

/**
 * Comando para configurar el acento y variante TTS personalizado del usuario.
 * Sintaxis: !speak -config <acento> [variante]
 * 
 * @param {UserMessageInfoType} message - El mensaje del chat
 * @returns {boolean} true (siempre, para no renderizar el comando)
 * 
 * @example
 * // Usuario escribe: "!speak -config es-AR 2"
 * // Configura acento español de Argentina, variante 2
 */
export function config(message: UserMessageInfoType) {
  const { message: msg, userInfo: { username } } = message
  const words = msg.split(' ').map((word) => word.trim())
  const acce = normalize(words[ACC])
  const vari = Math.ceil(Number(words[VAR])) || 1
  const valid = tts.isAValidVoice(acce) && tts.isAValidVariant(acce, vari)
  console.log(acce, vari, valid, username)
  if (valid) {
    ttsConfigVault.setConfig(username, acce, !isNaN(vari) ? vari : 1)
  }
  return true
}

/**
 * Comando para resetear la configuración TTS personalizada del usuario.
 * Sintaxis: !speak -reset
 * 
 * @param {UserMessageInfoType} message - El mensaje del chat (se extrae el username)
 * @returns {boolean} true (siempre, para no renderizar el comando)
 * 
 * @example
 * // Usuario escribe: "!speak -reset"
 * // Elimina su configuración personalizada
 */
export function reset({ userInfo: { username } }: UserMessageInfoType) {
  ttsConfigVault.resetConfig(username)
  return true
}

/**
 * Comando principal TTS que sintetiza texto a voz.
 * Sintaxis: 
 * - !speak <texto>
 * - !speak <acento> <texto>
 * - !speak <acento> <variante> <texto>
 * - !s <texto> (alias corto)
 * 
 * Usa la configuración personalizada del usuario si existe,
 * caso contrario usa la configuración global.
 * 
 * @param {UserMessageInfoType} message - El mensaje del chat
 * @returns {boolean} false (para que el mensaje se renderice normalmente)
 * 
 * @example
 * // Usuario escribe: "!speak Hola mundo"
 * // Sintetiza "Hola mundo" con configuración del usuario o global
 * 
 * @example
 * // Usuario escribe: "!speak es-MX 2 Hola desde México"
 * // Sintetiza con acento mexicano, variante 2
 * 
 * @author Sonny (comentario original: "los que votaron que no, la tienen adentro - 8/7/2024")
 */
export function speak(message: UserMessageInfoType) {
  const {
    message: msg,
    userInfo: { username },
    messageInfo: { message: messageToRender }
  } = message
  const { tts_accent, tts_variant } = window.OBSChat.properties || {}
  const config = ttsConfigVault.getConfig(username)
  let accent = config ? config.accent : tts_accent || 'nt-VD'
  let variant = config ? config.variant : tts_variant || 1
  const words = msg
    .replace('!speak ', '')
    .split(' ')
    .map((word) => word.trim())
  if (isAnAccent(words[0])) {
    accent = normalize(String(words.splice(0, 1)))
    if (!Number.isNaN(Number(words[0]))) {
      variant = Number(words.splice(0, 1))
    }
  }
  const toRead = words.join(' ').trim()
  tts.speak(toRead, accent, variant)
  return false
}
