# 🤝 Guía de Contribución - CVTalk

¡Gracias por tu interés en contribuir a CVTalk! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Este proyecto y todos los que participan en él se rigen por el principio de respeto mutuo. Al participar, te comprometes a mantener un ambiente acogedor y profesional.

## 🚀 Cómo Contribuir

Hay muchas formas de contribuir a CVTalk:

- 🐛 **Reportar bugs**
- 💡 **Sugerir nuevas características**
- 📝 **Mejorar documentación**
- 🔧 **Escribir código**
- 🎨 **Diseñar temas/estilos**
- 🧪 **Escribir tests**
- 🦆 **Crear nuevos efectos**

## 🛠️ Configuración del Entorno

### Requisitos

- Node.js >= 22.12.0
- pnpm (recomendado) o npm
- Git
- Editor con soporte TypeScript (recomendamos VS Code)

### Setup

1. **Fork el repositorio**
   ```bash
   # Clic en "Fork" en GitHub
   ```

2. **Clonar tu fork**
   ```bash
   git clone https://github.com/TU_USUARIO/cvtalk.git
   cd cvtalk
   ```

3. **Agregar upstream remoto**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/cvtalk.git
   ```

4. **Instalar dependencias**
   ```bash
   pnpm install
   ```

5. **Crear rama para tu feature**
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```

6. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```

## 📏 Estándares de Código

### TypeScript

- **Usa tipos explícitos** siempre que sea posible
- **Evita `any`** - usa `unknown` si es necesario
- **Interfaces para objetos**, types para uniones/aliases

```typescript
// ✅ Bien
interface User {
  name: string
  age: number
}

// ❌ Mal
const user: any = { name: "Juan" }
```

### Nombres

- **camelCase** para variables y funciones
- **PascalCase** para clases y componentes
- **UPPER_SNAKE_CASE** para constantes
- **kebab-case** para archivos de componentes

```typescript
// Variables y funciones
const userName = "Juan"
function getUserName() {}

// Clases
class UserMessage extends HTMLElement {}

// Constantes
const MAX_MESSAGE_LENGTH = 500

// Archivos
// chat-view/index.ts
// user-message/index.ts
```

### Documentación

Todos los módulos, clases y funciones públicas deben tener **JSDoc**:

```typescript
/**
 * Procesa un mensaje de Twitch y lo prepara para renderizar
 * @param {UserMessageInfoType} message - El mensaje a procesar
 * @returns {string} El mensaje procesado
 * @example
 * const processed = processMessage(rawMessage)
 */
function processMessage(message: UserMessageInfoType): string {
  // ...
}
```

### Formato

El proyecto usa configuración estándar de TypeScript. Antes de hacer commit:

```bash
# Formatear código (si hay prettier configurado)
pnpm format

# Verificar errores de TypeScript
pnpm astro check
```

### Estructura de Archivos

```typescript
// 1. Imports de tipos
import type { UserMessageInfoType } from "mtmi"

// 2. Imports de librerías
import { client } from "mtmi"

// 3. Imports locales
import getCuratedColor from "@/lib/get_curated_color"

// 4. Types/Interfaces
export interface MyInterface {}

// 5. Constantes
const MAX_RETRIES = 3

// 6. Clase/Función principal
export default class MyComponent {}
```

## 🔄 Proceso de Pull Request

### Antes de crear un PR

1. **Actualiza tu rama**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Verifica que todo funcione**
   ```bash
   pnpm dev
   pnpm build
   ```

3. **Verifica tu código**
   ```bash
   pnpm astro check
   ```

### Crear el PR

1. **Push a tu fork**
   ```bash
   git push origin feature/mi-nueva-feature
   ```

2. **Abre un PR en GitHub**
   - Título descriptivo usando [Conventional Commits](#conventional-commits)
   - Descripción clara del cambio
   - Screenshots si hay cambios visuales
   - Referencia issues relacionados

### Plantilla de PR

```markdown
## 📝 Descripción

[Descripción clara de los cambios]

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix
- [ ] ✨ Nueva característica
- [ ] 📝 Documentación
- [ ] 🎨 Estilos
- [ ] ♻️ Refactor
- [ ] ⚡ Performance
- [ ] 🧪 Tests

## 🧪 Testing

- [ ] Probado en desarrollo local
- [ ] Probado en OBS Studio
- [ ] Funciona sin errores en consola

