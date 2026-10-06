# Lumora

Prototipo front-end (React 18 + Vite + React Router + framer-motion).
Exportado de Magic Patterns. El estilo es CSS propio (`src/index.css` y un `.css` por pantalla).

## Cómo correrlo

```bash
npm install
npm run dev
```

## Rutas

- `/` onboarding · `/perfil` elegir perfil · `/ingresar/:role` login (públicas)
- `/app/*` espacio del empleado · `/equipo/*` espacio del líder (protegidas por rol)

## Sesión

`src/utils/session.js` guarda la sesión en `localStorage` (clave `lumora-session`).
Las guardias están en `src/components/RouteGuards.jsx`.
Las tareas, el equipo y Lumi siguen en memoria y se pierden al recargar.
El login es simulado: cuando exista el backend, hay que cambiar `signIn`/`signOut`
en `src/contexts/AppDataContext.jsx` y guardar el token en `session.js`.
