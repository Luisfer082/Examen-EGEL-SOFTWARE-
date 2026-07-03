# Simulador EGEL PLUS ISOFT

App de práctica (no oficial) para el EGEL PLUS de Ingeniería de Software (CENEVAL): simulacros cronometrados con hoja de respuestas, revisión con explicaciones y tarjetas de memorización.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción en dist/
```

## Contenido

| Sesión | Reactivos | Tiempo |
|---|---|---|
| Simulacro 2 · General (banco nuevo) | 60 (12 por área) | 2:20 h |
| Simulacro 1 · General (banco original) | 60 (12 por área) | 2:20 h |
| Intensivo · Área 3 Desarrollo | 30 | 1:10 h |
| Mis errores (banco automático) | los que falles | ~2.3 min c/u |
| Tarjetas de memorización | 116 tarjetas P/R | libre |

**Banco de errores:** todo reactivo fallado (o dejado en blanco) entra automáticamente; sale al acertarlo 2 veces seguidas. **Progreso:** gráfica de % por área a través de los intentos, contra los umbrales de ~53% (satisfactorio) y ~75% (sobresaliente). Ambos persisten en localStorage del navegador.

Áreas: Análisis, Diseño, Desarrollo, Gestión e implantación, y sección Transversal (lenguaje y comunicación). El examen real tiene 203 reactivos en dos sesiones de 4 horas; el ritmo de los simulacros (~2.3 min/reactivo) replica el real.

## Estructura

```
├─ index.html
├─ vite.config.js
├─ docs/                  # material de estudio en markdown (fuente de las tarjetas)
└─ src/
   ├─ main.jsx
   ├─ App.jsx             # menú: exámenes, mis errores, tarjetas, progreso, ficha del examen
   ├─ theme.js            # colores, áreas y utilidades compartidas
   ├─ storage.js          # localStorage: historial de intentos y banco de errores
   ├─ components/
   │  ├─ Simulacro.jsx    # examen genérico: cronómetro, hoja, resultados, revisión
   │  ├─ Flashcards.jsx   # tarjetas con filtro por área y progreso en localStorage
   │  └─ Progreso.jsx     # gráfica de evolución por área + lista de intentos
   └─ data/
      ├─ examenes.js      # registro de exámenes disponibles
      ├─ simulacro1.js    # banco original · 60 reactivos
      ├─ simulacro2.js    # banco nuevo · 60 reactivos
      ├─ intensivoA3.js   # 30 reactivos de Desarrollo
      └─ flashcards.js    # 116 tarjetas de memorización
```

Para agregar un examen: crear un archivo en `src/data/` que exporte `{ id, titulo, sub, minutos, questions }` (cada reactivo: `{ a, q, o, r, e, ctx?, lectura? }`) y sumarlo a `src/data/examenes.js`.
