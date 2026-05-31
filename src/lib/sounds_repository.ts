import type { OnEndedCallback } from "@/components/audio_processor";
import type AudioProcessor from "@/components/audio_processor";

/**
 * Nombre identificador único de un repositorio de sonidos
 * @typedef {string} SoundRepositoryName
 * @example "hl1_vox", "hl1_suit"
 */
export type SoundRepositoryName = string;

/**
 * URL base donde se encuentran alojados los archivos de audio del repositorio
 * @typedef {string} SoundRepositoryBaseURL
 * @example "https://github.com/sourcesounds/hl1/raw/refs/heads/master/sound/vox/"
 */
export type SoundRepositoryBaseURL = string;

/**
 * Nombre identificador de un sonido específico dentro del repositorio
 * @typedef {string} SoundName
 * @example "beep", "system_online", "warning"
 */
export type SoundName = string;

/**
 * Ruta relativa de un archivo de audio respecto a la baseURL del repositorio
 * @typedef {string} SoundRelativePath
 * @example "beep.wav", "system/online.mp3"
 */
export type SoundRelativePath = string;

/**
 * Diccionario que mapea nombres de sonidos a sus rutas relativas
 * @typedef {Record<SoundName, SoundRelativePath>} SoundsDictionary
 * @example
 * {
 *   "beep": "beep.wav",
 *   "warning": "alerts/warning.wav"
 * }
 */
export type SoundsDictionary = Record<SoundName, SoundRelativePath>;

/**
 * Prefijo que se añade automáticamente a los mensajes según su tipo (log, warn, error)
 * @typedef {string} SoundPrefix
 * @example "vox_login", "hev_logon"
 */
export type SoundPrefix = string;

/**
 * Configuración JSON para definir un repositorio de sonidos
 * 
 * @typedef {Object} SoundsRepositoryConfig
 * @property {SoundRepositoryName} name - Nombre único del repositorio
 * @property {SoundRepositoryBaseURL} baseURL - URL base donde están los archivos de audio
 * @property {SoundsDictionary} sounds - Diccionario de sonidos (nombre → ruta relativa)
 * @property {SoundPrefix} [logPrefix] - Prefijo opcional para mensajes tipo "log"
 * @property {SoundPrefix} [warnPrefix] - Prefijo opcional para mensajes tipo "warn"
 * @property {SoundPrefix} [errorPrefix] - Prefijo opcional para mensajes tipo "error"
 * 
 * @example
 * {
 *   "name": "hl1_vox",
 *   "baseURL": "https://github.com/sourcesounds/hl1/raw/refs/heads/master/sound/vox/",
 *   "sounds": {
 *     "beep": "beep.wav",
 *     "online": "online.wav"
 *   },
 *   "logPrefix": "",
 *   "warnPrefix": "warning",
 *   "errorPrefix": "error critical"
 * }
 */
export type SoundsRepositoryConfig = {
  name: SoundRepositoryName;
  baseURL: SoundRepositoryBaseURL;
  sounds: SoundsDictionary;
  logPrefix?: SoundPrefix;
  warnPrefix?: SoundPrefix;
  errorPrefix?: SoundPrefix;
}

/**
 * Repositorio de sonidos que gestiona un conjunto temático de audios
 * 
 * Permite cargar, registrar y reproducir sonidos desde una configuración JSON.
 * Incluye métodos de conveniencia (log, warn, error) que automáticamente añaden
 * prefijos configurables para crear secuencias de audio complejas.
 * 
 * @class SoundsRepository
 * @example
 * const config = {
 *   name: "hl1_vox",
 *   baseURL: "https://example.com/sounds/",
 *   sounds: {
 *     "beep": "beep.wav",
 *     "online": "online.wav"
 *   },
 *   warnPrefix: "warning"
 * };
 * const repo = new SoundsRepository(config);
 * 
 * // Reproduce un sonido individual
 * repo.playSound("beep");
 * 
 * // Reproduce una secuencia con prefijo automático
 * repo.warn("system online"); // Reproduce: "warning system online"
 */
export default class SoundsRepository {
  /**
   * Nombre del repositorio
   * @private
   * @type {SoundRepositoryName}
   */
  private name: SoundRepositoryName
  
  /**
   * Referencia al AudioProcessor global para reproducir sonidos
   * @private
   * @type {AudioProcessor}
   */
  private audioProcessor: AudioProcessor
  
  /**
   * URL base donde están alojados los archivos de audio
   * @private
   * @type {SoundRepositoryBaseURL}
   */
  private baseURL: SoundRepositoryBaseURL
  
  /**
   * Prefijo para mensajes tipo "log"
   * @private
   * @type {SoundPrefix}
   */
  private logPrefix: SoundPrefix
  
  /**
   * Prefijo para mensajes tipo "warn"
   * @private
   * @type {SoundPrefix}
   */
  private warnPrefix: SoundPrefix
  
  /**
   * Prefijo para mensajes tipo "error"
   * @private
   * @type {SoundPrefix}
   */
  private errorPrefix: SoundPrefix
  
  /**
   * Normaliza un prefijo de sonido para asegurar que termine con espacio
   * 
   * @private
   * @static
   * @param {SoundPrefix | undefined} prefix - Prefijo a normalizar
   * @param {SoundPrefix} [defaultPrefix=""] - Prefijo por defecto si no se proporciona
   * @returns {SoundPrefix} Prefijo normalizado con espacio al final
   * @example
   * prefixCurator("warning")    // → "warning "
   * prefixCurator("error ")     // → "error "
   * prefixCurator(undefined)    // → ""
   */
  private static prefixCurator(prefix: SoundPrefix | undefined, defaultPrefix: SoundPrefix = ""): SoundPrefix {
    if (!prefix) return defaultPrefix;
    return prefix.endsWith(" ") ? prefix : prefix + " ";
  }
  
