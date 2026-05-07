import type { Effect } from '..'

/**
 * Efecto que reemplaza emotes de corazón genéricos con el emote personalizado "afordiLove".
 * También convierte texto "<3" y emoji "❤️" en el texto "afordiLove".
 * Reemplaza el emote de Twitch ID 555555584 con el emote afordiLove (ID emotesv2_2440c347e7344f0b9248beb83aa4ac87).
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para continuar al siguiente efecto
 * @example
 * // "Te quiero <3" -> "Te quiero afordiLove"
 * // Emote genérico de corazón -> Emote afordiLove
 */
const afordiLove: Effect = (message, next) => {
  message.messageInfo.message.childNodes.forEach((node: ChildNode) => {
    if (node.nodeName === "IMG") {
      const img = node as HTMLImageElement
      if (img.src === "https://static-cdn.jtvnw.net/emoticons/v2/555555584/default/dark/2.0") {
        img.src = "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_2440c347e7344f0b9248beb83aa4ac87/default/dark/2.0"
      }
    }
  })
  message.message = message.message.split(' ')
    .map((word) => {
      let heart = word === "<3" || word === "❤️"
      return heart ? `afordiLove` : word
    })
    .join(' ')
  next()
}
export default afordiLove