## 📸 Screenshots (si aplica)

[Imágenes antes/después]

## 📋 Checklist

- [ ] Código sigue los estándares del proyecto
- [ ] Agregué JSDoc donde corresponde
- [ ] Actualicé la documentación si es necesario
- [ ] Mi código no genera warnings
- [ ] Probé los cambios localmente
```

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) con gitmojis:

```bash
# Features
✨ feat: add new audio effect system

# Bug fixes
🐛 fix: resolve avatar loading issue

# Documentation
📝 docs: update effects documentation

# Styles
🎨 style: improve message container layout

# Refactor
♻️ refactor: reorganize effects structure

# Performance
⚡ perf: optimize message rendering

# Tests
🧪 test: add unit tests for getCuratedColor

# Chores
🔧 chore: update dependencies
```

### Emojis Comunes

- ✨ `:sparkles:` - Nueva característica
- 🐛 `:bug:` - Bug fix
- 📝 `:memo:` - Documentación
- 🎨 `:art:` - Estilos/formato
- ♻️ `:recycle:` - Refactor
- ⚡ `:zap:` - Performance
- 🔧 `:wrench:` - Configuración
- 🚀 `:rocket:` - Deploy
- 🧪 `:test_tube:` - Tests
- 🔒 `:lock:` - Seguridad

## 🐛 Reportar Bugs

### Antes de reportar

1. **Busca issues existentes** - puede que ya esté reportado
2. **Verifica la versión** - asegúrate de usar la última versión
3. **Reproduce el bug** - confirma que el problema es consistente

### Template de Bug Report

```markdown
## 🐛 Descripción del Bug

[Descripción clara del problema]

## 📋 Para Reproducir

1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

## ✅ Comportamiento Esperado

[Qué debería pasar]

## 📸 Screenshots

[Si aplica]

## 🔧 Entorno

- OS: [e.g. Windows 10]
- Node: [e.g. 22.12.0]
- OBS: [e.g. 30.0.0]
- Browser (si aplica): [e.g. Chrome 120]

## 📝 Información Adicional

[Cualquier contexto adicional]
```

## 💡 Sugerir Mejoras

### Template de Feature Request

```markdown
## 💡 Descripción de la Feature

[Descripción clara de la funcionalidad]

## 🎯 Problema que Resuelve

[Qué problema soluciona o mejora]

## 🔧 Solución Propuesta

[Cómo imaginas que funcionaría]

## 🔄 Alternativas Consideradas

[Otras formas de resolver el problema]

## 📝 Contexto Adicional

[Screenshots, ejemplos, referencias]
```

## 🧪 Testing

### Testing Manual

Para probar tus cambios:

1. **Desarrollo Local**
   ```bash
   pnpm dev
   # Abre http://localhost:4321/?channel=test_channel
   ```

2. **En OBS**
   ```bash
   pnpm build
   pnpm preview
   # Agrega como Browser Source en OBS
   ```

3. **Casos a Probar**
   - [ ] Conexión al chat
   - [ ] Mensajes se muestran correctamente
   - [ ] Avatares cargan
   - [ ] Badges aparecen
   - [ ] Mensajes expiran correctamente
   - [ ] No hay errores en consola

### Testing Automatizado

(Próximamente - contribuciones bienvenidas!)

## 📚 Áreas que Necesitan Ayuda

- 🧪 **Tests**: Escribir tests unitarios y de integración
- 📝 **Documentación**: Mejorar docs, traducir a otros idiomas
- 🎨 **Temas**: Crear temas visuales predefinidos
- 🔌 **Efectos**: Crear nuevos efectos útiles
- ⚡ **Performance**: Optimizaciones de rendimiento
- ♿ **Accesibilidad**: Mejorar accesibilidad

## 🎓 Recursos

- [Astro Docs](https://docs.astro.build)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [mtmi Documentation](https://github.com/chrisventura/mtmi)

## 💬 Comunidad

- **Issues**: [GitHub Issues](https://github.com/OWNER/cvtalk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OWNER/cvtalk/discussions)
- **Discord**: [Próximamente]

## ❓ Preguntas

Si tienes preguntas:
1. Busca en [GitHub Discussions](https://github.com/OWNER/cvtalk/discussions)
2. Abre una nueva discusión
3. O crea un issue con la etiqueta `question`

---

¡Gracias por contribuir a CVTalk! 🎉
