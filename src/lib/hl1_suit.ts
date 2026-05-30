import type AudioProcessor from "@/components/audio_processor";

/**
 * Diccionario completo de sonidos del traje HEV de Half-Life 1
 * Cada entrada mapea un identificador a su archivo de audio correspondiente
 * 
 * @constant
 * @type {Record<string, string>}
 */
const hl1Suit: Record<string, string> = {
  "_comma": "_comma.wav",
  "_period": "_period.wav",
  "acquired": "acquired.wav",
  "activated": "activated.wav",
  "administering_medical": "administering_medical.wav",
  "adrenaline_shot": "adrenaline_shot.wav",
  "alert": "alert.wav",
  "am": "am.wav",
  "ammo_depleted": "ammo_depleted.wav",
  "ammo_pickup": "ammo_pickup.wav",
  "antidote_shot": "antidote_shot.wav",
  "antitoxin_shot": "antitoxin_shot.wav",
  "armor_compromised": "armor_compromised.wav",
  "armor_gone": "armor_gone.wav",
  "atmospherics_on": "atmospherics_on.wav",
  "automedic_on": "automedic_on.wav",
  "beep": "beep.wav",
  "bell": "bell.wav",
  "bio_reading": "bio_reading.wav",
  "biohazard_detected": "biohazard_detected.wav",
  "bleeding_stopped": "bleeding_stopped.wav",
  "blip": "blip.wav",
  "blood_loss": "blood_loss.wav",
  "blood_plasma": "blood_plasma.wav",
  "blood_toxins": "blood_toxins.wav",
  "boop": "boop.wav",
  "buzz": "buzz.wav",
  "chemical_detected": "chemical_detected.wav",
  "communications_on": "communications_on.wav",
  "danger": "danger.wav",
  "deactivated": "deactivated.wav",
  "east": "east.wav",
  "eight": "eight.wav",
  "eighteen": "eighteen.wav",
  "eighty": "eighty.wav",
  "eleven": "eleven.wav",
  "evacuate_area": "evacuate_area.wav",
  "fifteen": "fifteen.wav",
  "fifty": "fifty.wav",
  "five": "five.wav",
  "flatline": "flatline.wav",
  "four": "four.wav",
  "fourteen": "fourteen.wav",
  "fourty": "fourty.wav",
  "fuzz": "fuzz.wav",
  "get_44ammo": "get_44ammo.wav",
  "get_44pistol": "get_44pistol.wav",
  "get_9mmclip": "get_9mmclip.wav",
  "get_alien_wpn": "get_alien_wpn.wav",
  "get_assault": "get_assault.wav",
  "get_assaultgren": "get_assaultgren.wav",
  "get_battery": "get_battery.wav",
  "get_bolts": "get_bolts.wav",
  "get_buckshot": "get_buckshot.wav",
  "get_crossbow": "get_crossbow.wav",
  "get_egon": "get_egon.wav",
  "get_egonpower": "get_egonpower.wav",
  "get_gauss": "get_gauss.wav",
  "get_grenade": "get_grenade.wav",
  "get_medkit": "get_medkit.wav",
  "get_pistol": "get_pistol.wav",
  "get_rpg": "get_rpg.wav",
  "get_rpgammo": "get_rpgammo.wav",
  "get_satchel": "get_satchel.wav",
  "get_shotgun": "get_shotgun.wav",
  "get_tripmine": "get_tripmine.wav",
  "health_critical": "health_critical.wav",
  "health_dropping": "health_dropping.wav",
  "health_dropping2": "health_dropping2.wav",
  "heat_damage": "heat_damage.wav",
  "hev_critical_fail": "hev_critical_fail.wav",
  "hev_damage": "hev_damage.wav",
  "hev_general_fail": "hev_general_fail.wav",
  "hev_logon": "hev_logon.wav",
  "hev_shutdown": "hev_shutdown.wav",
  "hiss": "hiss.wav",
  "hours": "hours.wav",
  "immediately": "immediately.wav",
  "innsuficient_medical": "innsuficient_medical.wav",
  "internal_bleeding": "internal_bleeding.wav",
  "major_fracture": "major_fracture.wav",
  "major_lacerations": "major_lacerations.wav",
  "medical_repaired": "medical_repaired.wav",
  "meters": "meters.wav",
  "minor_fracture": "minor_fracture.wav",
  "minor_lacerations": "minor_lacerations.wav",
  "minutes": "minutes.wav",
  "morphine_shot": "morphine_shot.wav",
  "munitionview_on": "munitionview_on.wav",
  "near_death": "near_death.wav",
  "nine": "nine.wav",
  "nineteen": "nineteen.wav",
  "ninety": "ninety.wav",
  "north": "north.wav",
  "one": "one.wav",
  "onehundred": "onehundred.wav",
  "online": "online.wav",
  "pain_block": "pain_block.wav",
  "percent": "percent.wav",
  "pm": "pm.wav",
  "position": "position.wav",
  "power_below": "power_below.wav",
  "power_level_is": "power_level_is.wav",
  "power_restored": "power_restored.wav",
  "powerarmor_on": "powerarmor_on.wav",
  "powermove_on": "powermove_on.wav",
  "powermove_overload": "powermove_overload.wav",
  "radiation_detected": "radiation_detected.wav",
  "range": "range.wav",
  "remaining": "remaining.wav",
  "safe_day": "safe_day.wav",
  "seconds": "seconds.wav",
  "seek_medic": "seek_medic.wav",
  "seven": "seven.wav",
  "seventeen": "seventeen.wav",
  "seventy": "seventy.wav",
  "shock_damage": "shock_damage.wav",
  "six": "six.wav",
  "sixteen": "sixteen.wav",
  "sixty": "sixty.wav",
  "south": "south.wav",
  "targetting_system": "targetting_system.wav",
  "ten": "ten.wav",
  "thirteen": "thirteen.wav",
  "thirty": "thirty.wav",
  "three": "three.wav",
  "time_is_now": "time_is_now.wav",
  "time_remaining": "time_remaining.wav",
  "torniquette_applied": "torniquette_applied.wav",
  "twelve": "twelve.wav",
  "twenty": "twenty.wav",
  "twentyfive": "twentyfive.wav",
  "two": "two.wav",
  "vitalsigns_on": "vitalsigns_on.wav",
  "voice_off": "voice_off.wav",
  "voice_on": "voice_on.wav",
  "warning": "warning.wav",
  "weapon_pickup": "weapon_pickup.wav",
  "weaponselect_on": "weaponselect_on.wav",
  "west": "west.wav",
  "wound_sterilized": "wound_sterilized.wav",
  "your": "your.wav",
}

