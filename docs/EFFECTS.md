# 🔌 Sistema de Efectos - CVTalk

El sistema de efectos de CVTalk permite procesar mensajes de Twitch en una cadena de middleware antes de renderizarlos en pantalla. Esta arquitectura extensible permite agregar funcionalidades personalizadas sin modificar el código core.

## 📋 Tabla de Contenidos

- [Conceptos Básicos](#conceptos-básicos)
- [Arquitectura](#arquitectura)
- [Crear un Efecto](#crear-un-efecto)
- [Ejemplos](#ejemplos)
- [API Reference](#api-reference)
- [Efectos Incluidos](#efectos-incluidos)

## 🎯 Conceptos Básicos

### ¿Qué es un Efecto?

Un efecto es una función que:
1. Recibe un mensaje de Twitch
2. Procesa o modifica el mensaje (opcional)
3. Llama al siguiente efecto en la cadena

```typescript
type Effect = (message: UserMessageInfoType, next: RunNextEffect) => void
```

### Flujo de Procesamiento

```mermaid
graph LR
    A[Mensaje IRC] --> B[Effect 1]
    B --> C[Effect 2]
    C --> D[Effect N]
    D --> E[Render]
```

## 🏗️ Arquitectura

### EfectsLoop

La clase `EfectsLoop` gestiona la cadena de efectos:

```typescript
class EfectsLoop {
  private effects: Effect[] = []
  private outputs: Output[] = []
  
  addEffect(effect: Effect): void
  addOutput(output: Output): void
  input(message: UserMessageInfoType): void
}
```

#### Métodos

- **`addEffect(effect)`**: Agrega un efecto a la cadena
- **`addOutput(output)`**: Agrega una función de salida que recibe mensajes procesados
- **`input(message)`**: Procesa un mensaje a través de todos los efectos

### Orden de Ejecución

Los efectos se ejecutan en el **orden en que fueron agregados**:

```typescript
efectsLoop.addEffect(effect1) // Se ejecuta primero
efectsLoop.addEffect(effect2) // Se ejecuta segundo
efectsLoop.addEffect(effect3) // Se ejecuta tercero
```

## ✨ Crear un Efecto

### Estructura Básica

```typescript
// src/lib/efects_loop/efects/mi_efecto.ts
import type { Effect } from "../index"
import { type UserMessageInfoType } from "mtmi"

export default class MiEfecto {
  constructor() {
    // Inicialización
    console.log("MiEfecto inicializado")
  }
  
  public getEfect(): Effect {
    return (message, next) => {
      // Tu lógica aquí
      console.log("Procesando mensaje:", message.message)
      
      // IMPORTANTE: Llamar a next() para continuar la cadena
      next()
    }
  }
}
```

### Registrar el Efecto

```typescript
// src/components/chat-view/index.ts
import MiEfecto from "@/lib/efects_loop/efects/mi_efecto"

constructor() {
  super()
  this.efectsLoop = new EfectsLoop()
  this.efectsLoop.addOutput(this.renderMessage.bind(this))
  
  // Agregar tu efecto
  const miEfecto = new MiEfecto()
  this.efectsLoop.addEffect(miEfecto.getEfect())
}
```

### Hacer el Efecto Configurable

```typescript
// Agregar propiedad en global.ts
export type Properties = {
  channel?: string
  messageTTL: number
  pato_bot: boolean
  mi_efecto: boolean  // Nueva propiedad
}

const defaultProperties: Properties = {
  messageTTL: 10000,
  pato_bot: false,
  mi_efecto: false  // Valor por defecto
}

// Usar en chat-view
if (window.OBSChat.properties?.mi_efecto) {
  const miEfecto = new MiEfecto()
  this.efectsLoop.addEffect(miEfecto.getEfect())
}
```

Ahora puedes habilitar el efecto con: `?channel=micanal&mi_efecto=true`

## 📝 Ejemplos

### Ejemplo 1: Filtro de Palabras

```typescript
export default class WordFilter {
  private bannedWords = ["spam", "scam"]
  
  public getEfect(): Effect {
    return (message, next) => {
      // Filtrar palabras prohibidas
      let filtered = message.message
      this.bannedWords.forEach(word => {
        const regex = new RegExp(word, "gi")
        filtered = filtered.replace(regex, "***")
      })
      
      message.message = filtered
      next()
    }
  }
}
```

### Ejemplo 2: Contador de Mensajes

```typescript
export default class MessageCounter {
  private count = 0
  private userCounts: Map<string, number> = new Map()
  
  public getEfect(): Effect {
    return (message, next) => {
      this.count++
      
      const username = message.username
      const userCount = this.userCounts.get(username) || 0
      this.userCounts.set(username, userCount + 1)
      
      console.log(`Total messages: ${this.count}`)
      console.log(`${username} messages: ${userCount + 1}`)
      
      next()
    }
  }
}
```

### Ejemplo 3: Modificar Avatar según Contenido

```typescript
export default class EmojiAvatar {
  private emojiAvatars = {
    "❤️": "/assets/avatars/heart.png",
    "😂": "/assets/avatars/laugh.png",
    "🔥": "/assets/avatars/fire.png"
  }
  
  public getEfect(): Effect {
    return (message, next) => {
      for (const [emoji, avatar] of Object.entries(this.emojiAvatars)) {
        if (message.message.includes(emoji)) {
          message.userInfo.avatar = (async () => avatar)()
          break
        }
      }
      next()
    }
  }
}
```

### Ejemplo 4: Efecto con Audio

```typescript
export default class SoundEffect {
  private audio: HTMLAudioElement
  private audioUnlocked = false
  
  constructor() {
    this.audio = new Audio("/assets/audio/notification.mp3")
    this.audio.volume = 0.5
    this.unlockAudio()
  }
  
  private unlockAudio() {
    const unlock = async () => {
      try {
        this.audio.volume = 0
        await this.audio.play()
        this.audio.pause()
        this.audio.currentTime = 0
        this.audio.volume = 0.5
        this.audioUnlocked = true
        document.removeEventListener("click", unlock)
      } catch (e) {
        console.log("Esperando interacción del usuario")
      }
    }
    document.addEventListener("click", unlock, { once: true })
  }
  
  private async playSound() {
    try {
      this.audio.currentTime = 0
      await this.audio.play()
    } catch (error) {
      console.warn("No se pudo reproducir el audio:", error)
    }
  }
  
  public getEfect(): Effect {
    return (message, next) => {
      if (message.message.includes("!alert")) {
        this.playSound()
      }
      next()
    }
  }
}
```

### Ejemplo 5: Efecto Asíncrono

```typescript
export default class TranslatorEffect {
  public getEfect(): Effect {
    return async (message, next) => {
      // Traducir si el mensaje contiene cierto comando
      if (message.message.startsWith("!translate ")) {
        const text = message.message.replace("!translate ", "")
        
        try {
          const translated = await this.translateText(text)
          message.message = `${text} → ${translated}`
        } catch (error) {
          console.error("Error traduciendo:", error)
        }
      }
      
      next()
    }
  }
  
  private async translateText(text: string): Promise<string> {
    // Implementar traducción (API externa)
    return `[Traducción de: ${text}]`
  }
}
```

## 📖 API Reference

### Effect Type

```typescript
type Effect = (message: UserMessageInfoType, next: RunNextEffect) => void
```

**Parámetros:**
- `message`: Objeto completo del mensaje de Twitch
- `next`: Función para ejecutar el siguiente efecto

### RunNextEffect Type

```typescript
type RunNextEffect = () => void
```

Debe llamarse al final del efecto para continuar la cadena.

### Output Type

```typescript
type Output = (message: UserMessageInfoType) => void
```

Función que recibe el mensaje procesado final.

### UserMessageInfoType

```typescript
interface UserMessageInfoType {
  type: string
  username: string
  message: string
  badges: Badge[]
  userInfo: UserInfo
  messageInfo: MessageInfo
}
```

## 🦆 Efectos Incluidos

### PatoBotTribute

Efecto de homenaje a PatoBot que reproduce sonidos de pato.

**Activación:** `?pato_bot=true`

**Comportamiento:**
- Detecta mensajes con `*quack*`
- Reproduce sonido de pato (`/assets/audio/quack.mp3`)
- Cambia el avatar del usuario por uno aleatorio de pato
- Maneja políticas de autoplay del navegador

**Código:**
```typescript
if (message.message.includes("*quack*")) {
  message.userInfo.avatar = (async () => {
    return this.duckAvatars[Math.floor(Math.random() * this.duckAvatars.length)]
  })()
  this.playQuack()
}
```

## 🎓 Mejores Prácticas

### ✅ DO

- **Siempre llama a `next()`** al final de tu efecto
- **Usa console.log** para debugging durante desarrollo
- **Maneja errores** con try-catch en operaciones asíncronas
- **Documenta tu efecto** con JSDoc
- **Prueba efectos aislados** antes de integrarlos

### ❌ DON'T

- **No modifiques** el objeto mensaje si no es necesario
- **No olvides** llamar a `next()` (rompe la cadena)
- **No bloquees** el thread principal con operaciones pesadas
- **No uses** efectos para lógica de renderizado (usa outputs)
- **No dependas** de orden de otros efectos no controlados

## 🔍 Debugging

### Ver el flujo de efectos

```typescript
public getEfect(): Effect {
  return (message, next) => {
    console.log("⬇️ [MiEfecto] Entrada:", message.message)
    
    // Tu lógica
    
    console.log("⬆️ [MiEfecto] Salida:", message.message)
    next()
  }
}
```

### Verificar que se llama next()

```typescript
public getEfect(): Effect {
  return (message, next) => {
    // Tu lógica
    
    console.log("✅ [MiEfecto] Llamando next()")
    next()
  }
}
```

## 🤝 Compartir Efectos

Si creas un efecto útil, considera:

1. Documentarlo en este archivo
2. Agregar pruebas
3. Hacer un PR al repositorio
4. Compartirlo con la comunidad

---

¿Preguntas? Abre un issue en GitHub o únete a nuestra comunidad.
