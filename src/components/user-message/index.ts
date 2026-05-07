
import { createTimeout } from "@/lib/clean_timers";
import getCuratedColor from "@/lib/get_curated_color";
import useTemplate from "@/lib/use_template";
import getOrnament from "@/lib/get_ornament";
import type { UserMessageInfoType } from "mtmi";

const messageTTL = window.OBSChat.properties?.messageTTL || 10000;
const userMessageAttributes = ["message"] as const;
type UserMessageAttributes = (typeof userMessageAttributes)[number];

/**
 * Custom element para mostrar un mensaje de usuario
 * Renderiza información del usuario, avatares, badges y el contenido del mensaje
 * @class UserMessage
 * @extends {HTMLElement}
 */
export class UserMessage extends HTMLElement {
  /**
   * Constructor del elemento custom UserMessage
   * Clona el template y lo inserta en el elemento
   */
  constructor(element?: HTMLElement) {
    super();
    if (element) this.appendChild(element);
    useTemplate(this, "#user-message", ".message");
  }

  /**
   * Atributos observados por el custom element
   * @returns {string[]} Array de nombres de atributos a observar
   */
  static get observedAttributes() {
    return userMessageAttributes;
  }

  /**
   * Callback ejecutado cuando cambia un atributo observado
   * @param {UserMessageAttributes} name - Nombre del atributo que cambió
   * @param {string | null} old - Valor anterior del atributo
   * @param {string} now - Nuevo valor del atributo
   */
  attributeChangedCallback(
    name: UserMessageAttributes,
    old: string | null,
    now: string,
  ) {
    switch (name) {
      case "message":
        const message = window.OBSChat.messages[now];
        this.onNewMessage(message);
        break;
      default:
        console.warn(`Atributo no manejado: ${name}`);
        break;
    }
  }

  private selfDestruct() {
    createTimeout(() => {
      this.classList.add("fade-out");
      createTimeout(() => {
        this.parentElement?.remove();
        window.OBSChat.messages[this.getAttribute("message") as string]?.delete();
      }, 1000);
    }, messageTTL);
  }

  /**
   * Procesa y renderiza un nuevo mensaje con su información asociada
   * Actualiza nombre, color, avatar, badges y contenido del mensaje
   * @private
   * @param {UserMessageInfoType} message - Información completa del mensaje
   */
  private onNewMessage(message: UserMessageInfoType) {
    const displayName = this.querySelector("#displayName") as HTMLSpanElement;
    const avatarElement = this.querySelector("#avatar") as HTMLImageElement;
    const defaultAvatar = this.querySelector("#defaultAvatar") as HTMLImageElement;
    const { avatar } = message.userInfo as unknown as { avatar: Promise<string> };
    if (avatar instanceof Promise) {
      avatar.then(url => {
        if (url) {
          avatarElement.src = url;
          avatarElement.onload = () => {
            avatarElement.style.display = "block";
            defaultAvatar.style.display = "none";
          };
        }
      })
    }
    const primaryBadge
      = this.querySelector(
        "#primaryBagde",
      ) as HTMLImageElement;
    const secondaryBadges = this.querySelector(
      "#secondaryBadges",
    ) as HTMLDivElement;
    const ornamentClass = getOrnament(message);
    if (ornamentClass) {
      const messageOrnament = this.querySelector(
        ".messageOrnament",
      ) as HTMLDivElement;
      const avatarOrnament = this.querySelector(
        ".avatarOrnament",
      ) as HTMLDivElement;
      messageOrnament.classList.add(ornamentClass);
      avatarOrnament.classList.add(ornamentClass);
    }


    displayName.textContent = message.userInfo.displayName;
    displayName.style.color =
      getCuratedColor(message.userInfo.color);
      
    if (message.badges.length > 0) {
      const primaryBadgeInfo = message.badges[0];
      primaryBadge.src = primaryBadgeInfo.image;
      primaryBadge.style.display = primaryBadgeInfo.image ? "block" : "none";

      // Limitar a 2 badges secundarias para evitar saturar el diseño
      const secondaryBadgeInfos = message.badges.slice(1, 3);
      secondaryBadges.innerHTML = ""; // Limpiar badges anteriores
      secondaryBadgeInfos.forEach((badgeInfo) => {
        const badgeImg = document.createElement("img");
        badgeImg.src = badgeInfo.image;
        badgeImg.classList.add("h-6", "ml-1"); // Ajusta el tamaño y margen según tu diseño
        secondaryBadges.appendChild(badgeImg);
      });
    } else {
      primaryBadge.style.display = "none";
      secondaryBadges.innerHTML = "";
    }
    //this.selfDestruct();
  }
}

window.OBSChat.addCustomElement("user-message", UserMessage);