/**
 * URL base del CDN con los archivos de audio del traje HEV de Half-Life 1
 * @constant
 * @type {string}
 */
const hl1SuitBaseURL = "https://github.com/sourcesounds/hl1/raw/refs/heads/master/sound/fvox/"

/**
 * Clase Singleton para gestionar el sistema de voz del traje HEV de Half-Life 1
 * 
 * Proporciona funcionalidad para reproducir mensajes del traje HEV (Hazardous Environment Suit)
 * original de Half-Life 1. Los audios incluyen alertas de salud, advertencias y notificaciones
 * del sistema del traje. Los audios se cargan desde un CDN de GitHub.
 * 
 * @class HL1Suit
 * @pattern Singleton
 * 
 * @example
 * ```typescript
 * // Cargar e inicializar la instancia
 * HL1Suit.loadHL1SuitInstance();
 * 
 * // Usar la instancia
 * const suit = window.OBSChat.hl1Suit;
 * suit.log("power level is fifty percent");
 * suit.warn("health critical seek medic");
 * suit.error("warning evacuate area immediately");
 * ```
 */
export default class HL1Suit {
  /**
   * Instancia única de la clase (patrón Singleton)
   * @private
   * @static
   * @type {HL1Suit | null}
   */
  private static instance: HL1Suit | null = null;
  
