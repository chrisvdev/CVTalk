import type { SoundRepositoryName } from "./sounds_repository";
import SoundsRepository from "./sounds_repository";

/**
 * Diccionario que mapea nombres de repositorios de sonidos a sus instancias
 * @typedef {Record<SoundRepositoryName, SoundsRepository>} Bank
 */
type Bank = Record<SoundRepositoryName, SoundsRepository>;

/**
 * URL de configuración de un repositorio de sonidos
 * Puede ser una URL completa o un nombre corto (se añadirá el prefijo base)
 * @typedef {string} SoundRepositoryConfigUrl
 * @example
 * "hl1_vox" // Se convierte a: https://raw.githubusercontent.com/chrisvdev/CVTalk/refs/heads/main/sounds_repositories/hl1_vox.json
 * "https://example.com/custom_sounds.json" // URL completa
 */
export type SoundRepositoryConfigUrl = string;

/**
 * Función callback que se ejecuta cuando un repositorio de sonidos ha sido cargado exitosamente
 * @callback SoundRepositoryOnLoadedCallback
 * @param {SoundsRepository} repository - Instancia del repositorio cargado
 * @returns {void}
 * @example
 * soundsBank.loadRepository("hl1_vox", (repo) => {
 *   repo.warn("system online");
 * });
 */
export type SoundRepositoryOnLoadedCallback = (repository: SoundsRepository) => void;

/**
 * URL base por defecto para cargar repositorios de sonidos desde GitHub
 * @constant {string}
 */
const defaultSoundsRepositoryBaseUrl = "https://raw.githubusercontent.com/chrisvdev/CVTalk/refs/heads/main/sounds_repositories/";

/**
 * Gestor centralizado de repositorios de sonidos (Patrón Singleton)
 * 
 * Permite cargar y gestionar múltiples repositorios de sonidos desde configuraciones JSON remotas.
 * Cada repositorio puede contener conjuntos de sonidos temáticos (ej: voces del HEV de Half-Life, VOX, etc.)
 * 
 * @class SoundsBank
 * @example
 * // Obtener la instancia única
 * const soundsBank = SoundsBank.getInstance();
 * 
 * // Cargar un repositorio por nombre corto
 * soundsBank.loadRepository("hl1_vox", (vox) => {
 *   vox.warn("system online");
 * });
 * 
 * // Cargar un repositorio desde URL completa
 * soundsBank.loadRepository("https://example.com/custom_sounds.json", (custom) => {
 *   custom.playSound("welcome");
 * });
 */
export default class SoundsBank {
  /**
   * Instancia única del SoundsBank (Singleton)
   * @private
   * @static
   * @type {SoundsBank | null}
   */
  private static instance: SoundsBank | null = null;
  
  /**
   * Banco de repositorios de sonidos cargados (nombre → instancia)
   * @private
   * @type {Bank}
   */
  private bank: Bank;
  
  /**
   * Constructor privado para implementar el patrón Singleton
   * @private
   */
  private constructor() {
    this.bank = {};
  }
  
  /**
   * Obtiene la instancia única del SoundsBank
   * Si no existe, la crea (Lazy initialization)
   * 
   * @static
   * @returns {SoundsBank} Instancia única del gestor de repositorios
   * @example
   * const soundsBank = SoundsBank.getInstance();
   */
  public static getInstance(): SoundsBank {
    if (!SoundsBank.instance) {
      SoundsBank.instance = new SoundsBank();
    }
    return SoundsBank.instance;
  }
  
  /**
   * Carga un repositorio de sonidos desde una URL o nombre corto
   * 
   * Si la URL no comienza con "http", se añade el prefijo base de GitHub.
   * Una vez cargado, valida la configuración y registra todos los sonidos en el AudioProcessor.
   * 
   * @public
   * @param {SoundRepositoryConfigUrl} url - URL completa o nombre del repositorio (ej: "hl1_vox")
   * @param {SoundRepositoryOnLoadedCallback} [onLoaded] - Callback que se ejecuta tras cargar exitosamente
   * @returns {void}
   * @example
   * // Cargar por nombre corto
   * soundsBank.loadRepository("hl1_vox", (vox) => {
   *   vox.log("system initialized");
   * });
   * 
   * // Cargar desde URL completa
   * soundsBank.loadRepository("https://cdn.example.com/sounds.json", (repo) => {
   *   repo.playSound("beep");
   * });
   */
  public loadRepository(url: SoundRepositoryConfigUrl, onLoaded?: SoundRepositoryOnLoadedCallback) {
    const fullUrl = url.startsWith("http") ? url : `${defaultSoundsRepositoryBaseUrl}${url}.json`;
    fetch(fullUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load sound repository config from ${fullUrl}: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((config) => {
        if (SoundsRepository.validateConfig(config)) {
          const repository = new SoundsRepository(config);
          this.bank[config.name] = repository;
          console.log(`Sound repository "${config.name}" loaded successfully from ${fullUrl}.`);
          if (onLoaded) onLoaded(repository);
        } else {
          console.error(`Invalid sound repository config at ${fullUrl}. Repository not loaded.`);
        }
      })
      .catch(error => {
        console.error("Error loading sound repository:", error);
      });
  }
}