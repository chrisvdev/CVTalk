import type { Effect } from "../index"
import dynamicRegex from "@/lib/dynamic_regex"

/**
 * Regex para detectar "goose" con espacios opcionales entre caracteres
 * @constant {RegExp}
 */
const goose = dynamicRegex('goose')

/**
 * Regex para detectar "ganso" con espacios opcionales entre caracteres
 * @constant {RegExp}
 */
const ganso = dynamicRegex('ganso')

/**
 * Regex para detectar "ganzo" con espacios opcionales entre caracteres
 * @constant {RegExp}
 */
const ganzo = dynamicRegex('ganzo')

/**
 * Efecto que reemplaza todas las menciones de "goose"/"ganso"/"ganzo" por "duck"/"pato".
 * Detecta variaciones con espacios entre letras (ej: "g o o s e").
 * Procesa tanto el contenido HTML como el texto plano del mensaje.
 * 
 * @type {Effect}
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para continuar al siguiente efecto
 * @example
 * // "I love goose" -> "I love duck"
 * // "Me gusta el g a n s o" -> "Me gusta el pato"
 */
const antiGoose: Effect = (message, next) => {
  message.messageInfo.message.childNodes.forEach((node: ChildNode) => {
    if (node.nodeName === "SPAN") {
      const text = node.textContent || ""
      if (goose.test(text) || ganso.test(text) || ganzo.test(text)) {
        node.textContent = text
          .replaceAll(goose, ' duck')
          .replaceAll(ganso, ' pato')
          .replaceAll(ganzo, ' pato')
      }
    }
  })
  message.message = message.message
    .replaceAll(goose, ' duck')
    .replaceAll(ganso, ' pato')
    .replaceAll(ganzo, ' pato')
  next()
}

export default antiGoose