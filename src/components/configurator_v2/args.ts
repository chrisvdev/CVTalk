// config de twitch
export const CHANNEL = "channel"; //text 👍

// estilos
export const DEFAULT_AVATAR = "default_avatar"; //text URL
export const STYLE = "style"; //text URL 👍
//posiblemente podría chequear que la URL es accesible

// funciones
export const TTS = "tts"; // Checkbox (activo po defecto) 👍
// Los parámetros TTS deberían de ser obtenidos del navegador 👍
export const TTS_ACCENT = "tts_accent"; // listado desplegable 👍
export const TTS_INDEX = "tts_index"; // Listado desplegable (indices dependiendo del accento)
export const TTS_ALWAYS_ON = "tts_always_on"; // Checkbox que por defecto esta desactivado
export const RENDER = "render"; // checkbox (activo por defecto) 👍
export const BOTS = "bots"; // Esto es un arreglo de strings 👍
export const PATO_BOT = "pato_bot"; // bool (activo por defecto) 👍
export const HTMLI = "htmli"; // 👍 Checkbox (desactivado y avisando que es experimental)
export const CHAR_COMMANDS = "char_commands"; // Esto es un arreglo de caracteres
export const VALID = "_valid";

const args = {
  CHANNEL,
  DEFAULT_AVATAR,
  STYLE,
  TTS,
  TTS_ACCENT,
  TTS_INDEX,
  TTS_ALWAYS_ON,
  RENDER,
  BOTS,
  PATO_BOT,
  HTMLI,
  CHAR_COMMANDS,
  VALID,
};

export default args;
