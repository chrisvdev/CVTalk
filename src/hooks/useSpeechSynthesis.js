import { useEffect, useState } from "preact/hooks"


export default function useSpeechSynthesis () {
    const [voices, setVoices] = useState({})
    useEffect(() => {
        speechSynthesis.addEventListener("voiceschanged", () => {
            const voices = {}
            speechSynthesis.getVoices().forEach((voice) => {
                const { lang } = voice
                if (lang.length === 5) (voices[lang] ? (voices[lang] += 1) : (voices[lang] = 1))
            })
            setVoices(voices)
        })
    }, [])
    return voices
}
