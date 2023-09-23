class TTS {
    constructor () {
        this.voices = {}
        speechSynthesis.addEventListener("voiceschanged", () => {
            speechSynthesis.getVoices().forEach((voice) => {
                const { lang } = voice
                if (lang.length === 5) (this.voices[lang] ?
                    (this.voices[lang] += 1) : (this.voices[lang] = 1))
            })
        })
    }
    speak (msj, accent, variant) {
        const toSpeak = new SpeechSynthesisUtterance(msj)
        toSpeak.voice = this.voices[accent] ?
            variant < this.voices[accent] ?
                speechSynthesis.getVoices().filter(
                    (voice) => voice.lang === accent
                )[variant - 1]
                : speechSynthesis.getVoices().filter(
                    (voice) => voice.lang === accent
                )[0]
            : speechSynthesis.getVoices()[0]
        speechSynthesis.speak(toSpeak)
    }
    getVoices () {
        return structuredClone(this.voices)
    }
}

const tts = new TTS()

export default tts;