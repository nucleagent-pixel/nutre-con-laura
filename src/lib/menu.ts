import { RECETAS, faltantes } from "./recetas";
import type { Etiqueta, Menu, Receta, TipoComida } from "./tipos";

export const DIAS = [
  { id: "lun", texto: "Lunes" },
  { id: "mar", texto: "Martes" },
  { id: "mie", texto: "Miércoles" },
  { id: "jue", texto: "Jueves" },
  { id: "vie", texto: "Viernes" },
  { id: "sab", texto: "Sábado" },
  { id: "dom", texto: "Domingo" },
];

export const MOMENTOS: { id: TipoComida; texto: string }[] = [
  { id: "desayuno", texto: "Desayuno" },
  { id: "almuerzo", texto: "Almuerzo" },
  { id: "snack", texto: "Snack" },
  { id: "cena", texto: "Cena" },
];

export const clave = (dia: string, momento: string) => `${dia}-${momento}`;

/** Para el snack sirven snacks, postres y batidos. */
function candidatas(momento: TipoComida, filtros: Etiqueta[]) {
  const tipos: TipoComida[] = momento === "snack" ? ["snack", "postre", "batido"] : [momento];
  return RECETAS.filter((r) => r.tipos.some((t) => tipos.includes(t)) && filtros.every((f) => r.etiquetas.includes(f)));
}

/**
 * Arma una semana priorizando recetas que se pueden hacer con la despensa
 * y sin repetir recetas (mientras haya suficientes).
 */
export function armarSemana(despensa: Set<string>, filtros: Etiqueta[], actual: Menu = {}, soloVacios = false): Menu {
  const menu: Menu = soloVacios ? { ...actual } : {};
  const usadas = new Set(Object.values(menu));
  for (const m of MOMENTOS) {
    // Ordenadas por ingredientes faltantes, con un poco de variedad entre las que empatan.
    const lista = candidatas(m.id, filtros)
      .map((r) => ({ r, f: faltantes(r, despensa).length, azar: Math.random() }))
      .sort((a, b) => a.f - b.f || a.azar - b.azar);
    let i = 0;
    for (const d of DIAS) {
      const k = clave(d.id, m.id);
      if (menu[k]) continue;
      let elegido: Receta | undefined;
      while (i < lista.length && usadas.has(lista[i].r.id)) i++;
      elegido = lista[i]?.r ?? lista[Math.floor(Math.random() * lista.length)]?.r;
      if (elegido) {
        menu[k] = elegido.id;
        usadas.add(elegido.id);
        i++;
      }
    }
  }
  return menu;
}

/** Lista de compras: ingredientes del menú que no están en la despensa, con las recetas que los usan. */
export function listaDeCompras(menu: Menu, despensa: Set<string>) {
  const mapa = new Map<string, Set<string>>();
  for (const id of Object.values(menu)) {
    const r = RECETAS.find((x) => x.id === id);
    if (!r) continue;
    for (const i of faltantes(r, despensa)) {
      if (!mapa.has(i)) mapa.set(i, new Set());
      mapa.get(i)!.add(r.titulo);
    }
  }
  return [...mapa.entries()].map(([id, recetas]) => ({ id, recetas: [...recetas] }));
}
