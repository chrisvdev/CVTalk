# 🚀 Guía de Despliegue - CVTalk

Documentación sobre el proceso de despliegue de CVTalk en GitHub Pages.

## 📋 Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [Despliegue Automático](#despliegue-automático)
- [Despliegue Manual](#despliegue-manual)
- [Configuración de GitHub Pages](#configuración-de-github-pages)
- [Solución de Problemas](#solución-de-problemas)

## ⚙️ Configuración Inicial

### 1. Configuración de Astro

El proyecto está configurado para desplegar en GitHub Pages con las siguientes opciones en `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://chrisvdev.github.io',
  base: '/CVTalk',
});
```

**Importante:**
- `site`: URL base de tu GitHub Pages
- `base`: Nombre del repositorio (debe coincidir exactamente)

### 2. Estructura del Repositorio

```
CVTalk/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Action para despliegue automático
├── src/                   # Código fuente
├── public/                # Archivos estáticos
├── dist/                  # Build output (generado, no commitear)
└── astro.config.mjs       # Configuración de Astro
```

## 🤖 Despliegue Automático

El proyecto usa **GitHub Actions** para despliegue automático a GitHub Pages.

### Funcionamiento

1. Cada push a la rama `main` activa el workflow
2. El workflow construye el proyecto con `pnpm build`
3. El resultado se sube a GitHub Pages automáticamente
4. El sitio se actualiza en minutos

### Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

### Verificar Estado del Despliegue

1. Ve a tu repositorio en GitHub
2. Clic en la pestaña **Actions**
3. Verifica el estado del último workflow
4. Si hay errores, revisa los logs

## 🛠️ Despliegue Manual

### Opción 1: Desde GitHub (Recomendado)

1. Ve a **Actions** en tu repositorio
2. Selecciona el workflow "Deploy to GitHub Pages"
3. Clic en **Run workflow**
4. Selecciona la rama `main`
5. Clic en **Run workflow**

### Opción 2: Desde la Terminal

```bash
# 1. Asegúrate de estar en la rama main
git checkout main

# 2. Actualiza desde remoto
git pull origin main

# 3. Construye el proyecto
pnpm build

# 4. El GitHub Action se encargará del resto después del push
git add .
git commit -m "🚀 deploy: trigger manual deployment"
git push origin main
```

## 🔧 Configuración de GitHub Pages

### Primera Vez - Configuración Requerida

1. Ve a **Settings** → **Pages** en tu repositorio
2. En **Source**, selecciona:
   - Source: `GitHub Actions` (recomendado)
   - O Branch: `gh-pages` / `root` (método clásico)
3. Guarda los cambios
4. Tu sitio estará disponible en: `https://chrisvdev.github.io/CVTalk/`

### Configuración Recomendada

```
Source: GitHub Actions
Custom domain: (opcional)
Enforce HTTPS: ✓ Activado
```

## 🌐 URLs del Proyecto

- **Producción**: https://chrisvdev.github.io/CVTalk/
- **Desarrollo**: http://localhost:4321/
- **Preview**: http://localhost:4321/ (después de `pnpm build && pnpm preview`)

### Usar en OBS Studio

**URL de Producción:**
```
https://chrisvdev.github.io/CVTalk/?channel=tu_canal
```

**URL de Desarrollo:**
```
http://localhost:4321/?channel=tu_canal
```

## 🐛 Solución de Problemas

### El sitio no carga (404)

**Causa**: Configuración incorrecta del `base` en `astro.config.mjs`

**Solución**:
```javascript
export default defineConfig({
  site: 'https://chrisvdev.github.io',
  base: '/CVTalk',  // Debe coincidir con el nombre del repo
});
```

### Los assets no cargan

**Causa**: Rutas absolutas en lugar de relativas

**Solución**: Usa rutas relativas o con el helper `import.meta.env.BASE_URL`

```javascript
// ❌ Mal
<img src="/logo.png" />

// ✅ Bien
<img src={`${import.meta.env.BASE_URL}logo.png`} />
```

### El workflow falla

**Problemas comunes:**

1. **Permisos insuficientes**
   - Ve a **Settings** → **Actions** → **General**
   - En "Workflow permissions", selecciona "Read and write permissions"

2. **Node.js version**
   - Verifica que el workflow use Node.js >= 22.12.0

3. **Dependencias**
   - Asegúrate de que `pnpm-lock.yaml` esté committeado
   - Verifica que todas las dependencias estén en `package.json`

### El chat no se conecta en producción

**Causa**: Restricciones de CORS o WebSocket

**Solución**: GitHub Pages soporta WebSockets, pero verifica:
- El canal existe y está activo
- El parámetro `?channel=` está en la URL
- No hay bloqueadores de contenido activos

## 🔄 Actualizar el Sitio

```bash
# 1. Haz cambios en tu código
# 2. Commit y push a main
git add .
git commit -m "✨ feat: nueva característica"
git push origin main

# 3. El sitio se actualizará automáticamente en ~2 minutos
```

## 📊 Monitoreo

### Ver Logs del Despliegue

1. **GitHub Actions**:
   - Actions → Último workflow → Ver logs detallados

2. **Build local**:
   ```bash
   pnpm build
   # Revisa errores en la terminal
   ```

3. **Preview local**:
   ```bash
   pnpm build && pnpm preview
   # Abre http://localhost:4321
   ```

## 🔐 Seguridad

- ✅ El sitio usa HTTPS automáticamente
- ✅ No se exponen credenciales (conexión anónima a IRC)
- ✅ Solo lectura de chat público
- ⚠️ No agregues secrets en el código
- ⚠️ Usa GitHub Secrets para datos sensibles (si es necesario)

## 📝 Notas Adicionales

### Cache

GitHub Pages cachea los archivos. Si no ves cambios:
- Espera 5-10 minutos
- Haz hard refresh: `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
- Abre en ventana privada/incógnito

### Límites de GitHub Pages

- **Tamaño del sitio**: Max 1 GB
- **Bandwidth**: 100 GB/mes
- **Builds**: 10 por hora

Para este proyecto, estos límites son más que suficientes.

## 🆘 Ayuda

Si tienes problemas con el despliegue:

1. Revisa los [logs de GitHub Actions](https://github.com/chrisvdev/CVTalk/actions)
2. Consulta la [documentación de Astro](https://docs.astro.build/en/guides/deploy/github/)
3. Abre un [issue en GitHub](https://github.com/chrisvdev/CVTalk/issues)

---

**Última actualización**: Mayo 2026
