/**
 * Componente para gestionar y mostrar notificaciones de eventos de Twitch
 * @module components/notifications-view
 */

import SoundsBank, { type SoundRepositoryConfigUrl } from "@/lib/sounds_bank";
import type { SoundName } from "@/lib/sounds_repository";
import useTemplate from "@/lib/use_template";
import {
  client,
  type AnnouncementInfoType,
  type BanInfoType,
  type BitsInfoType,
  type ClearChatInfoType,
  type ClearMsgInfoType,
  type CommunityPayforwardInfoType,
  type GiftInfoType,
  type GiftPaidUpgradeInfoType,
  type MysteryGiftInfoType,
  type NoticeGroupType,
  type PrimePaidUpgradeInfoType,
  type RaidInfoType,
  type RoomStateInfoType,
  type StandardPayforwardInfoType,
  type SubInfoType,
  type SubNoticeType,
  type TimeoutInfoType,
  type UserMessageInfoType,
  type ViewerMilestoneType,
} from "mtmi";

/**
 * Configuración individual para una notificación
 * @typedef {Object} Notificationconfig
 * @property {string} messageTemplate - Plantilla del mensaje a mostrar
 * @property {SoundName[]} [soundEffect] - Efectos de sonido opcionales a reproducir
 */
export type Notificationconfig = {
  messageTemplate: string;
  soundEffect?: SoundName[];
};
/**
 * Configuración completa de todas las notificaciones de Twitch
 * @typedef {Object} NotificationsConfig
 * @property {SoundRepositoryConfigUrl} [soundsRepositoryUrl] - URL del repositorio de sonidos
 * @property {Notificationconfig} onSub - Configuración para suscripciones
 * @property {Notificationconfig} onResub - Configuración para resuscripciones
 * @property {Notificationconfig} onSubGift - Configuración para regalos de suscripción
 * @property {Notificationconfig} onSubMysteryGift - Configuración para regalos misteriosos
 * @property {Notificationconfig} onPrimePaidUpgrade - Configuración para upgrades Prime
 * @property {Notificationconfig} onCommunityPayforward - Configuración para pagos adelantados de comunidad
 * @property {Notificationconfig} onStandardPayforward - Configuración para pagos adelantados estándar
 * @property {Notificationconfig} onGiftPaidUpgrade - Configuración para upgrades de regalo
 * @property {Notificationconfig} onClearChat - Configuración para limpieza de chat
 * @property {Notificationconfig} onBan - Configuración para baneos
 * @property {Notificationconfig} onTimeout - Configuración para timeouts
 * @property {Notificationconfig} onClearMsg - Configuración para mensajes eliminados
 * @property {Notificationconfig} onRaid - Configuración para raids
 * @property {Notificationconfig} onViewerMilestone - Configuración para hitos de espectadores
 * @property {Notificationconfig} onRoomState - Configuración para cambios de estado de sala
 * @property {Notificationconfig} onAnnouncement - Configuración para anuncios
 * @property {Notificationconfig} onBits - Configuración para bits
 * @property {Notificationconfig} onAction - Configuración para acciones
 * @property {Notificationconfig} onEmoteOnlyOn - Configuración para activación de modo emote-only
 * @property {Notificationconfig} onEmoteOnlyOff - Configuración para desactivación de modo emote-only
 * @property {Notificationconfig} onFollowersOn - Configuración para activación de modo followers
 * @property {Notificationconfig} onFollowersOff - Configuración para desactivación de modo followers
 * @property {Notificationconfig} onSlowOn - Configuración para activación de modo lento
 * @property {Notificationconfig} onSlowOff - Configuración para desactivación de modo lento
 * @property {Notificationconfig} onSubsOn - Configuración para activación de modo suscriptores
 * @property {Notificationconfig} onSubsOff - Configuración para desactivación de modo suscriptores
 * @property {Notificationconfig} onR9kOn - Configuración para activación de modo R9K
 * @property {Notificationconfig} onR9kOff - Configuración para desactivación de modo R9K
 * @property {Notificationconfig} onRaw - Configuración para eventos raw
 */
