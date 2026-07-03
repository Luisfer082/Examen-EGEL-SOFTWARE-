// ─── Tema y constantes compartidas ───

export const AREAS = {
  a1: { nombre: "Área 1 · Análisis de sistemas", corto: "Análisis" },
  a2: { nombre: "Área 2 · Diseño de sistemas", corto: "Diseño" },
  a3: { nombre: "Área 3 · Desarrollo de sistemas", corto: "Desarrollo" },
  a4: { nombre: "Área 4 · Gestión e implantación", corto: "Gestión" },
  tr: { nombre: "Sección Transversal · Lenguaje y comunicación", corto: "Transversal" },
};

export const LETRAS = ["A", "B", "C", "D"];

// Colores por área para la gráfica de progreso (validados: CVD y contraste ≥3:1)
export const AREA_COLORS = {
  a1: "#A82E56",
  a2: "#B07818",
  a3: "#B3392E",
  a4: "#1F8A5B",
  tr: "#3B76C2",
};

export const C = {
  papel: "#F6F5F1",
  tinta: "#1C2733",
  guinda: "#7C2140",
  guindaSuave: "#F3E6EB",
  grafito: "#6B7280",
  linea: "#DDD9D0",
  ok: "#2E7D57",
  okSuave: "#E4F1EA",
  mal: "#B3392E",
  malSuave: "#F7E7E5",
  ambar: "#B07818",
};

export function fmt(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function nivelEstimado(pct) {
  if (pct >= 75) return { t: "Sobresaliente (estimado)", c: C.ok, bg: C.okSuave };
  if (pct >= 53) return { t: "Satisfactorio (estimado)", c: "#7A6210", bg: "#F5EEDB" };
  return { t: "Aún no satisfactorio (estimado)", c: C.mal, bg: C.malSuave };
}
