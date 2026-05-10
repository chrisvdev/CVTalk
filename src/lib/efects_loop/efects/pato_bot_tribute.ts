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
  /**
   * Elemento de audio para reproducir el sonido de pato
   * @private
   * @type {HTMLAudioElement}
   */
  private quack: HTMLAudioElement

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
    this.quack = new Audio(`${baseUrl}assets/audio/quack.mp3`)
    this.quack.preload = "auto"  // Precarga automática (mejor que link preload para uso bajo demanda)
    this.quack.volume = 0.5
    document.body.appendChild(this.quack)
    this.unlockAudio()
  }

  /**
   * Configura listeners para desbloquear el audio en la primera interacción del usuario
   * Necesario para cumplir con las políticas de autoplay de los navegadores modernos
   * @private
   */
  private unlockAudio() {
    const unlock = async () => {
      try {
        // Intenta reproducir en silencio para desbloquear
        this.quack.volume = 0
        await this.quack.play()
        this.quack.pause()
        this.quack.currentTime = 0
        this.quack.volume = 1
        this.audioUnlocked = true
        console.log("Audio desbloqueado correctamente")
        // Remover listeners una vez desbloqueado
        document.removeEventListener("click", unlock)
        document.removeEventListener("touchstart", unlock)
        document.removeEventListener("keydown", unlock)
      } catch {
        console.log("Esperando interacción del usuario para desbloquear audio")
      }
    }
    // Intentar desbloquear en múltiples eventos de usuario
    document.addEventListener("click", unlock, { once: true })
    document.addEventListener("touchstart", unlock, { once: true })
    document.addEventListener("keydown", unlock, { once: true })
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
    try {
      this.quack.currentTime = 0
      await this.quack.play()
    } catch (error) {
      console.warn("No se pudo reproducir el audio:", error)
      if (!this.audioUnlocked) {
        console.log("Haz click en la página para habilitar los sonidos")
      }
    }
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