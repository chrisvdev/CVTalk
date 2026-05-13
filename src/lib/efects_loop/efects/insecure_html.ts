import type { Effect } from "../index"
import dynamicRegex from "@/lib/dynamic_regex"

/**
 * Expresiones regulares dinámicas para detectar y filtrar etiquetas HTML peligrosas.
 * Estas regex permiten detectar las etiquetas incluso con espacios entre caracteres.
 */
const scriptRegex = dynamicRegex('script')
const onloadRegex = dynamicRegex('onload')
const onerrorRegex = dynamicRegex('onerror')
const iframeRegex = dynamicRegex('iframe')
const objectRegex = dynamicRegex('object')
const detailsRegex = dynamicRegex('details')

/**
 * Efecto que permite la inyección controlada de HTML en mensajes del chat.
 * 
 * ⚠️ **ADVERTENCIA DE SEGURIDAD**: Este efecto permite contenido HTML en mensajes,
 * lo cual puede ser potencialmente peligroso. Se filtran las etiquetas más peligrosas
 * pero aún así puede haber riesgos de XSS. Usar solo en entornos controlados.
 * 
 * **Modos de activación**:
 * - `"onCommand"`: Solo permite HTML en mensajes que empiezan con `$html`
 * - `"onHighlight"`: Solo permite HTML en mensajes destacados (highlighted)
 * 
 * **Filtros de seguridad aplicados**:
 * - Etiquetas `<script>` bloqueadas
 * - Atributos `onload` bloqueados
 * - Atributos `onerror` bloqueados
 * - Etiquetas `<iframe>` bloqueadas
 * - Etiquetas `<object>` bloqueadas
 * - Etiquetas `<details>` bloqueadas
 * 
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {Function} next - Callback para continuar con el siguiente efecto
 * @returns {void} Modifica el mensaje si cumple las condiciones, luego continúa
 * 
 * @example
 * // Con insecureHTML="onCommand"
 * // Usuario escribe: "$html <b>Hola</b> <i>mundo</i>"
 * // Se renderiza: "Hola mundo" (con negrita y cursiva)
 * 
 * @example
 * // Con insecureHTML="onHighlight"
 * // Usuario con mensaje destacado escribe: "<span style='color: red;'>Importante</span>"
 * // Se renderiza con el estilo aplicado
 * 
 * @security
 * ⚠️ Usar este efecto solo en entornos donde confías en los usuarios.
 * Aunque filtra las etiquetas más peligrosas, no garantiza protección total contra XSS.
 */
const insecureHTMLInyetion: Effect = (message, next) => {
  const { insecureHTML } = window.OBSChat.properties || {}
  if (message.userInfo.isBot) {
    return
  }
  let exectue = false
  if (insecureHTML === "onCommand") exectue = message.message.startsWith("$html")
  if (insecureHTML === "onHighlight") exectue = message.messageInfo.isHighlightedMessage
  if (exectue) {
    const span = document.createElement('span');
    span.innerHTML = message.message
      .replaceAll("$html", '')
      .replaceAll(scriptRegex, '')
      .replaceAll(iframeRegex, '')
      .replaceAll(onerrorRegex, '')
      .replaceAll(objectRegex, '')
      .replaceAll(detailsRegex, '')
      .replaceAll(onloadRegex, '');
    span.className = "message"
    message.messageInfo.message = span
  }
  next()
}

export default insecureHTMLInyetion