/**
 * Script de inicialización de la aplicación OBSChat
 * Conecta el cliente de Twitch IRC y configura los event listeners para mensajes entrantes
 * @module scripts/start
 */

import type ChatView from "@components/chat-view";
// import { badges } from "mtmi-async-badges"
import badges from "mtmi-async-badges";
import getPythonesaMessage from "@/lib/mock_messages";
import { client } from "mtmi";

/**
 * Obtiene la referencia al custom element chat-view
 * @type {ChatView}
 */
const chatView = document.querySelector("chat-view") as ChatView;

/**
 * Obtiene el nombre del canal desde las propiedades globales
 * @type {string | undefined}
 */
const channel = window.OBSChat.properties?.channel;

/**
 * Si existe un canal configurado, conecta el cliente de Twitch IRC y configura
 * el listener para mensajes entrantes que se mostrarán en el chat view.
 * Si no hay canal, muestra un mensaje de error.
 */
if (channel) {
  /**
   * Conecta el cliente de IRC con las credenciales y configuración necesaria
   * Usa el proveedor de avatares 'decapi' y carga los badges de Twitch
   */
  // @ts-expect-error - tipo en el paquete de mtmi esta roto
  client.connect({ channels: [channel], badges, avatarProvider: "decapi", });

  /**
   * Escucha nuevos mensajes de chat y los añade al elemento ChatView
   * @param {UserMessageInfoType} message - Información del mensaje de Twitch
   */
  client.on("message", (message) => {
    chatView.newMessage(message);
  });
  client.on("sub", (data) => console.log("SUB: ", data));
  client.on("resub", (data) => console.log("RESUB: ", data));
  client.on("subgift", (data) => console.log("SUBGIFT: ", data));
  client.on("submysterygift", (data) => console.log("SUBMYSTERYGIFT: ", data));
  client.on("communitypayforward", (data) => console.log("COMMUNITYPAYFORWARD: ", data));
  client.on("standardpayforward", (data) => console.log("STANDARDPAYFORWARD: ", data));
  client.on("giftpaidupgrade", (data) => console.log("GIFTPAIDUPGRADE: ", data));
  client.on("primepaidupgrade", (data) => console.log("PRIMEPAIDUPGRADE: ", data));
  client.on("clearchat", (data) => console.log("CLEARCHAT: ", data));
  client.on("ban", (data) => console.log("BAN: ", data));
  client.on("timeout", (data) => console.log("TIMEOUT: ", data));
  client.on("clearmsg", (data) => console.log("DELETE MESSAGE: ", data));
  client.on("raid", (data) => console.log("RAID: ", data));
  // client.on("unraid", (data) => console.log("UNRAID: ", data));
  client.on("viewermilestone", (data) => console.log("VIEWERMILESTONE: ", data));
  client.on("roomstate", (data) => console.log("ROOMSTATE: ", data));
  client.on("announcement", (data) => console.log("ANNOUNCEMENT: ", data));
  client.on("bits", (data) => console.log("BITS: ", data));
  client.on("action", (data) => console.log("MESSAGE ACTION: ", data));
  // MODES
  client.on("emote_only_off", (data) => console.log("MODE: ", data));
  client.on("emote_only_on", (data) => console.log("MODE: ", data));
  client.on("followers_on", (data) => console.log("MODE: ", data));
  client.on("followers_off", (data) => console.log("MODE: ", data));
  client.on("slow_on", (data) => console.log("MODE: ", data));
  client.on("slow_off", (data) => console.log("MODE: ", data));
  client.on("subs_on", (data) => console.log("MODE: ", data));
  client.on("subs_off", (data) => console.log("MODE: ", data));
  client.on("r9k_on", (data) => console.log("MODE: ", data));
  client.on("r9k_off", (data) => console.log("MODE: ", data));
  client.on("raw", (data) => console.log("RAW: ", data));
} else {
  chatView.newMessage(
    getPythonesaMessage(
      "Tienes que poner el canal o no te va a funcionar esta cosa."
    )
  );
}

