import TTS from "./tts"

/**
 * Tipo que define la estructura del vault de configuraciones TTS por usuario
 * @typedef {Object} Vault
 * @property {Object} [userName] - Configuración específica del usuario
 * @property {string} [userName].accent - Acento de voz (formato: xx-XX)
 * @property {number} [userName].variant - Variante de voz (1-n)
 */
type Vault ={
  [userName: string]: {
    accent: string,
    variant: number
  }
}

const tts = TTS.getInstance()

/**
 * Gestor de configuraciones TTS personalizadas por usuario.
 * Implementa patrón Singleton para mantener un único vault de configuraciones
 * que persiste en localStorage.
 * 
 * @class TTSConfigVault
 * @example
 * const vault = TTSConfigVault.getInstance()
 * vault.setConfig('usuario123', 'es-AR', 2)
 * const config = vault.getConfig('usuario123')
 */
export default class TTSConfigVault {
  private _vault : Vault
  private vaultKey: string
  private static instance: TTSConfigVault | null = null
  
  /**
   * Constructor privado para implementar patrón Singleton.
   * Inicializa el vault desde localStorage o crea uno nuevo.
   * @private
   */
  private constructor() {
    this.vaultKey = 'CVTalk_vault'
    const vaultData = localStorage.getItem(this.vaultKey)
    if (vaultData) {
      this._vault = JSON.parse(vaultData)
    } else {
      this._vault = {}
      localStorage.setItem(this.vaultKey, '{}')
    }
  }

  /**
   * Obtiene la instancia única del TTSConfigVault (Singleton).
   * @returns {TTSConfigVault} La instancia única del vault
   * @static
   */
  public static getInstance() {
    if (!TTSConfigVault.instance) {
      TTSConfigVault.instance = new TTSConfigVault()
    }
    return TTSConfigVault.instance
  }

  /**
   * Getter que retorna el vault completo de configuraciones.
   * @returns {Vault} El objeto vault con todas las configuraciones de usuarios
   */
  public get vault() {
    return this._vault
  }

  /**
   * Persiste el vault actual en localStorage.
   * @private
   */
  private saveToLocalStorage() {
    localStorage.setItem(this.vaultKey, JSON.stringify(this._vault))
  }

  /**
   * Obtiene la configuración TTS de un usuario específico.
   * @param {string} username - El nombre del usuario
   * @returns {Object|null} La configuración del usuario o null si no existe
   */
  getConfig(username: string) {
    if (this.vault[username]) {
      return this.vault[username]
    } else return null
  }

  /**
   * Establece la configuración TTS para un usuario.
   * Valida que el acento y variante sean válidos antes de guardar.
   * @param {string} username - El nombre del usuario
   * @param {string} accent - El acento de voz (formato: xx-XX, ej: es-AR)
   * @param {number} variant - La variante de voz (1-n)
   */
  setConfig(username: string, accent: string, variant: number) {
    if (tts.isAValidVoice(accent)) {
      this._vault[username] = {
        accent,
        variant: tts.isAValidVariant(accent, variant) ? variant : 1
      }
      this.saveToLocalStorage()
    }
  }

  /**
   * Elimina la configuración TTS de un usuario específico.
   * @param {string} username - El nombre del usuario cuya configuración se eliminará
   */
  resetConfig(username: string) {
    if (this._vault[username]) {
      delete this._vault[username]
      this.saveToLocalStorage()
    }
  }
}
