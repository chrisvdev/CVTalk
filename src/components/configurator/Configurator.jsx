import { useEffect, useState, useCallback } from "preact/hooks";
import isURL from "validator/lib/isURL";
import "./configurator.css";

// config de twitch
const CHANNEL = "channel"; //text 👍

// estilos
const DEFAULT_AVATAR = "default_avatar"; //text URL
const STYLE = "style"; //text URL 👍
//posiblemente podría chequear que la URL es accesible

// funciones
const TTS = "tts"; // Checkbox (activo po defecto) 👍
// Los parámetros TTS deberían de ser obtenidos del navegador 👍
const TTS_ACCENT = "tts_accent"; // listado desplegable 👍
const TTS_INDEX = "tts_index"; // Listado desplegable (indices dependiendo del accento)
const RENDER = "render"; // checkbox (activo por defecto) 👍
const BOTS = "bots"; // Esto es un arreglo de strings 👍
const PATO_BOT = "pato_bot"; // bool (activo por defecto) 👍
const HTMLI = "htmli"; // 👍 Checkbox (desactivado y avisando que es experimental)
const VALID = "_valid";

const A = "a".charCodeAt();
const Z = "z".charCodeAt();
const _0 = "0".charCodeAt();
const _9 = "9".charCodeAt();
const dash = "_".charCodeAt();

function isAValidUserChar(char) {
  const code = char.toLowerCase().charCodeAt();
  return (
    (code >= A && code <= Z) || (code >= _0 && code <= _9) || code === dash
  );
}

const itemStyle = "m-1";
const labelStyle = "mr-2";
const input =
  "bg-zinc-950 text-zinc-100 border-b-2 border-zinc-300 focus:border-amber-300 transition-all";

const dataInitialState = {};
dataInitialState[CHANNEL] = "chrisvdev"; // Validar Usuario si
dataInitialState[DEFAULT_AVATAR] = ""; // URL si
dataInitialState[`${DEFAULT_AVATAR}${VALID}`] = true; // URL si
dataInitialState[STYLE] = ""; // Validar URL si
dataInitialState[`${STYLE}${VALID}`] = true; // Validar URL si
dataInitialState[TTS] = true; // check si
dataInitialState[TTS_ACCENT] = "es-AR"; // Auto
dataInitialState[TTS_INDEX] = "2"; // Auto
dataInitialState[RENDER] = true; // check si
dataInitialState[BOTS] = ""; // Validar Usuario incluye si
dataInitialState[PATO_BOT] = true; // check si
dataInitialState[HTMLI] = false; // check si

const typeUser = [CHANNEL, BOTS];
const typeCheck = [TTS, RENDER, PATO_BOT, HTMLI];
const typeURL = [DEFAULT_AVATAR, STYLE];

/*
  Reemplazar onInput por onKeyDown
  Aparentemente desencadena un render pero precisa del preventDefault

  En el caso de tener muchos inputs hacer el renderizado dinámico en
  base a las constantes que se agreguen 
*/

export default function Configurator() {
  const [data, setData] = useState(structuredClone(dataInitialState));
  const makeInputHandler = useCallback((key) => {
    const updateState = (value, altKey) => {
      setData((lastState) => {
        const newState = { ...lastState };
        newState[altKey || key] = value;
        console.log(newState);
        return newState;
      });
    };
    const refreshState = () => {
      setData((lastState) => structuredClone(lastState));
    };
    if (typeUser.includes(key))
      return (e) => {
        const { value } = e.currentTarget;
        if (isAValidUserChar(value[value.length - 1])) updateState(value);
        else refreshState();
      };
    if (typeCheck.includes(key))
      return (e) => {
        const { checked } = e.currentTarget;
        if (typeof checked === "boolean") updateState(checked);
        else refreshState();
      };
    if (typeURL.includes(key))
      return (e) => {
        const { value } = e.currentTarget;
        updateState(value);
        updateState(value === "" || isURL(value), `${key}${VALID}`);
      };
    return (e) => {
      const { value } = e.currentTarget;
      updateState(value);
    };
  }, []);
  useEffect(() => {
    const onEvent = () => {
      setData((initialData) => {
        const data = { ...initialData };
        data[TTS_ACCENT] = speechSynthesis.getVoices()[0].lang;
        return data;
      });
    };
    speechSynthesis.addEventListener("voiceschanged", onEvent);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", onEvent);
    };
  }, []);
  return (
    <section className="mx-auto max-w-md">
      <form>
        <div className={itemStyle}>
          <label className={labelStyle}>Channel</label>
          <input
            className={input}
            value={data[CHANNEL]}
            type="text"
            name={CHANNEL}
            onInput={makeInputHandler(CHANNEL)}
          />
        </div>
        <div className={itemStyle}>
          <label className={labelStyle}>Custom CSS Style</label>
          <input
            className={input}
            value={data[STYLE]}
            type="text"
            name={STYLE}
            onInput={makeInputHandler(STYLE)}
          />
        </div>
        {data[`${STYLE}${VALID}`] || <p>Is not a valid URL</p>}
        <div className={itemStyle}>
          <label className={labelStyle}>Default Avatar</label>
          <input
            className={input}
            value={data[DEFAULT_AVATAR]}
            type="text"
            name={DEFAULT_AVATAR}
            onInput={makeInputHandler(DEFAULT_AVATAR)}
          />
        </div>
        {data[`${DEFAULT_AVATAR}${VALID}`] || <p>Is not a valid URL</p>}
        <div className={itemStyle}>
          <label className={labelStyle}>TTS</label>
          <input
            checked={data[TTS]}
            type="checkbox"
            name={TTS}
            onInput={makeInputHandler(TTS)}
          />
        </div>
        <div className={itemStyle}>
          {/* Si esta desactivado se podrían anular los 2 siguientes inputs */}
          <label className={labelStyle}>TTS Accent</label>
          <select
            className={input}
            value={data[TTS_ACCENT]}
            name={TTS_ACCENT}
            onInput={makeInputHandler(TTS_ACCENT)}
          >
            <option>es-ES</option>
            <option>es-AR</option>
          </select>
        </div>
        <div className={itemStyle}>
          <label className={labelStyle}>Accent variant</label>
          <select
            className={input}
            value={data[TTS_INDEX]}
            name={TTS_INDEX}
            onInput={makeInputHandler(TTS_INDEX)}
          >
            <option>1</option>
            <option>2</option>
          </select>
        </div>
        <div className={itemStyle}>
          <label className={labelStyle}>Render</label>
          <input
            checked={data[RENDER]}
            type="checkbox"
            name={RENDER}
            onInput={makeInputHandler(RENDER)}
          />
        </div>
        <div className={itemStyle}>
          <label className={labelStyle}>Bots</label>
          <input
            className={input}
            value={data[BOTS]}
            type="text"
            name={BOTS}
            onInput={makeInputHandler(BOTS)}
          />
        </div>
        <div className={itemStyle}>
          <label className={labelStyle}>PatoBot compatibility</label>
          <input
            type="checkbox"
            checked={data[PATO_BOT]}
            name={PATO_BOT}
            onInput={makeInputHandler(PATO_BOT)}
          />
          <p>
            (
            <a href="https://elpatobot.com/">
              You need to have the PatoBot configured.
            </a>
            )
          </p>
        </div>
        <div className={itemStyle}>
          <label className={labelStyle}>HTML Injection</label>
          <input
            type="checkbox"
            checked={data[HTMLI]}
            name={HTMLI}
            onInput={makeInputHandler(HTMLI)}
          />
          <p>(Experimental, Use on your own risk)</p>
        </div>
      </form>
    </section>
  );
}
