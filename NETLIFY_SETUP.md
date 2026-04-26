# Sabores de Salamina - Restaurante App

Aplicación Next.js 16 para el restaurante **Sabores de Salamina**, especializado en eventos y catering con cocina tradicional de la región cafetera.

## 🚀 Despliegue en Netlify

Este proyecto está configurado para desplegarse automáticamente en Netlify con soporte completo para todas las características de Next.js.

### Requisitos Previos

- Cuenta en [Netlify](https://netlify.com)
- Repositorio en GitHub, GitLab o Bitbucket
- Variables de entorno de Supabase

### Pasos para Desplegar

1. **Conectar Repositorio en Netlify**
   - Ve a [Netlify Dashboard](https://app.netlify.com)
   - Click en "New site from Git"
   - Selecciona tu proveedor Git (GitHub, GitLab, Bitbucket)
   - Autoriza Netlify y selecciona el repositorio `sabores-salamina`

2. **Configurar Build**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - Netlify detectará automáticamente `netlify.toml`

3. **Configurar Variables de Entorno**
   - En Netlify Dashboard → Site settings → Build & deploy → Environment
   - Agrega las siguientes variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://whqsvkcgfupjvjudlxtl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NETLIFY_NEXT_SKEW_PROTECTION=true
   ```

4. **Deploy**
   - Click en "Deploy"
   - Netlify comenzará el build automáticamente

### Características Configuradas

✅ **Soporte Next.js Completo**
- App Router con Server Components
- Server Actions
- Middleware
- Route Handlers
- Image Optimization con Netlify Image CDN
- Skew Protection habilitada

✅ **Optimizaciones de Caché**
- Archivos estáticos (`.next/static/`) cacheados por 1 año
- Imágenes optimizadas cacheadas por 1 año
- Archivos públicos cacheados por 24 horas

✅ **Arquitectura**
- OpenNext Adapter para provisión automática de:
  - Serverless Functions para SSR, ISR, Server Actions
  - Edge Functions para Middleware
  - Configuration de caching automática

### Archivos de Configuración

- **`netlify.toml`** - Configuración de build y deploy
- **`next.config.mjs`** - Configuración de Next.js con soporte de despliegue
- **`.env.example`** - Template de variables de entorno

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción (similar a Netlify)
npm run build
npm run start
```

### Tecnologías

- **Framework:** Next.js 16.2.4 (App Router)
- **React:** 19+
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Supabase
- **Deployment:** Netlify (OpenNext)
- **Notifications:** Sonner
- **Auth:** Supabase Auth

### Documentación

- [Docs Netlify + Next.js](https://docs.netlify.com/frameworks/next-js/)
- [OpenNext Adapter](https://opennext.js.org/netlify)
- [Next.js Documentation](https://nextjs.org/docs)

### Soporte

Para preguntas sobre despliegue en Netlify, consulta la [documentación oficial](https://docs.netlify.com/frameworks/next-js/).
