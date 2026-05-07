/**
 * Genera una expresión regular dinámica que detecta una palabra
 * permitiendo espacios opcionales entre cada carácter.
 * Útil para detectar palabras escritas con espacios deliberados (ej: "g o o s e")
 * 
 * @author sonnyARG 😎
 * @param {string} word - La palabra base para generar el patrón regex
 * @returns {RegExp} Expresión regular que detecta la palabra con espacios opcionales
 * @example
 * const gooseRegex = dynamicRegex('goose')
 * gooseRegex.test('g o o s e') // true
 * gooseRegex.test('goose') // true
 * gooseRegex.test('g  o  o  s  e') // true
 */
export default function dynamicRegex(word: string): RegExp {
  let rgxLetras = ``
    ;[...word].forEach((character) => {
      // eslint-disable-next-line no-useless-escape
      rgxLetras += `[\s]*` + character
    })
  return new RegExp('(' + rgxLetras + ')', 'gi')
}