/**
 * Script de inicialización de la aplicación OBSChat
 * Conecta el cliente de Twitch IRC y configura los event listeners para mensajes entrantes
 * @module scripts/start
 */
// import { badges } from "mtmi-async-badges"
import badges from "mtmi-async-badges";
import getPythonesaMessage from "@/lib/mock_messages";
import { client } from "mtmi";
import type ChatView from "@/components/chat-view";

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
} else {
  /**
   * Obtiene la referencia al custom element chat-view
   * @type {ChatView}
   */
  const chatView = document.querySelector("chat-view") as ChatView;
  chatView.newMessage(
    getPythonesaMessage(
      "Tienes que poner el canal o no te va a funcionar esta cosa."
    )
  );
}

