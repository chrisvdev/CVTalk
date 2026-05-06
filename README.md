# 🎮 CVTalk

Widget de chat de Twitch moderno y extensible para OBS Studio, construido con Astro y Web Components.

![Node.js](https://img.shields.io/badge/node-%3E%3D22.12.0-brightgreen)
![Astro](https://img.shields.io/badge/Astro-6.1.3-FF5D01?logo=astro)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Características

- 🔌 **Conexión en tiempo real** a Twitch IRC usando [mtmi](https://github.com/ManzDev/mtmi)
- 🎨 **Personalización visual** con ornamentos según roles (broadcaster, mod, VIP, suscriptor)
- 🦆 **Sistema de efectos extensible** para procesar mensajes (incluye PatoBotTribute)
- 🖼️ **Avatares y badges** de usuarios cargados dinámicamente
- ⏱️ **Auto-expiración** configurable de mensajes
- 🎯 **Configuración por URL** - fácil integración con OBS
- 🌈 **Curación de colores** para mejor legibilidad
- 🏗️ **Componentes Web nativos** - sin frameworks pesados en el frontend
- 📦 **Build optimizado** con Astro para máximo rendimiento

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 22.12.0
- pnpm (recomendado) o npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cvtalk.git
cd cvtalk

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El servidor estará disponible en `http://localhost:4321`

### Uso en OBS Studio

1. Construye el proyecto para producción:
   ```bash
   pnpm build
   ```

2. Agrega una **Browser Source** en OBS con la URL:
   ```
   http://localhost:4321/?channel=tu_canal_twitch
   ```

3. Configura las dimensiones recomendadas: **1920x1080**

## 🎛️ Configuración

Configura el widget mediante parámetros URL:

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `channel` | string | - | **Requerido**. Nombre del canal de Twitch |
| `messageTTL` | number | `10000` | Tiempo de vida de mensajes (ms) |
| `pato_bot` | boolean | `false` | Habilitar efecto PatoBot (*quack*) |

### Ejemplos

```bash
# Configuración básica
?channel=micanal

# Con mensaje TTL personalizado (20 segundos)
?channel=micanal&messageTTL=20000

# Con efecto PatoBot habilitado
?channel=micanal&pato_bot=true
```

## 🏗️ Estructura del Proyecto

```text
/
├── public/
│   ├── assets/
│   │   ├── audio/          # Archivos de audio (quack.mp3)
│   │   ├── fonts/          # Fuentes personalizadas
│   │   └── styles/         # Estilos CSS globales
│   └── favicon.ico
├── src/
│   ├── components/         # Web Components
│   │   ├── chat-view/      # Contenedor principal del chat
│   │   └── user-message/   # Mensaje individual de usuario
│   ├── lib/                # Utilidades y lógica de negocio
│   │   ├── efects_loop/    # Sistema de efectos
│   │   │   ├── index.ts    # EfectsLoop core
│   │   │   └── efects/     # Efectos disponibles
│   │   │       └── pato_bot_tribute.ts
│   │   ├── get_curated_color.ts
│   │   ├── get_ornament.ts
│   │   └── mock_messages.ts
│   ├── pages/
│   │   └── index.astro     # Página principal
│   └── scripts/
│       ├── global.ts       # Configuración global
│       └── start.ts        # Inicialización del cliente IRC
└── package.json
```

## 🔌 Sistema de Efectos

CVTalk incluye un sistema extensible de efectos que permite procesar mensajes antes de renderizarlos.

### Cómo funciona

Los efectos son funciones middleware que se ejecutan secuencialmente en una cadena de procesamiento:

```typescript
Message → Effect 1 → Effect 2 → Effect N → Render
```

### Crear un efecto personalizado

```typescript
import type { Effect } from "@/lib/efects_loop";
import { type UserMessageInfoType } from "mtmi";

export default class MiEfecto {
  constructor() {
    // Inicialización
  }
  
  public getEfect(): Effect {
    return (message, next) => {
      // Procesar el mensaje
      if (message.message.includes("palabra_clave")) {
        // Modificar el mensaje o ejecutar lógica
        message.userInfo.color = "#FF0000";
      }
      
      // Llamar al siguiente efecto
      next();
    }
  }
}
```

### PatoBotTribute Effect

Efecto incluido que:
- 🦆 Reproduce sonido de pato cuando detecta `*quack*` en mensajes
- 🖼️ Cambia el avatar del usuario por uno aleatorio de pato
- 🔊 Maneja políticas de autoplay del navegador con desbloqueo inteligente

**Uso:**
```
?channel=micanal&pato_bot=true
```

## 🛠️ Comandos Disponibles

| Comando | Acción |
|---------|--------|
| `pnpm dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Construye para producción en `./dist/` |
| `pnpm preview` | Previsualiza el build de producción |
| `pnpm astro` | Ejecuta comandos CLI de Astro |

## 🎨 Personalización Visual

### Ornamentos por Rol

Los mensajes se decoran automáticamente según el rol del usuario:

- 👑 **Broadcaster** - Propietario del canal
- 🔧 **Moderator** - Moderador
- 💎 **VIP** - VIP del canal
- ⭐ **Subscriber** - Suscriptor

### Curación de Colores

Los colores de usuario se procesan para mejorar la legibilidad, oscureciéndolos automáticamente para un mejor contraste sobre fondos oscuros.

### Estilos CSS

Personaliza la apariencia editando:
- `public/assets/styles/user-message.css` - Estilos de mensajes
- `public/assets/styles/chat-view.css` - Estilos del contenedor
- `public/assets/styles/fonts.css` - Fuentes personalizadas

## 📚 Dependencias Principales

- **[Astro](https://astro.build)** `^6.1.3` - Framework de frontend
- **[mtmi](https://github.com/ManzDev/mtmi)** `^0.0.19` - Cliente Twitch IRC by [ManzDev](https://github.com/ManzDev)
- **[mtmi-async-badges](https://github.com/chrisvdev/mtmi-async-badges)** `^1.0.0` - Badges de Twitch by [ChrisVDev](https://github.com/chrisvdev)

## 🐛 Debugging

### El chat no se conecta

- Verifica que el parámetro `channel` esté en la URL
- Comprueba la consola del navegador para errores de conexión IRC
- Asegúrate de que el canal exista y esté activo

### Los mensajes no aparecen

- Verifica que `ChatView` esté correctamente inicializado
- Comprueba los listeners de eventos en la consola
- Revisa que el `messageTTL` no sea demasiado corto

### El audio no se reproduce

- Los navegadores requieren interacción del usuario antes de reproducir audio
- En OBS, el audio debería funcionar automáticamente
- Verifica que el archivo `quack.mp3` exista en `public/assets/audio/`

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios usando conventional commits (`git commit -m '✨ feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Christian Villegas (ChrisVDev)**
- Email: christian@chrisvdev.com
- GitHub: [@chrisvdev](https://github.com/chrisvdev)

## 🙏 Agradecimientos

- [mtmi](https://github.com/ManzDev/mtmi) por el excelente cliente de Twitch IRC - Gracias [ManzDev](https://github.com/ManzDev)!
- [Astro](https://astro.build) por el excelente framework
- La comunidad de Twitch por el apoyo continuo

---

Hecho con ❤️ para la comunidad de streamers
