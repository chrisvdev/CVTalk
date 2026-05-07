import type EfectsLoop from ".";
import cuteMichi from "./efects/cute_michi";
import afordiLove from "./efects/afordi_love";
import antiLinks from "./efects/anti_links";
import antiGoose from "./efects/anti_goose";
import antiLongWords from "./efects/anti_long_words";
import PatoBotTribute from "./efects/pato_bot_tribute";
import muteBots from "./efects/mute_bots";
import muteCommandsByPrefix from "./efects/mute_commands_by_prefix";

/**
 * Inicializa y registra todos los efectos en el sistema de procesamiento de mensajes.
 * Los efectos se agregan en orden específico:
 * 1. Efectos siempre activos: cuteMichi, afordiLove, antiLinks, antiGoose, antiLongWords
 * 2. Efectos condicionales basados en propiedades: PatoBotTribute, muteBots, muteCommandsByPrefix
 * 
 * @param {EfectsLoop} efectsLoop - Instancia del sistema de efectos donde se registran
 * @example
 * const efectsLoop = new EfectsLoop()
 * startEfects(efectsLoop)
 * // Todos los efectos configurados están listos para procesar mensajes
 */
export default function startEfects(efectsLoop: EfectsLoop) {
  const { mute_bots, pato_bot, mute_prefixes } = window.OBSChat.properties || {}
  efectsLoop.addEffect(cuteMichi)
  efectsLoop.addEffect(afordiLove)
  efectsLoop.addEffect(antiLinks)
  efectsLoop.addEffect(antiGoose)
  efectsLoop.addEffect(antiLongWords)
  if (pato_bot) {
    const patoBot = new PatoBotTribute()
    efectsLoop.addEffect(patoBot.getEfect())
  }
  if (mute_bots) {
    efectsLoop.addEffect(muteBots)
  }
  if (mute_prefixes) {
    efectsLoop.addEffect(muteCommandsByPrefix)
  }
}