  /**
   * Valida si una configuración de repositorio es válida
   * 
   * Verifica que todos los campos obligatorios estén presentes y tengan el tipo correcto.
   * 
   * @public
   * @static
   * @param {SoundsRepositoryConfig} config - Configuración a validar
   * @returns {boolean} true si la configuración es válida, false en caso contrario
   * @example
   * const config = { name: "test", baseURL: "https://...", sounds: {...} };
   * if (SoundsRepository.validateConfig(config)) {
   *   const repo = new SoundsRepository(config);
   * }
   */
  public static validateConfig(config: SoundsRepositoryConfig): boolean {
    if (!config) {
      console.error("SoundsRepositoryConfig inválida: el objeto de configuración es nulo o indefinido");
      return false;
    }
    if (typeof config !== "object") {
      console.error("SoundsRepositoryConfig inválida: se esperaba un objeto de configuración");
      return false;
    }
    if (!config.name || typeof config.name !== "string") {
      console.error("SoundsRepositoryConfig inválida: falta el campo 'name' o no es una cadena");
      return false;
    }
    if (!config.baseURL || typeof config.baseURL !== "string") {
      console.error("SoundsRepositoryConfig inválida: falta el campo 'baseURL' o no es una cadena");
      return false;
    }
    if (!config.sounds || typeof config.sounds !== "object" || Object.keys(config.sounds).length === 0) {
      console.error("SoundsRepositoryConfig inválida: el campo 'sounds' debe contener al menos un sonido");
      return false;
    }
    return true;
  }
  
  /**
   * Crea una instancia de SoundsRepository y registra todos sus sonidos en el AudioProcessor
   * 
   * @constructor
   * @param {SoundsRepositoryConfig} config - Configuración del repositorio
   * @throws {Error} Si el AudioProcessor no está inicializado
   * @example
   * const config = {
   *   name: "hl1_vox",
   *   baseURL: "https://example.com/sounds/",
   *   sounds: { "beep": "beep.wav" }
   * };
   * const repo = new SoundsRepository(config);
   */
  public constructor(config: SoundsRepositoryConfig) {
    this.name = config.name;
    this.baseURL = config.baseURL;
    this.logPrefix = SoundsRepository.prefixCurator(config.logPrefix);
    this.warnPrefix = SoundsRepository.prefixCurator(config.warnPrefix);
    this.errorPrefix = SoundsRepository.prefixCurator(config.errorPrefix);
    this.audioProcessor = window.OBSChat.audioProcessor as AudioProcessor;
    const audioProcessor = window.OBSChat.audioProcessor;
    if (!audioProcessor) {
      console.error("AudioProcessor no encontrado. Asegúrate de que el componente AudioProcessor esté inicializado antes de cargar los sonidos de " + this.name);
      return;
    }
    for (const [key, filename] of Object.entries(config.sounds)) {
      const url = this.baseURL + filename;
      audioProcessor.loadAudio(`${this.name}_${key}`, url);
    }
  }
  
  /**
   * Encola múltiples sonidos en secuencia añadiendo el alias del repositorio a cada palabra
   * 
   * @private
   * @param {string} message - Mensaje con nombres de sonidos separados por espacios
   * @returns {void}
   * @example
   * // Si el repositorio se llama "hl1_vox" y se llama con:
   * enqueWithAlias("beep online ready")
   * // Encolará: "hl1_vox_beep hl1_vox_online hl1_vox_ready"
   */
  private enqueWithAlias(message: string) {
    this.audioProcessor.enqueueAudios(message.split(" ").map(word => `${this.name}_${word}`).join(" "));
  }
  
  /**
   * Reproduce un sonido individual del repositorio
   * 
   * @public
   * @param {SoundName} soundName - Nombre del sonido a reproducir (sin el prefijo del repositorio)
   * @param {OnEndedCallback} [onEnded] - Callback que se ejecuta cuando termina la reproducción
   * @returns {void}
   * @example
   * repo.playSound("beep");
   * repo.playSound("warning", () => console.log("Advertencia reproducida"));
   */
  public playSound(soundName: SoundName, onEnded?: OnEndedCallback) {
    this.audioProcessor.playAudio(`${this.name}_${soundName}`, onEnded);
  }
  
  /**
   * Encola una secuencia de sonidos con el prefijo "log" configurado
   * 
   * @public
   * @param {string} message - Secuencia de nombres de sonidos separados por espacios
   * @returns {void}
   * @example
   * // Si logPrefix = "system_"
   * repo.log("initialized ready"); // Reproduce: "system_ initialized ready"
   */
  public log(message: string) {
    this.enqueWithAlias(`${this.logPrefix}${message}`);
  }
  
  /**
   * Encola una secuencia de sonidos con el prefijo "warn" configurado
   * 
   * @public
   * @param {string} message - Secuencia de nombres de sonidos separados por espacios
   * @returns {void}
   * @example
   * // Si warnPrefix = "warning "
   * repo.warn("low health"); // Reproduce: "warning low health"
   */
  public warn(message: string) {
    this.enqueWithAlias(`${this.warnPrefix}${message}`);
  }
  
  /**
   * Encola una secuencia de sonidos con el prefijo "error" configurado
   * 
   * @public
   * @param {string} message - Secuencia de nombres de sonidos separados por espacios
   * @returns {void}
   * @example
   * // Si errorPrefix = "error critical "
   * repo.error("shutdown"); // Reproduce: "error critical shutdown"
   */
  public error(message: string) {
    this.enqueWithAlias(`${this.errorPrefix}${message}`);
  }
}