import { useState, useEffect, useRef } from "react";
import { AREAS, LETRAS, C, fmt, nivelEstimado } from "../theme.js";

// ─── Componente genérico de examen: recibe el banco y la duración por props ───

export default function Simulacro({ examen, onSalir, onFinalizar }) {
  const QUESTIONS = examen.questions;
  const N = QUESTIONS.length;
  const TOTAL_SEG = examen.minutos * 60;

  const [fase, setFase] = useState("inicio"); // inicio | examen | resultados | revision
  const [actual, setActual] = useState(0);
  const [resp, setResp] = useState(Array(N).fill(null));
  const [marcadas, setMarcadas] = useState(new Set());
  const [seg, setSeg] = useState(TOTAL_SEG);
  const [verHoja, setVerHoja] = useState(false);
  const [filtroRev, setFiltroRev] = useState("mal"); // mal | todas
  const [confirmar, setConfirmar] = useState(false);
  const timerRef = useRef(null);
  const reportadoRef = useRef(false);

  // Reporta el intento una sola vez al llegar a resultados (historial + banco de errores)
  useEffect(() => {
    if (fase !== "resultados" || reportadoRef.current) return;
    reportadoRef.current = true;
    if (onFinalizar) onFinalizar(resp);
  }, [fase, resp, onFinalizar]);

  useEffect(() => {
    if (fase !== "examen") return;
    timerRef.current = setInterval(() => {
      setSeg((s) => {
        if (s <= 1) { clearInterval(timerRef.current); setFase("resultados"); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [fase]);

  const q = QUESTIONS[actual];
  const contestadas = resp.filter((r) => r !== null).length;

  const responder = (i) => {
    const nr = [...resp];
    nr[actual] = i;
    setResp(nr);
  };

  const marcar = () => {
    const m = new Set(marcadas);
    m.has(actual) ? m.delete(actual) : m.add(actual);
    setMarcadas(m);
  };

  const terminar = () => { clearInterval(timerRef.current); setConfirmar(false); setFase("resultados"); };

  const reiniciar = () => {
    reportadoRef.current = false;
    setResp(Array(N).fill(null));
    setMarcadas(new Set());
    setSeg(TOTAL_SEG);
    setActual(0);
    setVerHoja(false);
    setFase("inicio");
  };

  // ── Resultados por área (solo áreas presentes en este banco) ──
  const porArea = Object.keys(AREAS)
    .map((k) => {
      const idx = QUESTIONS.map((qq, i) => (qq.a === k ? i : -1)).filter((i) => i >= 0);
      if (idx.length === 0) return null;
      const ok = idx.filter((i) => resp[i] === QUESTIONS[i].r).length;
      return { k, ok, total: idx.length, pct: Math.round((ok / idx.length) * 100) };
    })
    .filter(Boolean);
  const totalOk = porArea.reduce((s, a) => s + a.ok, 0);
  const pctGlobal = Math.round((totalOk / N) * 100);

  const timerColor = seg < 300 ? C.mal : seg < 1200 ? C.ambar : C.tinta;

  // ═══════════ INICIO ═══════════
  if (fase === "inicio") {
    const porAreaConteo = Object.keys(AREAS)
      .map((k) => ({ k, n: QUESTIONS.filter((qq) => qq.a === k).length }))
      .filter((x) => x.n > 0);
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.papel, color: C.tinta }}>
        <div className="w-full max-w-md">
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.guinda }}>Simulacro · no oficial</p>
          <h1 className="text-3xl font-bold leading-tight mb-1">{examen.titulo}</h1>
          <p className="text-sm mb-6" style={{ color: C.grafito }}>{examen.sub}</p>

          <div className="rounded-lg border p-4 mb-4" style={{ borderColor: C.linea, background: "#FFFFFF" }}>
            {[
              [String(N), "reactivos de opción múltiple"],
              [fmt(TOTAL_SEG), "cronómetro (ritmo real: ~2.3 min por reactivo)"],
              [porAreaConteo.map((x) => x.n).join(" + "), porAreaConteo.map((x) => AREAS[x.k].corto).join(", ")],
            ].map(([n, t]) => (
              <div key={t} className="flex items-baseline gap-3 py-2 border-b last:border-0" style={{ borderColor: C.linea }}>
                <span className="font-mono font-bold text-lg" style={{ color: C.guinda }}>{n}</span>
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>

          <ul className="text-xs space-y-1 mb-6" style={{ color: C.grafito }}>
            <li>· El examen termina solo al agotarse el tiempo.</li>
            <li>· Puedes marcar reactivos para revisarlos después.</li>
            <li>· Al final: calificación por área, explicaciones y estimación de nivel.</li>
          </ul>

          <button onClick={() => setFase("examen")} className="w-full py-3 rounded-lg font-semibold text-white active:opacity-80" style={{ background: C.guinda }}>
            Iniciar simulacro
          </button>
          <button onClick={onSalir} className="w-full py-3 rounded-lg font-semibold text-sm mt-2" style={{ color: C.grafito }}>
            ← Volver al menú
          </button>
        </div>
      </div>
    );
  }

  // ═══════════ EXAMEN ═══════════
  if (fase === "examen") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: C.papel, color: C.tinta }}>
        {/* Barra superior */}
        <div className="sticky top-0 z-10 border-b px-4 py-2 flex items-center justify-between" style={{ background: C.papel, borderColor: C.linea }}>
          <span className="font-mono text-sm">
            <b>{actual + 1}</b><span style={{ color: C.grafito }}>/{N}</span>
          </span>
          <span className={`font-mono font-bold text-lg ${seg < 300 ? "animate-pulse" : ""}`} style={{ color: timerColor }}>
            {fmt(seg)}
          </span>
          <button onClick={() => setVerHoja(!verHoja)} className="text-xs font-semibold px-2 py-1 rounded border" style={{ borderColor: C.guinda, color: C.guinda }}>
            Hoja {contestadas}/{N}
          </button>
        </div>

        {/* Hoja de respuestas (lector óptico) */}
        {verHoja && (
          <div className="border-b px-4 py-3" style={{ background: "#FFFFFF", borderColor: C.linea }}>
            <div className="grid grid-cols-10 gap-1">
              {QUESTIONS.map((_, i) => {
                const cont = resp[i] !== null;
                const marc = marcadas.has(i);
                return (
                  <button key={i} onClick={() => { setActual(i); setVerHoja(false); }}
                    className="aspect-square rounded-full text-xs font-mono flex items-center justify-center border"
                    style={{
                      background: cont ? C.tinta : "transparent",
                      color: cont ? "#FFF" : C.grafito,
                      borderColor: marc ? C.ambar : i === actual ? C.guinda : C.linea,
                      borderWidth: marc || i === actual ? 2 : 1,
                    }}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs" style={{ color: C.grafito }}>● contestada &nbsp; ◎ marcada</p>
              <button onClick={() => setConfirmar(true)} className="text-xs font-semibold px-3 py-1.5 rounded text-white" style={{ background: C.guinda }}>
                Finalizar examen
              </button>
            </div>
          </div>
        )}

        {/* Confirmación */}
        {confirmar && (
          <div className="fixed inset-0 z-20 flex items-center justify-center p-6" style={{ background: "rgba(28,39,51,0.55)" }}>
            <div className="rounded-lg p-5 w-full max-w-sm" style={{ background: "#FFF" }}>
              <p className="font-semibold mb-1">¿Finalizar el simulacro?</p>
              <p className="text-sm mb-4" style={{ color: C.grafito }}>
                Llevas {contestadas} de {N} contestadas{contestadas < N ? ` (${N - contestadas} sin responder)` : ""}.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmar(false)} className="flex-1 py-2 rounded border font-semibold text-sm" style={{ borderColor: C.linea }}>Continuar</button>
                <button onClick={terminar} className="flex-1 py-2 rounded font-semibold text-sm text-white" style={{ background: C.guinda }}>Finalizar</button>
              </div>
            </div>
          </div>
        )}

        {/* Reactivo */}
        <div className="flex-1 px-4 py-4 max-w-xl w-full mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.guinda }}>
            {AREAS[q.a].nombre}{q.lectura ? ` · ${q.lectura}` : ""}
          </p>
          {q.ctx && (
            <pre className="text-sm whitespace-pre-wrap rounded-lg border p-3 mb-3 leading-relaxed" style={{ background: "#FFF", borderColor: C.linea, fontFamily: q.a === "a3" ? "monospace" : "inherit" }}>
              {q.ctx}
            </pre>
          )}
          <p className="font-medium leading-relaxed mb-4">{q.q}</p>

          <div className="space-y-2">
            {q.o.map((op, i) => {
              const sel = resp[actual] === i;
              return (
                <button key={i} onClick={() => responder(i)}
                  className="w-full flex items-start gap-3 text-left rounded-lg border p-3 active:opacity-80"
                  style={{ background: sel ? C.guindaSuave : "#FFF", borderColor: sel ? C.guinda : C.linea, borderWidth: sel ? 2 : 1 }}>
                  <span className="font-mono text-sm w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0"
                    style={{ background: sel ? C.guinda : "transparent", color: sel ? "#FFF" : C.grafito, borderColor: sel ? C.guinda : C.linea }}>
                    {LETRAS[i]}
                  </span>
                  <span className="text-sm leading-relaxed">{op}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navegación */}
        <div className="sticky bottom-0 border-t px-4 py-3 flex gap-2" style={{ background: C.papel, borderColor: C.linea }}>
          <button onClick={() => setActual(Math.max(0, actual - 1))} disabled={actual === 0}
            className="flex-1 py-2.5 rounded-lg border font-semibold text-sm disabled:opacity-30" style={{ borderColor: C.linea }}>
            ← Anterior
          </button>
          <button onClick={marcar} className="px-4 py-2.5 rounded-lg border font-semibold text-sm"
            style={{ borderColor: C.ambar, color: marcadas.has(actual) ? "#FFF" : C.ambar, background: marcadas.has(actual) ? C.ambar : "transparent" }}>
            ⚑
          </button>
          {actual < N - 1 ? (
            <button onClick={() => setActual(actual + 1)} className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white" style={{ background: C.tinta }}>
              Siguiente →
            </button>
          ) : (
            <button onClick={() => setConfirmar(true)} className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white" style={{ background: C.guinda }}>
              Finalizar
            </button>
          )}
        </div>
      </div>
    );
  }

  // ═══════════ RESULTADOS ═══════════
  if (fase === "resultados") {
    const nivel = nivelEstimado(pctGlobal);
    return (
      <div className="min-h-screen p-4" style={{ background: C.papel, color: C.tinta }}>
        <div className="max-w-md mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.guinda }}>Resultados · {examen.titulo}</p>
          <div className="flex items-end gap-3 mb-1">
            <span className="font-mono text-6xl font-bold leading-none">{pctGlobal}<span className="text-2xl">%</span></span>
            <span className="text-sm pb-1" style={{ color: C.grafito }}>{totalOk} de {N} aciertos</span>
          </div>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6" style={{ background: nivel.bg, color: nivel.c }}>
            {nivel.t}
          </span>

          <div className="rounded-lg border p-4 mb-4 space-y-3" style={{ background: "#FFF", borderColor: C.linea }}>
            {porArea.map((a) => (
              <div key={a.k}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{AREAS[a.k].corto}</span>
                  <span className="font-mono" style={{ color: C.grafito }}>{a.ok}/{a.total} · {a.pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: C.linea }}>
                  <div className="h-2 rounded-full" style={{ width: `${a.pct}%`, background: a.pct >= 53 ? C.ok : C.mal }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs mb-6 leading-relaxed" style={{ color: C.grafito }}>
            Estimación no oficial: CENEVAL califica con el Índice CENEVAL (700–1300) por área, no con porcentajes.
            Los umbrales aquí usados (~53% satisfactorio, ~75% sobresaliente) son solo una referencia de estudio.
          </p>

          <div className="space-y-2">
            <button onClick={() => { setFiltroRev("mal"); setFase("revision"); }} className="w-full py-3 rounded-lg font-semibold text-white" style={{ background: C.guinda }}>
              Revisar mis errores ({N - totalOk})
            </button>
            <button onClick={() => { setFiltroRev("todas"); setFase("revision"); }} className="w-full py-3 rounded-lg font-semibold border" style={{ borderColor: C.linea }}>
              Revisar todos los reactivos
            </button>
            <button onClick={reiniciar} className="w-full py-3 rounded-lg font-semibold text-sm" style={{ color: C.grafito }}>
              Reiniciar simulacro
            </button>
            <button onClick={onSalir} className="w-full py-3 rounded-lg font-semibold text-sm" style={{ color: C.grafito }}>
              ← Volver al menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ REVISIÓN ═══════════
  const lista = QUESTIONS.map((qq, i) => ({ ...qq, i })).filter((qq) => filtroRev === "todas" || resp[qq.i] !== qq.r);
  return (
    <div className="min-h-screen p-4" style={{ background: C.papel, color: C.tinta }}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: C.guinda }}>
            Revisión · {filtroRev === "mal" ? "errores" : "todos"} ({lista.length})
          </p>
          <button onClick={() => setFase("resultados")} className="text-xs font-semibold px-3 py-1.5 rounded border" style={{ borderColor: C.guinda, color: C.guinda }}>
            ← Resultados
          </button>
        </div>

        <div className="space-y-4 pb-8">
          {lista.map((qq) => {
            const mia = resp[qq.i];
            const bien = mia === qq.r;
            return (
              <div key={qq.i} className="rounded-lg border p-4" style={{ background: "#FFF", borderColor: bien ? C.ok : C.mal }}>
                <p className="font-mono text-xs mb-2" style={{ color: C.grafito }}>
                  #{qq.i + 1} · {AREAS[qq.a].corto}
                </p>
                {qq.ctx && <pre className="text-xs whitespace-pre-wrap rounded border p-2 mb-2" style={{ borderColor: C.linea, background: C.papel }}>{qq.ctx}</pre>}
                <p className="text-sm font-medium mb-3">{qq.q}</p>
                <div className="space-y-1.5 mb-3">
                  {qq.o.map((op, j) => {
                    const esCorrecta = j === qq.r, esMia = j === mia;
                    return (
                      <div key={j} className="flex items-start gap-2 text-sm rounded px-2 py-1.5"
                        style={{
                          background: esCorrecta ? C.okSuave : esMia ? C.malSuave : "transparent",
                          color: esCorrecta ? C.ok : esMia ? C.mal : C.tinta,
                        }}>
                        <span className="font-mono font-bold">{LETRAS[j]}</span>
                        <span>{op}{esCorrecta ? " ✓" : esMia ? " ✗ (tu respuesta)" : ""}</span>
                      </div>
                    );
                  })}
                  {mia === null && <p className="text-xs italic" style={{ color: C.mal }}>Sin responder</p>}
                </div>
                <p className="text-xs leading-relaxed rounded p-2" style={{ background: C.papel, color: C.grafito }}>
                  <b style={{ color: C.tinta }}>Explicación:</b> {qq.e}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
