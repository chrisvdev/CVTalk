import { useEffect, useState } from "preact/hooks"
import tts from "../lib/tts"

export default function useSpeechSynthesis () {
    const [voices, setVoices] = useState({})
    useEffect(() => {
        tts.whenReady((voices) => { setVoices(voices) })
    }, [])
    return voices
}
