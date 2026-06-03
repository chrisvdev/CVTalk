import SoundsBank from "@/lib/sounds_bank";
import useTemplate from "@/lib/use_template";

/**
 * Diccionario que mapea nombres de audios a sus URLs
 * @typedef {Record<string, string>} AudioBank
 */
type AudioRegister = Record<string, string>;

export type OnEndedCallback = () => void;
type OnEndedQueueCallbacks = OnEndedCallback[];

/**
 * Custom Element para gestión centralizada de reproducción de audio
 *
 * Proporciona un sistema completo de carga, reproducción y cola de audios
 * con manejo automático de políticas de autoplay de navegadores modernos.
 *
 * @class AudioProcessor
 * @extends {HTMLElement}
 *
 * @example
 * ```typescript
 * const processor = window.OBSChat.audioProcessor;
 *
 * // Cargar un audio
 * processor.loadAudio("notification", "/assets/notification.mp3");
 *
 * // Reproducir un audio
 * processor.playAudio("notification");
 *
 * // Reproducir múltiples audios en secuencia
 * processor.enqueueAudios("audio1 audio2 audio3");
 * ```
 */
export default class AudioProcessor extends HTMLElement {
  /**
   * Banco de audios cargados (nombre -> URL)
   * @private
   * @type {AudioRegister}
   */
  private audioRegister: AudioRegister = {};

  /**
   * Cola de nombres de audios pendientes de reproducción
   * @private
   * @type {string[]}
   */
  private audioQueue: string[] = [];

  /**
   * Indica si hay un audio reproduciéndose actualmente de la cola
   * @private
   * @type {boolean}
   */
  private isPlaying: boolean = false;

  /**
   * Nivel de volumen para todos los audios (0.0 - 1.0)
   * @private
   * @type {number}
   */
  private _volume: number = 1;

  /**
   * Elemento de aviso visible mientras el audio está bloqueado.
   * Se elimina tras la primera interacción válida del usuario.
   * @private
   * @type {HTMLSpanElement | null}
   */
  private audioUnlocked: HTMLSpanElement | null = null;

  private soundBank: SoundsBank = SoundsBank.getInstance();

  private onEndedCallbacks: OnEndedQueueCallbacks = [];

  /**
   * Crea una instancia de AudioProcessor
   * Configura el template, inicializa el sistema de desbloqueo de audio
   * y registra la instancia globalmente
   * @constructor
   */
  constructor() {
    super();
    useTemplate(this, "#audio_processor", ".audio_processor");
    this.loadAudio(
      "_comma",
      "https://github.com/sourcesounds/hl1/raw/refs/heads/master/sound/vox/_comma.wav",
    );
    this.unlockAudio(); // Configurar desbloqueo de audio en la primera interacción
    window.OBSChat.audioProcessor = this; // Registrar instancia en el sistema global tipado
    this.audioUnlocked = document.createElement("span");
    this.audioUnlocked.innerHTML =
      "¡Audio Locked!<br>Click to anywhere to unlock";
    this.audioUnlocked.style.textAlign = "center";
    this.audioUnlocked.style.position = "fixed";
    this.audioUnlocked.style.top = "50%";
    this.audioUnlocked.style.left = "50%";
    this.audioUnlocked.style.transform = "translate(-50%, -50%)";
    this.audioUnlocked.style.backgroundColor = "#f00";
    this.audioUnlocked.style.color = "#fff";
    this.audioUnlocked.style.padding = ".5rem 1rem";
    this.audioUnlocked.style.borderRadius = "0.5rem";
    this.audioUnlocked.style.fontSize = "2rem";
    this.audioUnlocked.style.zIndex = "10000";
    this.audioUnlocked.style.fontFamily = "monospace";
    document.body.appendChild(this.audioUnlocked);
  }

  /**
   * Carga un archivo de audio en el banco de audios
   * Si ya existe un audio con el mismo nombre, será sobrescrito
   *
   * @param {string} name - Identificador único para el audio
   * @param {string} url - URL del archivo de audio a cargar
   * @public
   *
   * @example
   * ```typescript
   * processor.loadAudio("beep", "/assets/beep.mp3");
   * ```
   */
  public loadAudio(name: string, url: string) {
    if (this.audioRegister[name]) {
      console.warn(
        `Audio with name "${name}" already exists. It will be overwritten.`,
      );
    }
    this.audioRegister[name] = url;
  }

  /**
   * Reproduce un audio de forma inmediata (sin cola)
   * Si el audio no está desbloqueado, muestra una advertencia
   *
   * @param {string} name - Nombre del audio a reproducir
   * @param {() => void} [onEnded] - Callback opcional a ejecutar cuando termine la reproducción
   * @public
   *
   * @example
   * ```typescript
   * processor.playAudio("notification", () => {
   *   console.log("Notificación reproducida");
   * });
   * ```
   */
  public playAudio(name: string, onEnded?: OnEndedCallback) {
    if (!this.audioUnlocked) {
      console.warn(
        "Audio is locked. Please interact with the page to unlock it.",
      );
      if (onEnded) onEnded();
      return;
    }
    const audio = this.audioRegister[name]
      ? new Audio(this.audioRegister[name])
      : null;
    if (!audio) {
      console.error(`Audio with name "${name}" not found.`);
      if (onEnded) onEnded();
      return;
    }
    audio.currentTime = 0;
    audio.volume = this.volume;
    const cb = () => {
      if (onEnded) onEnded();
      audio.removeEventListener("ended", cb);
      audio.remove();
    };
    audio.addEventListener("ended", cb, { once: true });
    audio.play().catch((error) => {
      console.error(`Failed to play audio "${name}":`, error);
    });
  }

