/**
 * Módulo para determinar el ornamento (insignia especial) de un usuario en el chat
 * @module lib/get_ornament
 */

import type { UserMessageInfoType } from "@/lib/mtmi";

/**
 * Tipos de ornamentos que puede tener un usuario en el chat
 * @typedef {string} OrnamentClass
 * @enum {string}
 * @property {string} "moderator" - Usuario es moderador del canal
 * @property {string} "vip" - Usuario es VIP del canal
 * @property {string} "subscriber" - Usuario es suscriptor del canal
 * @property {string} "broadcaster" - Usuario es el propietario/streamer del canal
 * @property {string} "" - Usuario no tiene ningún ornamento especial
 */
export type OrnamentClass =
  | "moderator"
  | "vip"
  | "subscriber"
  | "broadcaster"
  | "";

/**
 * Determina el ornamento (insignia especial) que debe tener un usuario en el chat
 * Verifica el estado del usuario en el siguiente orden:
 * 1. Si es el propietario del canal (broadcaster)
 * 2. Si es moderador
 * 3. Si es VIP
 * 4. Si es suscriptor
 * 5. Sin ornamento especial
 * @param {UserMessageInfoType} message - Información del mensaje de usuario
 * @returns {OrnamentClass} El tipo de ornamento correspondiente al usuario
 * @example
 * const ornament = getOrnament(message);
 * if (ornament) {
 *   element.classList.add(ornament);
 * }
 */
export default function getOrnament(
  message: UserMessageInfoType
): OrnamentClass {
  if (window.OBSChat.properties?.channel === message.username)
    return "broadcaster";
  const { isMod, isVip, isSub } = message.userInfo
  if (isMod) return "moderator";
  if (isVip) return "vip";
  if (isSub) return "subscriber";
  return "";

}