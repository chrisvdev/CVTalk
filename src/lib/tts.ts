/**
 * Tipo que mapea acentos de voz disponibles con el número de variantes.
 * @typedef {Object} Voices
 * @property {number} [key] - Número de variantes disponibles para un acento (ej: "es-AR": 3)
 */
type Voices = {
  [key: string]: number
}

/**
 * Tipo de callback que se ejecuta cuando las voces están listas.
 * @callback WhenReadyCallback
 * @param {Voices} voices - Objeto con las voces disponibles
 */
export type WhenReadyCallback = (voices: Voices) => void

/**
 * Gestor de síntesis de voz (TTS - Text To Speech).
 * Implementa patrón Singleton para gestionar la API de SpeechSynthesis del navegador.
 * Proporciona métodos para sintetizar voz con diferentes acentos y variantes.
 * 
 * @class TTS
 * @example
 * const tts = TTS.getInstance()
 * tts.whenReady((voices) => {
 *   console.log('Voces disponibles:', voices)
 *   tts.speak('Hola mundo', 'es-AR', 1)
 * })
 */
export default class TTS {
  private voices: Voices
  private onReady: WhenReadyCallback[]
  private ready: boolean
  private static instance: TTS | null = null
  
  /**
   * Constructor privado para implementar patrón Singleton.
   * Inicializa el sistema TTS y escucha el evento 'voiceschanged'.
   * @private
   */
  private constructor() {
    this.voices = {}
    this.onReady = []
    this.ready = false
    speechSynthesis.addEventListener(
      'voiceschanged',
      this.whenSinthReady.bind(this)
    )
  }

  /**
   * Obtiene la instancia única del TTS (Singleton).
   * @returns {TTS} La instancia única del gestor TTS
   * @static
   */
  static getInstance() {
    if (!TTS.instance) {
      TTS.instance = new TTS()
    }
    return TTS.instance
  }

  /**
   * Callback interno que se ejecuta cuando las voces del navegador están disponibles.
   * Cataloga todas las voces disponibles por acento e idioma.
   * @private
   */
  private whenSinthReady() {
    speechSynthesis.getVoices().forEach((voice) => {
      const { lang } = voice
      if (lang.length === 5) {
        if (this.voices[lang]) {
          this.voices[lang] += 1
        } else {
          this.voices[lang] = 1
        }
      }
      this.ready = true
      this.onReady.forEach((cb) => {
        cb(this.voices)
      })
      speechSynthesis.removeEventListener(
        'voiceschanged',
        this.whenSinthReady
      )
    })
  }

  /**
   * Sintetiza un mensaje de texto a voz.
   * @param {string} message - El texto a sintetizar
   * @param {string} accent - El acento/idioma de la voz (formato: xx-XX, ej: es-AR)
   * @param {number} variant - La variante de voz a usar (1-n)
   * @example
   * tts.speak('Hola mundo', 'es-AR', 1)
   */
  public speak(message: string, accent: string, variant: number) {
    const toSpeak = new SpeechSynthesisUtterance(message)
    toSpeak.voice = this.voices[accent]
      ? variant <= this.voices[accent]
        ? speechSynthesis.getVoices().filter((voice) => voice.lang === accent)[
        variant - 1
        ]
        : speechSynthesis
          .getVoices()
          .filter((voice) => voice.lang === accent)[0]
      : speechSynthesis.getVoices()[0]
    speechSynthesis.speak(toSpeak)
  }

  /**
   * Obtiene un clon del objeto de voces disponibles.
   * @returns {Voices} Objeto con las voces disponibles (acento -> cantidad de variantes)
   */
  public getVoices() {
    return structuredClone(this.voices)
  }

  /**
   * Registra un callback que se ejecutará cuando las voces estén disponibles.
   * Si ya están listas, ejecuta el callback inmediatamente.
   * @param {WhenReadyCallback} cb - Callback a ejecutar cuando las voces estén listas
   */
  public whenReady(cb: WhenReadyCallback) {
    if (this.ready) {
      cb(this.voices)
    } else {
      this.onReady.push(cb)
    }
  }

  /**
   * Valida si un acento/idioma está disponible en el sistema.
   * @param {string} voice - El acento a validar (formato: xx-XX)
   * @returns {boolean} true si el acento está disponible, false en caso contrario
   */
  public isAValidVoice(voice: string) {
    return Boolean(this.voices[voice])
  }

  /**
   * Valida si una variante de voz es válida para un acento específico.
   * @param {string} accent - El acento a verificar (formato: xx-XX)
   * @param {number} variant - El número de variante a validar
   * @returns {boolean} true si la variante es válida para ese acento, false en caso contrario
   */
  public isAValidVariant(accent: string, variant: number) {
    if (this.isAValidVoice(accent)) {
      return variant <= this.voices[accent] && variant > 0
    }
    return false
  }
}