export type NotificationsConfig = {
  soundsRepositoryUrl?: SoundRepositoryConfigUrl;
  onSub: Notificationconfig;
  onResub: Notificationconfig;
  onSubGift: Notificationconfig;
  onSubMysteryGift: Notificationconfig;
  onPrimePaidUpgrade: Notificationconfig;
  onCommunityPayforward: Notificationconfig;
  onStandardPayforward: Notificationconfig;
  onGiftPaidUpgrade: Notificationconfig;
  onClearChat: Notificationconfig;
  onBan: Notificationconfig;
  onTimeout: Notificationconfig;
  onClearMsg: Notificationconfig;
  onRaid: Notificationconfig;
  onViewerMilestone: Notificationconfig;
  onRoomState: Notificationconfig;
  onAnnouncement: Notificationconfig;
  onBits: Notificationconfig;
  onAction: Notificationconfig;
  onEmoteOnlyOn: Notificationconfig;
  onEmoteOnlyOff: Notificationconfig;
  onFollowersOn: Notificationconfig;
  onFollowersOff: Notificationconfig;
  onSlowOn: Notificationconfig;
  onSlowOff: Notificationconfig;
  onSubsOn: Notificationconfig;
  onSubsOff: Notificationconfig;
  onR9kOn: Notificationconfig;
  onR9kOff: Notificationconfig;
  onRaw: Notificationconfig;
};

/**
 * URL de configuración de notificaciones (puede ser relativa o absoluta)
 * @typedef {string} NotificationsConfigUrl
 */
export type NotificationsConfigUrl = string;

/**
 * URL base por defecto para cargar configuraciones de notificaciones desde GitHub
 * @constant {string}
 */
export const defaultNotificationsConfigUrl =
  "https://raw.githubusercontent.com/chrisvdev/CVTalk/refs/heads/main/default_config_files/";

/**
 * Custom element para gestionar y mostrar notificaciones de eventos de Twitch
 * 
 * Escucha todos los eventos de Twitch (suscripciones, raids, bits, etc.) y
 * los procesa según la configuración cargada desde un archivo JSON.
 * 
 * @class NotificationsView
 * @extends {HTMLElement}
 * @example
 * // En HTML
 * <notifications-view></notifications-view>
 * 
 * // En TypeScript
 * const notificationsView = document.querySelector('notifications-view');
 */
export default class NotificationsView extends HTMLElement {
  /**
   * Instancia singleton del banco de sonidos
   * @private
   * @type {SoundsBank}
   */
  private soundsBank = SoundsBank.getInstance();
  
  /**
   * Configuración de notificaciones cargada
   * @private
   * @type {NotificationsConfig | null}
   */
  private config: NotificationsConfig | null = null;
  
  /**
   * Valida que la configuración de notificaciones tenga todos los campos requeridos
   * @private
   * @static
   * @param {NotificationsConfig} config - Configuración a validar
   * @returns {boolean} true si la configuración es válida, false en caso contrario
   */
  private static validateConfig(config: NotificationsConfig): boolean {
    if (!config) {
      console.error(
        "Invalid notifications config: Config object is null or undefined.",
      );
      return false;
    }
    const requiredFields: Array<
      Exclude<keyof NotificationsConfig, "soundsRepositoryUrl">
    > = [
      "onSub",
      "onResub",
      "onSubGift",
      "onSubMysteryGift",
      "onPrimePaidUpgrade",
      "onCommunityPayforward",
      "onStandardPayforward",
      "onGiftPaidUpgrade",
      "onClearChat",
      "onBan",
      "onTimeout",
      "onClearMsg",
      "onRaid",
      "onViewerMilestone",
      "onRoomState",
      "onAnnouncement",
      "onBits",
      "onAction",
      "onEmoteOnlyOn",
      "onEmoteOnlyOff",
      "onFollowersOn",
      "onFollowersOff",
      "onSlowOn",
      "onSlowOff",
      "onSubsOn",
      "onSubsOff",
      "onR9kOn",
      "onR9kOff",
      "onRaw",
    ];
    for (const field of requiredFields) {
      if (!(field in config)) {
        console.error(
          `Invalid notifications config: Missing required field '${field}'.`,
        );
        return false;
      }
      const fieldConfig = config[field];
      if (
        typeof fieldConfig !== "object" ||
        fieldConfig === null ||
        !("messageTemplate" in fieldConfig)
      ) {
        console.error(
          `Invalid notifications config: Field '${field}' must be an object with a 'messageTemplate' property.`,
        );
        return false;
      }
    }
    return true;
  }
  
