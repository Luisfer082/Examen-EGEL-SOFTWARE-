import { useMemo, useState } from "react";
import { AREAS, C } from "../theme.js";
import { FLASHCARDS } from "../data/flashcards.js";

const LS_KEY = "egel-tarjetas-dominadas";

function cargarDominadas() {
  try { return new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]")); }
  catch { return new Set(); }
}

function claveDe(card) {
  return `${card.a}|${card.p}`;
}

function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards({ onSalir }) {
  const [filtro, setFiltro] = useState("todas"); // todas | a1..a4 | tr
  const [ocultarDominadas, setOcultarDominadas] = useState(false);
  const [orden, setOrden] = useState(null); // null = orden original; array = barajado
  const [idx, setIdx] = useState(0);
  const [volteada, setVolteada] = useState(false);
  const [dominadas, setDominadas] = useState(cargarDominadas);

  const baraja = useMemo(() => {
    let cards = orden || FLASHCARDS;
    if (filtro !== "todas") cards = cards.filter((c) => c.a === filtro);
    if (ocultarDominadas) cards = cards.filter((c) => !dominadas.has(claveDe(c)));
    return cards;
  }, [filtro, orden, ocultarDominadas, dominadas]);

  const card = baraja[Math.min(idx, baraja.length - 1)];
  const pos = Math.min(idx, baraja.length - 1);

  const cambiarFiltro = (f) => { setFiltro(f); setIdx(0); setVolteada(false); };

  const mover = (d) => {
    if (baraja.length === 0) return;
    setIdx((pos + d + baraja.length) % baraja.length);
    setVolteada(false);
  };

  const toggleDominada = () => {
    if (!card) return;
    const k = claveDe(card);
    const s = new Set(dominadas);
    s.has(k) ? s.delete(k) : s.add(k);
    setDominadas(s);
    localStorage.setItem(LS_KEY, JSON.stringify([...s]));
  };

  const totalPorFiltro = filtro === "todas" ? FLASHCARDS : FLASHCARDS.filter((c) => c.a === filtro);
  const dominadasEnFiltro = totalPorFiltro.filter((c) => dominadas.has(claveDe(c))).length;

  const filtros = [["todas", "Todas"], ...Object.keys(AREAS).map((k) => [k, AREAS[k].corto])];

  return (
    <div className="min-h-screen flex flex-col p-4" style={{ background: C.papel, color: C.tinta }}>
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: C.guinda }}>Tarjetas de memorización</p>
          <button onClick={onSalir} className="text-xs font-semibold px-3 py-1.5 rounded border" style={{ borderColor: C.guinda, color: C.guinda }}>
            ← Menú
          </button>
        </div>

        {/* Filtros por área */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {filtros.map(([k, t]) => (
            <button key={k} onClick={() => cambiarFiltro(k)}
              className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{
                background: filtro === k ? C.guinda : "transparent",
                color: filtro === k ? "#FFF" : C.grafito,
                borderColor: filtro === k ? C.guinda : C.linea,
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Progreso */}
        <div className="flex items-center justify-between text-xs mb-3" style={{ color: C.grafito }}>
          <span className="font-mono">{baraja.length === 0 ? "0/0" : `${pos + 1}/${baraja.length}`}</span>
          <span>✓ dominadas: <b style={{ color: C.ok }}>{dominadasEnFiltro}</b> de {totalPorFiltro.length}</span>
        </div>

        {/* Tarjeta */}
        {card ? (
          <button onClick={() => setVolteada(!volteada)}
            className="w-full flex-1 min-h-64 rounded-xl border-2 p-6 flex flex-col items-center justify-center text-center active:opacity-90 mb-3"
            style={{
              background: volteada ? C.guindaSuave : "#FFF",
              borderColor: dominadas.has(claveDe(card)) ? C.ok : volteada ? C.guinda : C.linea,
            }}>
            <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: volteada ? C.guinda : C.grafito }}>
              {AREAS[card.a].corto} · {volteada ? "Respuesta" : "Pregunta"}
            </p>
            <p className={`leading-relaxed ${volteada ? "text-base" : "text-lg font-semibold"}`}>
              {volteada ? card.r : card.p}
            </p>
            <p className="text-xs mt-5" style={{ color: C.grafito }}>
              {volteada ? "toca para ver la pregunta" : "toca para voltear"}
            </p>
          </button>
        ) : (
          <div className="w-full flex-1 min-h-64 rounded-xl border-2 border-dashed p-6 flex items-center justify-center text-center mb-3" style={{ borderColor: C.linea }}>
            <p className="text-sm" style={{ color: C.grafito }}>
              🎉 No quedan tarjetas pendientes con este filtro.<br />Desactiva «ocultar dominadas» o cambia de área.
            </p>
          </div>
        )}

        {/* Acciones sobre la tarjeta */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => mover(-1)} disabled={baraja.length === 0}
            className="flex-1 py-2.5 rounded-lg border font-semibold text-sm disabled:opacity-30" style={{ borderColor: C.linea }}>
            ← Anterior
          </button>
          <button onClick={toggleDominada} disabled={!card}
            className="px-4 py-2.5 rounded-lg border font-semibold text-sm disabled:opacity-30"
            style={{
              borderColor: C.ok,
              color: card && dominadas.has(claveDe(card)) ? "#FFF" : C.ok,
              background: card && dominadas.has(claveDe(card)) ? C.ok : "transparent",
            }}>
            ✓ La sé
          </button>
          <button onClick={() => mover(1)} disabled={baraja.length === 0}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white disabled:opacity-30" style={{ background: C.tinta }}>
            Siguiente →
          </button>
        </div>

        {/* Opciones de la baraja */}
        <div className="flex gap-2 pb-2">
          <button onClick={() => { setOrden(barajar(FLASHCARDS)); setIdx(0); setVolteada(false); }}
            className="flex-1 py-2 rounded-lg border font-semibold text-xs" style={{ borderColor: C.linea, color: C.grafito }}>
            🔀 Barajar
          </button>
          <button onClick={() => { setOcultarDominadas(!ocultarDominadas); setIdx(0); setVolteada(false); }}
            className="flex-1 py-2 rounded-lg border font-semibold text-xs"
            style={{
              borderColor: ocultarDominadas ? C.ok : C.linea,
              color: ocultarDominadas ? "#FFF" : C.grafito,
              background: ocultarDominadas ? C.ok : "transparent",
            }}>
            {ocultarDominadas ? "Mostrando solo pendientes" : "Ocultar dominadas"}
          </button>
        </div>
      </div>
    </div>
  );
}
