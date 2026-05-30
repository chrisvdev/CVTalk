import type AudioProcessor from "@/components/audio_processor";
import type { Effect } from "../index"
import { type UserMessageInfoType } from "mtmi";

/**
 * Efecto de tributo a PatoBot, un bot creado por "Nivek el pato" (más tarde conocido como "PatitoDev"),
 * un querido amigo y gran creador de contenido que se retiró del streaming.
 * Este efecto mantiene vivo el legado de PatoBot reproduciendo sonidos de pato
 * y cambiando avatares cuando detecta mensajes con "*quack*"
 * 
 * @class PatoBotTribute
 * @author Christian Villegas (ChrisVDev)
 * @tribute Nivek el pato / PatitoDev - Creador original de PatoBot
 */
export default class PatoBotTribute {
  private audioProcessor: AudioProcessor

  /**
   * Indica si el audio ha sido desbloqueado por interacción del usuario
   * @private
   * @type {boolean}
   */
  private audioUnlocked: boolean = false

  /**
   * Array de URLs de avatares de patos disponibles
   * @private
   * @type {string[]}
   */
  private duckAvatars: string[]

  /**
   * Constructor que inicializa el audio y configura el sistema de desbloqueo
   * Precarga el archivo de audio y configura listeners para desbloquear
   * la reproducción automática en navegadores
   */
  constructor() {
    this.audioProcessor = window.OBSChat.audioProcessor as AudioProcessor
    // Obtener BASE_URL del sistema global tipado
    const { baseUrl } = window.OBSChat.properties || { baseUrl: '/' };

    // Inicializar avatares de pato con BASE_URL correcto
    this.duckAvatars = [
      `${baseUrl}assets/pato1.jpg`,
      `${baseUrl}assets/pato2.jpg`,
      `${baseUrl}assets/pato3.jpg`,
      `${baseUrl}assets/pato4.jpg`,
      `${baseUrl}assets/pato5.jpg`,
      `${baseUrl}assets/quack.gif`,
    ]

    // Crear elemento de audio con precarga automática
    this.audioProcessor.loadAudio("quack", `${baseUrl}assets/audio/quack.mp3`)
  }

  /**
   * Obtiene la función de efecto para usar en el loop de efectos
   * @public
   * @returns {Effect} Función de efecto que procesa mensajes
   */
  public getEfect(): Effect {
    return (message, next) => {
      this.parseMessage(message)
      next()
    }
  }

  /**
   * Reproduce el sonido de pato, manejando errores de autoplay
   * @private
   * @async
   */
  private async playQuack() {
      this.audioProcessor.playAudio("quack")
  }

  /**
   * Analiza el mensaje en busca del texto "*quack*" y aplica los efectos
   * Cambia el avatar del usuario por uno aleatorio de pato y reproduce el sonido
   * @private
   * @param {UserMessageInfoType} message - El mensaje a analizar
   */
  private parseMessage(message: UserMessageInfoType) {
    if (message.message.includes("*quack*")) {
      message.userInfo.avatar = (async () => {
        return this.duckAvatars[Math.floor(Math.random() * this.duckAvatars.length)]
      })()
      this.playQuack()
      message.messageInfo.message.childNodes.forEach((node: ChildNode) => {
        if (node.nodeName === "SPAN") {
          const text = node.textContent || ""
          node.textContent = text
            .replaceAll("*quack*", '🦆')
        }
      })
      message.message = message.message
        .replaceAll("*quack*", `[${message.userInfo.username} quackeó]`)
    }
  }
}