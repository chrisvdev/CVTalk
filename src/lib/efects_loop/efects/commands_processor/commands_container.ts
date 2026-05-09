import { type UserMessageInfoType } from "mtmi";

/**
 * Estructura recursiva de comandos basada en árbol.
 * Permite almacenar comandos multi-palabra con ejecución mediante símbolo.
 * @typedef {Object} Commands
 */
type Commands = {
  [key: symbol]: CommandCallback
  [key: string]: Commands
}

/**
 * Tipo de callback para ejecutar un comando.
 * @callback CommandCallback
 * @param {UserMessageInfoType} message - El mensaje del chat
 * @returns {boolean} true si el mensaje no debe renderizarse, false para continuar
 */
export type CommandCallback = (message: UserMessageInfoType) => boolean

/**
 * Contenedor y gestor de comandos de chat.
 * Implementa patrón Singleton y utiliza una estructura de árbol para
 * almacenar y buscar comandos de forma eficiente.
 * Soporta comandos multi-palabra (ej: "!speak -config").
 * 
 * @class ComManzContainer
 * @example
 * const container = ComManzContainer.getInstance()
 * container.addCommand('!help', (msg) => {
 *   console.log('Mostrando ayuda')
 *   return true // No renderizar el mensaje
 * })
 * container.addCommand('!help admin', (msg) => {
 *   console.log('Ayuda para admin')
 *   return true
 * })
 */
class ComManzContainer {
  private commands: Commands
  private EXEC: symbol
  private static instance: ComManzContainer | null = null

  /**
   * Constructor privado para implementar patrón Singleton.
   * Inicializa el árbol de comandos y el símbolo de ejecución.
   * @private
   */
  private constructor() {
    this.commands = {}
    this.EXEC = Symbol('exec')
  }

  /**
   * Obtiene la instancia única del contenedor (Singleton).
   * @returns {ComManzContainer} La instancia única del contenedor de comandos
   * @static
   */
  static getInstance() {
    if (!ComManzContainer.instance) {
      ComManzContainer.instance = new ComManzContainer()
    }
    return ComManzContainer.instance
  }

  /**
   * Divide un mensaje en palabras clave para el árbol de comandos.
   * @param {string} message - El mensaje a dividir
   * @returns {string[]} Array de palabras sin espacios extra
   * @private
   */
  private splitKeys(message: string) {
    return message.trim().split(/\s+/)
  }

  /**
   * Registra un nuevo comando en el árbol.
   * Soporta comandos multi-palabra creando nodos intermedios.
   * 
   * @param {string} command - El comando a registrar (ej: "!speak -config")
   * @param {CommandCallback} cb - El callback a ejecutar cuando se encuentre el comando
   * 
   * @example
   * container.addCommand('!help', helpCallback)
   * container.addCommand('!help admin', adminHelpCallback)
   */
  addCommand(command: string, cb: CommandCallback) {
    const keys = this.splitKeys(command)
    let lastRef = this.commands
    keys.forEach((key) => {
      if (lastRef[key]) {
        lastRef = lastRef[key]
      } else {
        lastRef[key] = {}
        lastRef = lastRef[key]
      }
    })
    lastRef[this.EXEC] = cb
  }

  /**
   * Busca un comando en el árbol basándose en el mensaje.
   * Retorna el callback del comando si lo encuentra, o false si no existe.
   * 
   * @param {UserMessageInfoType} message - El mensaje del chat
   * @returns {CommandCallback|false} El callback del comando encontrado o false
   * 
   * @example
   * const command = container.foundCommand(message)
   * if (command) {
   *   const shouldNotRender = command(message)
   * }
   */
  foundCommand(message: UserMessageInfoType): CommandCallback | false {
    const keys = this.splitKeys(message.message)
    let lastRef = this.commands
    let keyIndex = 0
    const searchCommand = () => {
      if (lastRef) {
        if (lastRef[keys[keyIndex]]) {
          lastRef = lastRef[keys[keyIndex]]
          keyIndex++
          return searchCommand()
        }
        if (lastRef[this.EXEC]) return lastRef[this.EXEC]
        return false
      }
    }
    const command = searchCommand()
    return command
      ? (message) => {
        message.message = keys.slice(keyIndex).join(' ')
        return command(message)
      }
      : false
  }
}

export default ComManzContainer
