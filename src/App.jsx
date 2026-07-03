import { useMemo, useState } from "react";
import { C } from "./theme.js";
import { EXAMENES } from "./data/examenes.js";
import { registrarIntento, construirExamenErrores, contarErrores, obtenerHistorial } from "./storage.js";
import Simulacro from "./components/Simulacro.jsx";
import Flashcards from "./components/Flashcards.jsx";
import Progreso from "./components/Progreso.jsx";

// ─── Datos duros del examen real (CENEVAL, EGEL PLUS ISOFT) ───
const FICHA_EXAMEN = [
  ["203", "reactivos en el examen real"],
  ["2 × 4 h", "dos sesiones de aplicación de 4 horas cada una"],
  ["4 + 1", "áreas disciplinares (Análisis, Diseño, Desarrollo, Gestión e implantación) + sección Transversal"],
];

const REGLAS_ORO = [
  "El formato dominante es caso → clasifica: te dan un escenario y eliges el concepto.",
  "Área 3 (Desarrollo) es donde más truena la gente a nivel nacional: dale prioridad.",
  "No se penalizan errores: nunca dejes reactivos en blanco.",
  "El distractor favorito es el «concepto hermano» (carga vs estrés, include vs extend, PUT vs PATCH).",
  "Ritmo: ~2.3 min por reactivo; si uno te come 3+ minutos, márcalo ⚑ y sigue.",
];

export default function App() {
  const [vista, setVista] = useState("menu"); // menu | tarjetas | progreso | errores | id de examen
  const [verFicha, setVerFicha] = useState(false);

  const examenErrores = useMemo(
    () => (vista === "errores" ? construirExamenErrores(EXAMENES) : null),
    [vista]
  );

  if (vista === "tarjetas") return <Flashcards onSalir={() => setVista("menu")} />;
  if (vista === "progreso") return <Progreso onSalir={() => setVista("menu")} />;
  if (examenErrores) {
    return <Simulacro key="errores" examen={examenErrores} onSalir={() => setVista("menu")}
      onFinalizar={(resp) => registrarIntento(examenErrores, resp)} />;
  }

  const examen = EXAMENES.find((e) => e.id === vista);
  if (examen) {
    return <Simulacro key={examen.id} examen={examen} onSalir={() => setVista("menu")}
      onFinalizar={(resp) => registrarIntento(examen, resp)} />;
  }

  const nErrores = contarErrores();
  const nIntentos = obtenerHistorial().length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.papel, color: C.tinta }}>
      <div className="w-full max-w-md py-6">
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.guinda }}>Simulador · no oficial</p>
        <h1 className="text-3xl font-bold leading-tight mb-1">EGEL PLUS ISOFT</h1>
        <p className="text-sm mb-6" style={{ color: C.grafito }}>Ingeniería de Software · elige tu sesión de estudio</p>

        {/* Exámenes */}
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.grafito }}>Simulacros</p>
        <div className="space-y-2 mb-6">
          {EXAMENES.map((e) => (
            <button key={e.id} onClick={() => setVista(e.id)}
              className="w-full text-left rounded-lg border p-4 active:opacity-80"
              style={{ background: "#FFF", borderColor: C.linea }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{e.titulo}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: C.guindaSuave, color: C.guinda }}>
                  {e.questions.length} · {Math.floor(e.minutos / 60)}h{String(e.minutos % 60).padStart(2, "0")}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: C.grafito }}>{e.sub}</p>
            </button>
          ))}

          {/* Banco de errores */}
          <button onClick={() => nErrores > 0 && setVista("errores")} disabled={nErrores === 0}
            className="w-full text-left rounded-lg border p-4 active:opacity-80 disabled:opacity-50"
            style={{ background: "#FFF", borderColor: nErrores > 0 ? C.mal : C.linea }}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold" style={{ color: nErrores > 0 ? C.mal : C.grafito }}>🩹 Mis errores</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: C.malSuave, color: C.mal }}>
                {nErrores} pendiente{nErrores === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.grafito }}>
              {nErrores > 0
                ? "Reactivos fallados en cualquier simulacro. Cada uno sale del banco al acertarlo 2 veces seguidas."
                : "Aquí se acumulan automáticamente los reactivos que falles en los simulacros."}
            </p>
          </button>
        </div>

        {/* Repaso y seguimiento */}
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.grafito }}>Repaso y seguimiento</p>
        <button onClick={() => setVista("tarjetas")}
          className="w-full text-left rounded-lg border-2 p-4 active:opacity-80 mb-2"
          style={{ background: C.guindaSuave, borderColor: C.guinda }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold" style={{ color: C.guinda }}>🃏 Tarjetas de memorización</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.grafito }}>
            +110 tarjetas pregunta/respuesta de las 5 áreas, con filtros, barajado y registro de las que ya dominas.
          </p>
        </button>
        <button onClick={() => setVista("progreso")}
          className="w-full text-left rounded-lg border p-4 active:opacity-80 mb-6"
          style={{ background: "#FFF", borderColor: C.linea }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold">📈 Progreso por área</span>
            {nIntentos > 0 && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: C.okSuave, color: C.ok }}>
                {nIntentos} intento{nIntentos === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.grafito }}>
            Evolución de tu % por área en cada intento, contra los umbrales de satisfactorio y sobresaliente.
          </p>
        </button>

        {/* Ficha del examen real */}
        <button onClick={() => setVerFicha(!verFicha)}
          className="w-full flex items-center justify-between text-xs font-semibold px-1 py-2"
          style={{ color: C.grafito }}>
          <span className="font-mono tracking-widest uppercase">Sobre el examen real</span>
          <span>{verFicha ? "▲" : "▼"}</span>
        </button>
        {verFicha && (
          <div className="rounded-lg border p-4" style={{ background: "#FFF", borderColor: C.linea }}>
            {FICHA_EXAMEN.map(([n, t]) => (
              <div key={t} className="flex items-baseline gap-3 py-2 border-b" style={{ borderColor: C.linea }}>
                <span className="font-mono font-bold text-lg flex-shrink-0" style={{ color: C.guinda }}>{n}</span>
                <span className="text-sm">{t}</span>
              </div>
            ))}
            <ul className="text-xs space-y-1.5 pt-3" style={{ color: C.grafito }}>
              {REGLAS_ORO.map((r) => <li key={r}>· {r}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