  /**
   * Constructor del elemento custom NotificationsView
   * Inicializa el template, carga la configuración y registra todos los event listeners
   */
  constructor() {
    super();
    useTemplate(this, "#notifications-view", ".notifications-view");
    this.loadNotificationsConfig();
    client.on("sub", this.onSub.bind(this));
    client.on("resub", this.onResub.bind(this));
    client.on("subgift", this.onSubGift.bind(this));
    client.on("submysterygift", this.onSubMysteryGift.bind(this));
    client.on("communitypayforward", this.onCommunityPayforward.bind(this));
    client.on("standardpayforward", this.onStandardPayforward.bind(this));
    client.on("giftpaidupgrade", this.onGiftPaidUpgrade.bind(this));
    client.on("primepaidupgrade", this.onPrimePaidUpgrade.bind(this));
    client.on("clearchat", this.onClearChat.bind(this));
    client.on("ban", this.onBan.bind(this));
    client.on("timeout", this.onTimeout.bind(this));
    client.on("clearmsg", this.onClearMsg.bind(this));
    client.on("raid", this.onRaid.bind(this));
    client.on("viewermilestone", this.onViewerMilestone.bind(this));
    client.on("roomstate", this.onRoomState.bind(this));
    client.on("announcement", this.onAnnouncement.bind(this));
    client.on("bits", this.onBits.bind(this));
    client.on("action", this.onAction.bind(this));
    // MODES
    client.on("emote_only_on", this.onEmoteOnlyOn.bind(this));
    client.on("emote_only_off", this.onEmoteOnlyOff.bind(this));
    client.on("followers_on", this.onFollowersOn.bind(this));
    client.on("followers_off", this.onFollowersOff.bind(this));
    client.on("slow_on", this.onSlowOn.bind(this));
    client.on("slow_off", this.onSlowOff.bind(this));
    client.on("subs_on", this.onSubsOn.bind(this));
    client.on("subs_off", this.onSubsOff.bind(this));
    client.on("r9k_on", this.onR9kOn.bind(this));
    client.on("r9k_off", this.onR9kOff.bind(this));
    client.on("raw", this.onRaw.bind(this));
  }
  
