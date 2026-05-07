import EfectsLoop from "@/lib/efects_loop";
import startEfects from "@/lib/efects_loop/start_efects";
import useTemplate from "@/lib/use_template";
import type { UserMessageInfoType } from "mtmi";

const UserMessage = window.OBSChat.appCustomElements?.[
  "user-message"
] as CustomElementConstructor;

/**
 * Custom element para mostrar una lista de mensajes de chat
 * Gestiona la adición y renderizado de nuevos mensajes de usuario
 * @class ChatView
 * @extends {HTMLElement}
 */
export default class ChatView extends HTMLElement {
  /**
   * Referencia a la lista HTML donde se agregan los mensajes
   * @type {HTMLUListElement | null}
   */
  list: HTMLUListElement | null = null;
  
  /**
   * Sistema de procesamiento de mensajes mediante efectos
   * @public
   * @type {EfectsLoop}
   */
  public efectsLoop : EfectsLoop

  /**
   * Constructor del elemento custom ChatView
   * Clona el template y obtiene referencia a la lista de mensajes
   */
  constructor() {
    super();
    useTemplate(this, "#chat-view", "#message-list");
    this.efectsLoop = new EfectsLoop();
    this.efectsLoop.addOutput(this.renderMessage.bind(this));
    startEfects(this.efectsLoop);
    this.list = this.querySelector("ul") as HTMLUListElement;
  }

  /**
   * Añade un nuevo mensaje a la lista de chat
   * Crea un elemento user-message, lo configura con los datos del mensaje
   * y lo inserta en la lista
   * @param {UserMessageInfoType} message - Información completa del mensaje a mostrar
   * @example
   * chatView.newMessage({
   *   userInfo: { displayName: "Usuario", color: "#FF0000" },
   *   messageInfo: { message: "Hola chat!" },
   *   badges: []
   * });
   */
  newMessage(message: UserMessageInfoType) {
    this.efectsLoop.input(message);
  }

  /**
   * Renderiza un mensaje procesado en la lista de chat
   * Crea el elemento DOM y lo agrega al contenedor de mensajes
   * @private
   * @param {UserMessageInfoType} message - El mensaje procesado a renderizar
   */
  private renderMessage(message: UserMessageInfoType) {
    const { addMessage } = window.OBSChat;
    const li = document.createElement("li");
    const userMessage = new UserMessage(
      message.messageInfo.message as HTMLElement,
    );
    userMessage.setAttribute("message", addMessage(message));
    li.appendChild(userMessage);
    if (this.list) {
      this.list.appendChild(li);
    } else {
      console.error("No se encontró el elemento de la lista de mensajes.");
    }
  }
}

window.OBSChat.addCustomElement("chat-view", ChatView);