  /**
   * Reproduce audios de la cola de forma secuencial
   * Solo inicia si no hay audio reproduciéndose y hay audios en cola
   *
   * @private
   */
  private playFromQueue() {
    if (!this.audioUnlocked) {
      console.warn(
        "Audio is locked. Please interact with the page to unlock it.",
      );
      return;
    }
    if (this.isPlaying || this.audioQueue.length === 0) return;
    const nextAudioName = this.audioQueue.shift();
    if (nextAudioName) {
      this.isPlaying = true;
      this.playAudio(nextAudioName, () => {
        this.isPlaying = false;
        this.playFromQueue();
      });
    } else {
      this.isPlaying = false;
      while (this.onEndedCallbacks.length > 0) {
        const callback = this.onEndedCallbacks.shift();
        if (callback) callback();
      }
    }
  }

  /**
   * Agrega un audio a la cola de reproducción
   * Los audios se reproducen secuencialmente en orden de llegada
   *
   * @param {string} name - Nombre del audio a encolar
   * @public
   *
   * @example
   * ```typescript
   * processor.enqueueAudio("beep");
   * processor.enqueueAudio("notification");
   * // Se reproducirán uno después del otro
   * ```
   */
  public enqueueAudio(name: string, onEnded?: OnEndedCallback) {
    this.audioQueue.push(name);
    if (onEnded) this.onEndedCallbacks.push(onEnded);
    this.playFromQueue();
  }

  /**
   * Agrega múltiples audios a la cola desde un string separado por espacios
   * Útil para reproducir secuencias de audios de forma declarativa
   *
   * @param {string} names - String con nombres de audios separados por espacios
   * @public
   *
   * @example
   * ```typescript
   * processor.enqueueAudios("hello world welcome");
   * // Se reproducirán "hello", "world", "welcome" en secuencia
   * ```
   */
  public enqueueAudios(names: string, onEnded?: OnEndedCallback) {
    this.audioQueue.push(...names.split(" ").map((n) => n.trim()));
    if (onEnded) this.onEndedCallbacks.push(onEnded);
    this.playFromQueue();
  }

  /**
   * Getter para verificar si el audio ha sido desbloqueado
   * @returns {boolean} true si el audio está desbloqueado
   * @public
   */
  public get isAudioUnlocked(): boolean {
    return !this.audioUnlocked;
  }

  /**
   * Limpia la cola de audios pendientes
   * No detiene el audio actual si está reproduciéndose
   * @public
   */
  public clearQueue() {
    this.audioQueue = [];
  }

  /**
   * Detiene todos los audios y limpia la cola
   * Pausa y elimina todos los elementos de audio activos
   * @public
   */
  public stopAll() {
    this.clearQueue();
    Array.from(this.children).forEach((child) => {
      if (child instanceof HTMLAudioElement) {
        child.pause();
        child.currentTime = 0;
        child.remove();
      }
    });
    this.isPlaying = false;
  }

  /**
   * Establece el nivel de volumen para todos los audios
   * El valor se limita automáticamente al rango 0.0 - 1.0
   *
   * @param {number} volume - Nivel de volumen (0.0 = silencio, 1.0 = máximo)
   * @public
   */
  public set volume(volume: number) {
    this._volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Obtiene el nivel de volumen actual
   * @returns {number} Nivel de volumen (0.0 - 1.0)
   * @public
   */
  public get volume(): number {
    return this._volume;
  }

  /**
   * Configura listeners para desbloquear el audio en la primera interacción del usuario
   * Necesario para cumplir con las políticas de autoplay de los navegadores modernos
   *
   * Intenta reproducir un audio silencioso mínimo en respuesta a eventos de usuario
   * (click, touchstart, keydown) para desbloquear el contexto de audio del navegador.
   *
   * @private
   */
  private unlockAudio() {
    const unlock = async () => {
      try {
        // Crear un audio temporal vacío solo para desbloquear el contexto
        const tempAudio = new Audio();
        tempAudio.src =
          "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
        tempAudio.volume = 0;

        await tempAudio.play();
        tempAudio.pause();
        tempAudio.remove();

        if (this.audioUnlocked) {
          this.audioUnlocked.remove();
          this.audioUnlocked = null;
        }
        console.log("Audio desbloqueado correctamente");

        // Remover listeners una vez desbloqueado
        document.removeEventListener("click", unlock);
        document.removeEventListener("touchstart", unlock);
        document.removeEventListener("keydown", unlock);
        this.playFromQueue(); // Intentar reproducir cualquier audio en cola después de desbloquear
      } catch (error) {
        console.log(
          "Esperando interacción del usuario para desbloquear audio",
          error,
        );
      }
    };

    // Intentar desbloquear en múltiples eventos de usuario
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
  }
}

window.OBSChat.addCustomElement("audio-processor", AudioProcessor);
