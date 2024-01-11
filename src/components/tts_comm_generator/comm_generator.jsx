import useSpeechSynthesis from "@/hooks/useSpeechSynthesis"
import { useEffect, useState } from "preact/hooks";
import tts from "@/lib/tts";

const itemStyle = "flex flex-col";
const labelStyle = "text-sm font-medium text-gray-300 mb-1";
const input =
  "mt-1 block p-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg transition-all duration-100 focus:outline focus:outline-offset-2 focus:outline-2 focus:outline-blue-500";
const buttonStyle = 
  "w-fit text-white font-medium rounded-lg text-sm px-5 py-2 bg-blue-600 transition-all duration-100 focus:outline focus:outline-offset-2 focus:outline-2 focus:outline-blue-500"
const formStyle = "flex flex-col space-y-4 p-4 border border-gray-700 rounded-lg"



export default function CommGenerator() {
  
  const voices = useSpeechSynthesis();
  const [accent, setAccent] = useState("");
  const [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    tts.whenReady((voices) => {
      setTimeout(() => {
        setAccent(Object.keys(voices)[0]);
        setVariant(1);
      }, 100)

    })
  }, [])

  const handleAccentChange = (event) => {
    setAccent(event.target.value);
  };
  const handleVariantChange = (event) => {
    setVariant(Number(event.target.value));
  }
  useEffect(() => {
    if (accent) {
      const options = [];
      for (let i = 1; i <= voices[accent]; i++) {
        options.push(<option key={i} value={i}>{i}</option>);
      }
      setVariants(options);
    }
  }, [accent])
  return (
    <form className={formStyle} onSubmit={(e) => {e.preventDefault(); tts.speak("This is a test o una prueba", accent, variant)}}>
      <label htmlFor="accent" className={labelStyle}>Accent:</label>
      <select name="accent" className={input} onInput={handleAccentChange}>
          {Object.keys(voices).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
      </select>
      <label htmlFor="variant" className={labelStyle}>Variant:</label>
      <select name="variant" className={input} onInput={handleVariantChange}>
        {variants}
      </select>
      <button className={buttonStyle} type={"submit"}>Test voice 📢</button>
      <h2>{`The command you need to use to configure this voice is "!speak -config ${accent} ${variant}"`}</h2>
      <button className={buttonStyle} type={"button"} onClick={() => navigator.clipboard.writeText(`!speak -config ${accent} ${variant}`)}>Copy command to clipboard 📋</button>
    </form>
  )
}
