/**
 * Configuración global de la aplicación OBSChat
 * Gestiona propiedades de la aplicación, registro de custom elements y almacenamiento de mensajes
 * @module scripts/global
 */

import type { UserMessageInfoType } from "mtmi"

/**
 * Propiedades globales de la aplicación OBSChat
 * @typedef {Object} Properties
 * @property {string} [channel] - Nombre del canal de Twitch
 * @property {number} messageTTL - Tiempo de vida de los mensajes en milisegundos
 * @property {boolean} pato_bot - Activar efecto PatoBot
 * @property {string} baseUrl - URL base de la aplicación (siempre termina con /)
 */
export type Properties = {
  channel?: string
  messageTTL: number
  pato_bot: boolean
  mute_bots: boolean
  baseUrl: string
}

export type Message = UserMessageInfoType & {
  /**
   * Función para eliminar el mensaje del registro global
   * @function
   * @returns {void}
   */
  delete: () => void
}

/**
 * Valores por defecto para las propiedades de la aplicación
 * @type {Properties}
 */
const defaultProperties: Properties = {
  messageTTL: 10000,
  pato_bot: false,
  mute_bots: false,
  baseUrl: '/' // Será sobrescrito por el valor inyectado desde Astro
}

/**
 * Convierte los parámetros de URL (strings) a sus tipos correctos
 * Determina automáticamente el tipo esperado basándose en los valores por defecto
 * Incluye todos los parámetros de URL, no solo los que están en defaults
 * @template T - Tipo genérico que extiende Properties
 * @param {Record<string, string>} urlParams - Parámetros extraídos de la URL
 * @param {T} defaults - Valores por defecto con sus tipos correctos
 * @returns {T} Propiedades con tipos correctamente convertidos, incluidos parámetros adicionales de URL
 */
function parseProperties<T extends Record<string, any>>(
  urlParams: Record<string, string>,
  defaults: T
): T {
  const result = { ...defaults } as T;

  // Procesa todos los parámetros de URL
  for (const key in urlParams) {
    const defaultValue = defaults[key];
    const urlValue = urlParams[key];

    // Convertir basándose en el tipo del valor por defecto si existe
    if (typeof defaultValue === "number") {
      (result as any)[key] = parseInt(urlValue, 10);
    } else if (typeof defaultValue === "boolean") {
      (result as any)[key] = urlValue.toLowerCase() === "true";
    } else {
      // Si no está en defaults, se asigna como string
      (result as any)[key] = urlValue;
    }
  }

  return result;
}

/**
 * Tipo que define la estructura del objeto global OBSChat
 * Gestiona propiedades de la aplicación, registro de custom elements y su inicialización
 * @typedef {Object} OBSChat
 * @property {Properties} [properties] - Propiedades globales de la aplicación con tipos correctos
 * @property {Record<string, CustomElementConstructor>} [appCustomElements] - Registro de custom elements definidos en la aplicación
 * @property {(name: string, constructor: CustomElementConstructor) => void} addCustomElement - Función para registrar nuevos custom elements
 * @property {Record<string, Message>} messages - Almacenamiento de mensajes activos en el chat, indexados por ID
 * @property {(messageInfo: UserMessageInfoType) => string} addMessage - Función para agregar un nuevo mensaje al almacenamiento global y devolver su ID
 */
export type OBSChat = {
  properties?: Properties
  appCustomElements?: Record<string, CustomElementConstructor>
  addCustomElement: (name: string, constructor: CustomElementConstructor) => void
  messages: Record<string, Message>
  addMessage: (messageInfo: UserMessageInfoType) => string
}

declare global {
  interface Window {
    /**
     * Objeto global para gestionar custom elements y propiedades de la aplicación OBSChat
     * @type {OBSChat}
     */
    OBSChat: OBSChat
  }
}

/**
 * Verifica que el custom element "chat-view" exista en el registro del navegador
 * @type {CustomElementConstructor | undefined}
 */
customElements.get("chat-view")

/**
 * Preserva el baseUrl inyectado desde Astro antes de inicializar OBSChat
 * El script inline en index.astro establece este valor con import.meta.env.BASE_URL
 */
const injectedBaseUrl = window.OBSChat?.properties?.baseUrl;

/**
 * Instancia del objeto global OBSChat
 * Gestiona el registro de custom elements y las propiedades globales de la aplicación
 * Se asigna a window.OBSChat para ser accesible desde cualquier parte de la aplicación
 * @type {OBSChat}
 */
const OBSChat: OBSChat = {
  /**
   * Propiedades globales con valores por defecto
   * Preserva el baseUrl inyectado desde Astro si existe
   * @type {Properties}
   */
  properties: {
    ...defaultProperties,
    ...(injectedBaseUrl && { baseUrl: injectedBaseUrl })
  },

  /**
   * Registro vacío de custom elements que se llenará dinámicamente
   * @type {Record<string, CustomElementConstructor>}
   */
  appCustomElements: {},

  /**
   * Registra un nuevo custom element en el registro global
   * Define el elemento en customElements API del navegador y lo almacena localmente
   * @param {string} name - Nombre del custom element (ej: "user-message", "chat-view")
   * @param {CustomElementConstructor} constructor - Constructor de la clase que extiende HTMLElement
   * @example
   * OBSChat.addCustomElement("user-message", UserMessage);
   */
  addCustomElement: (name: string, constructor: CustomElementConstructor) => {
    if (customElements) {
      customElements.define(name, constructor);
      window.OBSChat.appCustomElements![name] = constructor;
    }
  },

  /**
   * Almacenamiento de todos los mensajes activos en el chat
   * Indexados por su ID único
   * @type {Record<string, Message>}
   */
  messages: {},

  /**
   * Añade un nuevo mensaje al almacenamiento global y devuelve su ID
   * Crea un método delete que permite eliminar el mensaje del registro
   * @param {UserMessageInfoType} messageInfo - Información del mensaje a añadir
   * @returns {string} ID único del mensaje agregado
   * @example
   * const messageId = OBSChat.addMessage(twitchMessage);
   * // Más tarde...
   * OBSChat.messages[messageId].delete();
   */
  addMessage: function (messageInfo: UserMessageInfoType) {
    const id = messageInfo.messageInfo.id;
    const message: Message = {
      ...messageInfo,
      delete: () => {
        delete window.OBSChat.messages[id];
      }
    };
    OBSChat.messages[id] = message;
    return id;
  }
}

window.OBSChat = OBSChat

/**
 * Extrae los parámetros de la URL, los convierte a sus tipos correctos
 * y los asigna a las propiedades globales de OBSChat
 * Los valores por defecto se preservan si no están presentes en la URL
 * Preserva el baseUrl inyectado desde Astro (no se puede sobrescribir por URL)
 */
const urlParams = Object.fromEntries(new URL(location.href).searchParams);
const parsedProperties = parseProperties(urlParams, defaultProperties);

// Preservar el baseUrl inyectado desde Astro (tiene prioridad sobre URL y defaults)
if (injectedBaseUrl) {
  parsedProperties.baseUrl = injectedBaseUrl;
}

OBSChat.properties = parsedProperties;