  /**
   * Alias usado para prefijo de audios (evita colisiones de nombres)
   * @private
   * @type {string}
   */
  private alias: string = "hl1Suit"
  
  /**
   * Referencia al AudioProcessor para reproducción de audios
   * @private
   * @type {AudioProcessor}
   */
  private audioProcessor: AudioProcessor
  
  /**
   * Constructor privado (Singleton)
   * Carga todos los audios del traje HEV en el AudioProcessor y reproduce un mensaje de bienvenida
   * @private
   * @constructor
   */
  private constructor() {
    this.audioProcessor = window.OBSChat.audioProcessor as AudioProcessor;
    const audioProcessor = window.OBSChat.audioProcessor;
    if (!audioProcessor) {
      console.error("AudioProcessor no encontrado. Asegúrate de que el componente AudioProcessor esté inicializado antes de cargar los sonidos de HL1.");
      return;
    }
    for (const [key, filename] of Object.entries(hl1Suit)) {
      const url = hl1SuitBaseURL + filename;
      audioProcessor.loadAudio(`${this.alias}_${key}`, url);
    }
    this.warn("communications_on voice_on safe_day");
  }
  
  /**
   * Obtiene la instancia única de HL1Suit (patrón Singleton)
   * Si no existe, la crea
   * 
   * @static
   * @returns {HL1Suit} La instancia única de HL1Suit
   * @public
   */
  public static getInstance(): HL1Suit {
    if (!HL1Suit.instance) {
      HL1Suit.instance = new HL1Suit();
    }
    return HL1Suit.instance;
  }
  
  /**
   * Carga e inicializa la instancia de HL1Suit en el sistema global
   * Si ya existe una instancia, no hace nada
   * 
   * @static
   * @public
   */
  public static loadHL1SuitInstance() {
    if (!window.OBSChat.hl1Suit) {
      console.log("Cargando instancia de HL1Suit...");
      window.OBSChat.hl1Suit = HL1Suit.getInstance();
    }
  }
  
  /**
   * Encola palabras con el alias prefijado para evitar colisiones
   * 
   * @private
   * @param {string} message - String con palabras separadas por espacios
   */
  private enqueWithAlias(message: string) {
    this.audioProcessor.enqueueAudios(message.split(" ").map(word => `${this.alias}_${word}`).join(" "));
  }
  
  /**
   * Reproduce un mensaje informativo con prefijo de sonido "boop"
   * 
   * @param {string} message - Mensaje a reproducir (palabras separadas por espacios)
   * @public
   * 
   * @example
   * ```typescript
   * suit.log("power restored");
   * // Reproduce: "boop" + "power" + "restored"
   * ```
   */
  public log(message: string) {
    this.enqueWithAlias(`boop ${message}`);
  }
  
  /**
   * Reproduce un mensaje de advertencia con prefijo de sonido "fuzz fuzz"
   * 
   * @param {string} message - Mensaje de advertencia a reproducir (palabras separadas por espacios)
   * @public
   * 
   * @example
   * ```typescript
   * suit.warn("health critical seek medic");
   * // Reproduce: "fuzz" + "fuzz" + "health" + "critical" + "seek" + "medic"
   * ```
   */
  public warn(message: string) {
    this.enqueWithAlias(`fuzz fuzz ${message}`);
  }
  
  /**
   * Reproduce un mensaje de error con prefijo de sonido "buzz buzz"
   * 
   * @param {string} message - Mensaje de error a reproducir (palabras separadas por espacios)
   * @public
   * 
   * @example
   * ```typescript
   * suit.error("warning evacuate area immediately");
   * // Reproduce: "buzz" + "buzz" + "warning" + "evacuate" + "area" + "immediately"
   * ```
   */
  public error(message: string) {
    this.enqueWithAlias(`buzz buzz ${message}`);
  }
}