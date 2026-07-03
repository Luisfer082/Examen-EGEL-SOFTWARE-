import { useState } from "react";
import { AREAS, AREA_COLORS, C, nivelEstimado } from "../theme.js";
import { obtenerHistorial, borrarHistorial } from "../storage.js";

// ─── Progreso: gráfica de % por área a través de los intentos + lista de intentos ───

function fechaCorta(iso) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

export default function Progreso({ onSalir }) {
  const [historial, setHistorial] = useState(obtenerHistorial);
  const [ocultas, setOcultas] = useState(new Set());
  const [sel, setSel] = useState(null);
  const [confirmaBorrar, setConfirmaBorrar] = useState(false);

  // La gráfica usa solo simulacros completos (las rondas de "Mis errores" sesgan a la baja)
  const datos = historial.filter((h) => !h.errores).slice(-10);
  const selIdx = sel === null ? datos.length - 1 : Math.min(sel, datos.length - 1);
  const intentoSel = datos[selIdx];

  const pctDe = (d, k) => (d.porArea[k] ? Math.round((d.porArea[k].ok / d.porArea[k].total) * 100) : null);
  const areasPresentes = Object.keys(AREAS).filter((k) => datos.some((d) => pctDe(d, k) !== null));

  const toggleArea = (k) => {
    const s = new Set(ocultas);
    s.has(k) ? s.delete(k) : s.add(k);
    setOcultas(s);
  };

  // ── Geometría del SVG ──
  const W = 360, H = 210, ML = 30, MR = 30, MT = 12, MB = 24;
  const IW = W - ML - MR, IH = H - MT - MB;
  const x = (i) => ML + (datos.length <= 1 ? IW / 2 : (i / (datos.length - 1)) * IW);
  const y = (pct) => MT + IH - (pct / 100) * IH;

  const series = areasPresentes
    .filter((k) => !ocultas.has(k))
    .map((k) => {
      const puntos = datos.map((d, i) => ({ i, v: pctDe(d, k) })).filter((p) => p.v !== null);
      let path = "", prev = null;
      for (const p of puntos) {
        path += `${prev !== null && p.i === prev + 1 ? "L" : "M"}${x(p.i)},${y(p.v)} `;
        prev = p.i;
      }
      return { k, puntos, path };
    });

  return (
    <div className="min-h-screen p-4" style={{ background: C.papel, color: C.tinta }}>
      <div className="max-w-md mx-auto pb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: C.guinda }}>Progreso por área</p>
          <button onClick={onSalir} className="text-xs font-semibold px-3 py-1.5 rounded border" style={{ borderColor: C.guinda, color: C.guinda }}>
            ← Menú
          </button>
        </div>

        {datos.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: C.linea }}>
            <p className="text-sm leading-relaxed" style={{ color: C.grafito }}>
              Aún no hay intentos registrados.<br />Termina un simulacro y aquí verás tu evolución por área.
            </p>
          </div>
        ) : (
          <>
            {/* Leyenda (toca para ocultar/mostrar una serie) */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {areasPresentes.map((k) => (
                <button key={k} onClick={() => toggleArea(k)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                  style={{
                    borderColor: ocultas.has(k) ? C.linea : AREA_COLORS[k],
                    color: ocultas.has(k) ? C.grafito : C.tinta,
                    opacity: ocultas.has(k) ? 0.5 : 1,
                    background: "#FFF",
                  }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: AREA_COLORS[k] }} />
                  {AREAS[k].corto}
                </button>
              ))}
            </div>

            {/* Gráfica */}
            <div className="rounded-lg border p-3 mb-3" style={{ background: "#FFF", borderColor: C.linea }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Evolución del porcentaje de aciertos por área en cada intento">
                {/* Cuadrícula y eje Y */}
                {[0, 25, 50, 75, 100].map((v) => (
                  <g key={v}>
                    <line x1={ML} x2={W - MR} y1={y(v)} y2={y(v)} stroke="#EEECE6" strokeWidth="1" />
                    <text x={ML - 5} y={y(v) + 3} textAnchor="end" fontSize="9" fill={C.grafito}>{v}</text>
                  </g>
                ))}
                {/* Umbrales de referencia */}
                <line x1={ML} x2={W - MR} y1={y(53)} y2={y(53)} stroke={C.ambar} strokeWidth="1" strokeDasharray="4 3" />
                <text x={W - MR + 3} y={y(53) + 3} fontSize="8" fill={C.ambar}>53</text>
                <line x1={ML} x2={W - MR} y1={y(75)} y2={y(75)} stroke={C.ok} strokeWidth="1" strokeDasharray="4 3" />
                <text x={W - MR + 3} y={y(75) + 3} fontSize="8" fill={C.ok}>75</text>

                {/* Columna seleccionada */}
                {intentoSel && <line x1={x(selIdx)} x2={x(selIdx)} y1={MT} y2={MT + IH} stroke={C.linea} strokeWidth="1.5" />}

                {/* Series */}
                {series.map(({ k, puntos, path }) => (
                  <g key={k}>
                    <path d={path} fill="none" stroke={AREA_COLORS[k]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    {puntos.map((p) => (
                      <circle key={p.i} cx={x(p.i)} cy={y(p.v)} r={p.i === selIdx ? 4.5 : 3.5}
                        fill={AREA_COLORS[k]} stroke="#FFF" strokeWidth="2" />
                    ))}
                  </g>
                ))}

                {/* Eje X */}
                {datos.map((d, i) => (
                  <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9"
                    fill={i === selIdx ? C.tinta : C.grafito} fontWeight={i === selIdx ? "bold" : "normal"}>
                    #{i + 1}
                  </text>
                ))}

                {/* Zonas de toque por intento */}
                {datos.map((_, i) => (
                  <rect key={i} x={x(i) - (IW / Math.max(datos.length - 1, 1)) / 2} y={0}
                    width={IW / Math.max(datos.length - 1, 1)} height={H}
                    fill="transparent" style={{ cursor: "pointer" }} onClick={() => setSel(i)} />
                ))}
              </svg>

              {/* Detalle del intento seleccionado */}
              {intentoSel && (
                <div className="border-t pt-2 mt-1" style={{ borderColor: C.linea }}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold">#{selIdx + 1} · {intentoSel.titulo}</span>
                    <span style={{ color: C.grafito }}>{fechaCorta(intentoSel.fecha)} · global {intentoSel.pct}%</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {areasPresentes.map((k) => {
                      const v = pctDe(intentoSel, k);
                      return v === null ? null : (
                        <span key={k} className="flex items-center gap-1 text-xs">
                          <span className="w-2 h-2 rounded-full" style={{ background: AREA_COLORS[k] }} />
                          <span style={{ color: C.grafito }}>{AREAS[k].corto}</span>
                          <b className="font-mono">{v}%</b>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs mb-5 leading-relaxed" style={{ color: C.grafito }}>
              Líneas punteadas: ~53% satisfactorio y ~75% sobresaliente (referencia de estudio). El área que siga
              abajo de 60% se repasa antes de avanzar. Las rondas de «Mis errores» no entran a la gráfica.
            </p>
          </>
        )}

        {/* Lista de intentos */}
        {historial.length > 0 && (
          <>
            <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.grafito }}>
              Todos los intentos ({historial.length})
            </p>
            <div className="space-y-1.5 mb-5">
              {historial.slice().reverse().map((h, i) => {
                const nivel = nivelEstimado(h.pct);
                return (
                  <div key={historial.length - i} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    style={{ background: "#FFF", borderColor: C.linea }}>
                    <div>
                      <span className="font-medium">{h.titulo}</span>
                      <span className="text-xs ml-2" style={{ color: C.grafito }}>{fechaCorta(h.fecha)} · {h.ok}/{h.total}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: nivel.bg, color: nivel.c }}>
                      {h.pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (!confirmaBorrar) { setConfirmaBorrar(true); return; }
                borrarHistorial();
                setHistorial([]);
                setConfirmaBorrar(false);
              }}
              className="w-full py-2 rounded-lg border font-semibold text-xs"
              style={{ borderColor: confirmaBorrar ? C.mal : C.linea, color: confirmaBorrar ? "#FFF" : C.grafito, background: confirmaBorrar ? C.mal : "transparent" }}>
              {confirmaBorrar ? "Toca de nuevo para borrar todo el historial" : "Borrar historial"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
