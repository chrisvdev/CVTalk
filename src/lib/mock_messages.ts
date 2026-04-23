/**
 * Módulo para generar mensajes mock del usuario del bot Pythonesa
 * Utilizado principalmente para propósitos de prueba y para mostrar mensajes de error/información
 * @module lib/mock_messages
 */

import type { UserMessageInfoType } from "mtmi";

/**
 * Genera un mensaje mock simulando al usuario Pythonesa (bot/moderador)
 * Útil para mostrar mensajes de configuración, errores o información del sistema
 * El mensaje incluye badges de moderador, suscriptor y twitch-recap
 * con toda la información necesaria para renderizar correctamente en el chat
 * @param {string} message - Contenido del mensaje de texto a mostrar
 * @returns {UserMessageInfoType} Objeto completo de información del mensaje tipo Twitch IRC
 * @example
 * const mockMsg = getPythonesaMessage("Bienvenido al chat!");
 * chatView.newMessage(mockMsg);
 */
export default function getPythonesaMessage(message: string): UserMessageInfoType {
  const noChannelMessageSpan = document.createElement("span");
  noChannelMessageSpan.className = "message"
  const innerSpan = document.createElement("span");
  innerSpan.innerText = message
  innerSpan.className = "text"
  noChannelMessageSpan.appendChild(innerSpan);
  return {
    "type": "message",
    "username": "pythonesa",
    "badges": [
      {
        "name": "moderator",
        "value": "1",
        "image": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
        "description": "Moderator"
      },
      {
        "name": "subscriber",
        "value": "0",
        "image": "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/3",
        "description": "Subscriber",
        "fullMonths": 12
      },
      {
        "name": "twitch-recap-2024",
        "value": "1",
        "image": "",
        "description": ""
      }
    ],
    "userInfo": {
      "username": "pythonesa",
      "displayName": "pythonesa",
      "color": "#9acd32",
      "isMod": true,
      "isVip": false,
      "isSub": true,
      "isPrime": false,
      "isTurbo": false,
      "isBot": false
    },
    "messageInfo": {
      "id": "10243ddb-4743-463b-88b9-0e8c6d6e98ed",
      "isEmoteOnly": false,
      "isFirstMessage": false,
      "isReturningChatter": false,
      "isHighlightedMessage": false,
      "isGigantifiedEmoteMessage": false,
      "isAnimatedMessage": false,
      "flagsInfo": {},
      "roomId": 418319555,
      "tmi": 1775181027806,
      "userId": 888249242,
      "msgId": "message",
      "messageData": [
        {
          "type": "text",
          "data": "Tienes que poner el canal o no te va a funcionar esta cosa."
        }
      ],
      "message": noChannelMessageSpan,
      "rawMessage": "Tienes que poner el canal o no te va a funcionar esta cosa."
    },
    "message": "Tienes que poner el canal o no te va a funcionar esta cosa.",
    "channel": "#chrisvdev",
    "raw": "@badge-info=subscriber/12;badges=moderator/1,subscriber/0,twitch-recap-2024/1;client-nonce=a1d7a691a78f44e9af96f3c01501983a;color=#9ACD32;display-name=pythonesa;emotes=;first-msg=0;flags=;id=10243ddb-4743-463b-88b9-0e8c6d6e98ed;mod=1;returning-chatter=0;room-id=418319555;subscriber=1;tmi-sent-ts=1775181027806;turbo=0;user-id=888249242;user-type=mod :pythonesa!pythonesa@pythonesa.tmi.twitch.tv PRIVMSG #chrisvdev :Tienes que poner el canal o no te va a funcionar esta cosa."
  }
};