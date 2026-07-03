import { AREAS } from "./theme.js";

// ─── Persistencia en localStorage: historial de intentos y banco de errores ───
// Banco de errores: { "examenId:indice": { s: aciertosSeguidos } }
// Un reactivo entra al fallarlo (o dejarlo sin responder) y sale con 2 aciertos seguidos.

const K_HIST = "egel-historial";
const K_ERR = "egel-errores";

function leer(clave, porDefecto) {
  try { return JSON.parse(localStorage.getItem(clave)) ?? porDefecto; }
  catch { return porDefecto; }
}

export function obtenerHistorial() { return leer(K_HIST, []); }
export function borrarHistorial() { localStorage.removeItem(K_HIST); }
export function contarErrores() { return Object.keys(leer(K_ERR, {})).length; }

export function registrarIntento(examen, resp) {
  const qs = examen.questions;

  // ── Banco de errores ──
  const err = leer(K_ERR, {});
  qs.forEach((q, i) => {
    const qid = q._qid || `${examen.id}:${i}`;
    if (resp[i] === q.r) {
      if (err[qid]) {
        err[qid].s += 1;
        if (err[qid].s >= 2) delete err[qid];
      }
    } else {
      err[qid] = { s: 0 }; // fallado o sin responder: entra (o reinicia su racha)
    }
  });
  localStorage.setItem(K_ERR, JSON.stringify(err));

  // ── Historial ──
  const porArea = {};
  Object.keys(AREAS).forEach((k) => {
    const idx = qs.map((q, i) => (q.a === k ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) return;
    porArea[k] = { ok: idx.filter((i) => resp[i] === qs[i].r).length, total: idx.length };
  });
  const ok = Object.values(porArea).reduce((s, a) => s + a.ok, 0);
  const hist = obtenerHistorial();
  hist.push({
    fecha: new Date().toISOString(),
    examenId: examen.id,
    titulo: examen.titulo,
    ok,
    total: qs.length,
    pct: Math.round((ok / qs.length) * 100),
    porArea,
    errores: !!examen.esErrores,
  });
  localStorage.setItem(K_HIST, JSON.stringify(hist));
}

// Arma un examen dinámico con los reactivos pendientes del banco de errores.
export function construirExamenErrores(examenes) {
  const err = leer(K_ERR, {});
  const questions = [];
  for (const ex of examenes) {
    ex.questions.forEach((q, i) => {
      const qid = `${ex.id}:${i}`;
      if (err[qid]) questions.push({ ...q, _qid: qid });
    });
  }
  if (!questions.length) return null;
  return {
    id: "errores",
    esErrores: true,
    titulo: "Mis errores",
    sub: "Reactivos que has fallado en cualquier simulacro. Cada uno sale del banco al acertarlo 2 veces seguidas.",
    minutos: Math.max(5, Math.round(questions.length * 2.3)),
    questions,
  };
}
