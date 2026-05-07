import { type UserMessageInfoType } from "mtmi";

/**
 * Función de efecto que procesa un mensaje y llama al siguiente efecto en la cadena
 * @callback Effect
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @param {RunNextEffect} next - Función para ejecutar el siguiente efecto
 */
export type Effect = (message: UserMessageInfoType, next: RunNextEffect) => void

/**
 * Función que ejecuta el siguiente efecto en la cadena de procesamiento
 * @callback RunNextEffect
 */
export type RunNextEffect = () => void

/**
 * Función de salida que recibe el mensaje procesado final
 * @callback Output
 * @param {UserMessageInfoType} message - El mensaje procesado
 */
export type Output = (message: UserMessageInfoType) => void

/**
 * Sistema de procesamiento de mensajes mediante cadena de efectos
 * Permite agregar múltiples efectos que se ejecutan secuencialmente
 * antes de enviar el mensaje a las salidas registradas
 * @class EfectsLoop
 */
export default class EfectsLoop {
  /**
   * Array de efectos registrados que se aplicarán a los mensajes
   * @private
   * @type {Effect[]}
   */
  private effects: Effect[] = [];

  /**
   * Array de funciones de salida que recibirán los mensajes procesados
   * @private
   * @type {Output[]}
   */
  private outputs: Output[] = [];

  /**
   * Agrega un nuevo efecto a la cadena de procesamiento
   * @param {Effect} effect - Función de efecto a agregar
   */
  addEffect(effect: Effect) {
    this.effects.push(effect);
  }

  /**
   * Agrega una nueva función de salida para recibir mensajes procesados
   * @param {Output} output - Función de salida a agregar
   */
  addOutput(output: Output) {
    this.outputs.push(output);
  }

  /**
   * Procesa un mensaje a través de todos los efectos registrados
   * y lo envía a las salidas una vez completado
   * @param {UserMessageInfoType} message - El mensaje a procesar
   */
  input(message: UserMessageInfoType) {
    const { effects } = this;
    let loop: RunNextEffect = effects.length ? () => {
      effects[effects.length - 1](message, () => {
        this.outputEffect(message)
      });
    } : () => {
      this.outputEffect(message)
    };
    if (effects.length > 1) {
      for (let i = effects.length - 2; i >= 0; i--) {
        const prevLoop = loop;  // Capturar la referencia del loop anterior
        loop = () => {
          effects[i](message, prevLoop)  // Usar la referencia capturada, no 'loop'
        }
      }
    }
    loop();
  }

  /**
   * Envía el mensaje procesado a todas las salidas registradas
   * @private
   * @param {UserMessageInfoType} message - El mensaje procesado a enviar
   */
  private outputEffect(message: UserMessageInfoType) {
    this.outputs.forEach(output => output(message));
  }
}