  /**
   * Carga la configuración de notificaciones desde una URL
   * @private
   * @param {NotificationsConfigUrl} url - URL relativa o absoluta del archivo de configuración
   * @returns {void}
   */
  private loadNotificationsConfig(
    url: NotificationsConfigUrl = "notifications",
  ) {
    const fullUrl = url.startsWith("http")
      ? url
      : `${defaultNotificationsConfigUrl}${url}.json`;
    fetch(fullUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load notifications config from ${fullUrl}: ${response.status} ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((config) => {
        if (NotificationsView.validateConfig(config)) {
          this.config = config;
          console.log(
            `Notifications config loaded successfully from ${fullUrl}.`,
          );
          if (config.soundsRepositoryUrl) {
            this.soundsBank.loadRepository(config.soundsRepositoryUrl);
          }
        } else {
          console.error(
            `Invalid notifications config at ${fullUrl}. Config not loaded.`,
          );
        }
      })
      .catch((error) => {
        console.error(
          `Error loading notifications config from ${fullUrl}:`,
          error,
        );
      });
  }
  
  /**
   * Maneja el evento de nueva suscripción
   * @private
   * @param {SubNoticeType} data - Información de la suscripción
   * @returns {void}
   */
  private onSub({
    messageInfo: { message },
    userInfo: { displayName },
  }: SubNoticeType) {
    console.debug("Not Implemented SUB: ", { message, displayName });
  }
  
  /**
   * Maneja el evento de resuscripción
   * @private
   * @param {SubInfoType} data - Información de la resuscripción
   * @returns {void}
   */
  private onResub(data: SubInfoType) {
    console.debug("Not Implemented RESUB: ", data);
  }
  
  /**
   * Maneja el evento de regalo de suscripción
   * @private
   * @param {GiftInfoType} data - Información del regalo
   * @returns {void}
   */
  private onSubGift(data: GiftInfoType) {
    console.debug("Not Implemented SUBGIFT: ", data);
  }
  
  /**
   * Maneja el evento de regalo misterioso de suscripciones
   * @private
   * @param {MysteryGiftInfoType} data - Información del regalo misterioso
   * @returns {void}
   */
  private onSubMysteryGift(data: MysteryGiftInfoType) {
    console.debug("Not Implemented SUBMYSTERYGIFT: ", data);
  }
  
  /**
   * Maneja el evento de upgrade de suscripción Prime
   * @private
   * @param {PrimePaidUpgradeInfoType} data - Información del upgrade
   * @returns {void}
   */
  private onPrimePaidUpgrade(data: PrimePaidUpgradeInfoType) {
    console.debug("Not Implemented PRIMEPAIDUPGRADE: ", data);
  }
  
  /**
   * Maneja el evento de pago adelantado de comunidad
   * @private
   * @param {CommunityPayforwardInfoType} data - Información del pago
   * @returns {void}
   */
  private onCommunityPayforward(data: CommunityPayforwardInfoType) {
    console.debug("Not Implemented COMMUNITYPAYFORWARD: ", data);
  }
  
  /**
   * Maneja el evento de pago adelantado estándar
   * @private
   * @param {StandardPayforwardInfoType} data - Información del pago
   * @returns {void}
   */
  private onStandardPayforward(data: StandardPayforwardInfoType) {
    console.debug("Not Implemented STANDARDPAYFORWARD: ", data);
  }
  
  /**
   * Maneja el evento de upgrade pagado de regalo
   * @private
   * @param {GiftPaidUpgradeInfoType} data - Información del upgrade
   * @returns {void}
   */
  private onGiftPaidUpgrade(data: GiftPaidUpgradeInfoType) {
    console.debug("Not Implemented GIFTPAIDUPGRADE: ", data);
  }
  
  /**
   * Maneja el evento de limpieza de chat
   * @private
   * @param {ClearChatInfoType} data - Información de la limpieza
   * @returns {void}
   */
  private onClearChat(data: ClearChatInfoType) {
    console.debug("Not Implemented CLEARCHAT: ", data);
  }
  
  /**
   * Maneja el evento de baneo de usuario
   * @private
   * @param {BanInfoType} data - Información del baneo
   * @returns {void}
   */
  private onBan(data: BanInfoType) {
    console.debug("Not Implemented BAN: ", data);
  }
  
  /**
   * Maneja el evento de timeout de usuario
   * @private
   * @param {TimeoutInfoType} data - Información del timeout
   * @returns {void}
   */
  private onTimeout(data: TimeoutInfoType) {
    console.debug("Not Implemented TIMEOUT: ", data);
  }
  
  /**
   * Maneja el evento de eliminación de mensaje
   * @private
   * @param {ClearMsgInfoType} data - Información del mensaje eliminado
   * @returns {void}
   */
  private onClearMsg(data: ClearMsgInfoType) {
    console.debug("Not Implemented CLEARMSG: ", data);
  }
  
  /**
   * Maneja el evento de raid
   * @private
   * @param {RaidInfoType} data - Información del raid
   * @returns {void}
   */
  private onRaid(data: RaidInfoType) {
    console.debug("Not Implemented RAID: ", data);
  }
  
  /**
   * Maneja el evento de hito de espectador
   * @private
   * @param {ViewerMilestoneType} data - Información del hito
   * @returns {void}
   */
  private onViewerMilestone(data: ViewerMilestoneType) {
    console.debug("Not Implemented VIEWERMILESTONE: ", data);
  }
  
  /**
   * Maneja el evento de cambio de estado de sala
   * @private
   * @param {RoomStateInfoType} data - Información del estado de sala
   * @returns {void}
   */
  private onRoomState(data: RoomStateInfoType) {
    console.debug("Not Implemented ROOMSTATE: ", data);
  }
  
  /**
   * Maneja el evento de anuncio
   * @private
   * @param {AnnouncementInfoType} data - Información del anuncio
   * @returns {void}
   */
  private onAnnouncement(data: AnnouncementInfoType) {
    console.debug("Not Implemented ANNOUNCEMENT: ", data);
  }
  
  /**
   * Maneja el evento de bits (Cheers)
   * @private
   * @param {BitsInfoType} data - Información de los bits
   * @returns {void}
   */
  private onBits(data: BitsInfoType) {
    console.debug("Not Implemented BITS: ", data);
  }
  
  /**
   * Maneja el evento de acción (/me)
   * @private
   * @param {UserMessageInfoType} data - Información del mensaje de acción
   * @returns {void}
   */
  private onAction(data: UserMessageInfoType) {
    console.debug("Not Implemented ACTION: ", data);
  }
  
  /**
   * Maneja la activación del modo solo emotes
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onEmoteOnlyOn(data: NoticeGroupType) {
    console.debug("Not Implemented EMOTE_ONLY_ON: ", data);
  }
  
  /**
   * Maneja la desactivación del modo solo emotes
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onEmoteOnlyOff(data: NoticeGroupType) {
    console.debug("Not Implemented EMOTE_ONLY_OFF: ", data);
  }
  
  /**
   * Maneja la activación del modo solo seguidores
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onFollowersOn(data: NoticeGroupType) {
    console.debug("Not Implemented FOLLOWERS_ON: ", data);
  }
  
  /**
   * Maneja la desactivación del modo solo seguidores
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onFollowersOff(data: NoticeGroupType) {
    console.debug("Not Implemented FOLLOWERS_OFF: ", data);
  }
  
  /**
   * Maneja la activación del modo lento
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onSlowOn(data: NoticeGroupType) {
    console.debug("Not Implemented SLOW_ON: ", data);
  }
  
  /**
   * Maneja la desactivación del modo lento
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onSlowOff(data: NoticeGroupType) {
    console.debug("Not Implemented SLOW_OFF: ", data);
  }
  
  /**
   * Maneja la activación del modo solo suscriptores
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onSubsOn(data: NoticeGroupType) {
    console.debug("Not Implemented SUBS_ON: ", data);
  }
  
  /**
   * Maneja la desactivación del modo solo suscriptores
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onSubsOff(data: NoticeGroupType) {
    console.debug("Not Implemented SUBS_OFF: ", data);
  }
  
  /**
   * Maneja la activación del modo R9K (mensajes únicos)
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onR9kOn(data: NoticeGroupType) {
    console.debug("Not Implemented R9K_ON: ", data);
  }
  
  /**
   * Maneja la desactivación del modo R9K
   * @private
   * @param {NoticeGroupType} data - Información del cambio de modo
   * @returns {void}
   */
  private onR9kOff(data: NoticeGroupType) {
    console.debug("Not Implemented R9K_OFF: ", data);
  }
  
  /**
   * Maneja eventos raw (sin procesar) de IRC
   * @private
   * @param {object} data - Datos crudos del evento
   * @returns {void}
   */
  private onRaw(data: object) {
    console.debug("Not Implemented RAW: ", data);
  }
}

window.OBSChat.addCustomElement("notifications-view", NotificationsView);
