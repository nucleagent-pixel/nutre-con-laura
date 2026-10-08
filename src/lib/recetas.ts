import datos from "@/data/recetas.json";
import catalogo from "@/data/ingredientes.json";
import type { Etiqueta, Ingrediente, Receta, TipoComida } from "./tipos";

export const RECETAS = datos as Receta[];
export const INGREDIENTES = catalogo as Ingrediente[];
export const NOMBRE_INGREDIENTE = Object.fromEntries(INGREDIENTES.map((i) => [i.id, i.nombre]));

export const TIPOS: { id: TipoComida; texto: string; plural: string }[] = [
  { id: "desayuno", texto: "Desayuno", plural: "Desayunos" },
  { id: "almuerzo", texto: "Almuerzo", plural: "Almuerzos" },
  { id: "cena", texto: "Cena", plural: "Cenas" },
  { id: "snack", texto: "Snack", plural: "Snacks" },
  { id: "postre", texto: "Postre", plural: "Postres" },
  { id: "batido", texto: "Batido", plural: "Batidos" },
];

export const ETIQUETAS: { id: Etiqueta; texto: string }[] = [
  { id: "vegetariana", texto: "Vegetariana" },
  { id: "sin-lacteos", texto: "Sin lácteos" },
  { id: "rapida", texto: "15 min o menos" },
];

export function receta(id: string) {
  return RECETAS.find((r) => r.id === id);
}

/** Ingredientes del catálogo que le faltan a la clienta para hacer la receta. */
export function faltantes(r: Receta, despensa: Set<string>) {
  return r.ing.filter((i) => !despensa.has(i));
}

/** Recetas ordenadas por cuántos ingredientes faltan (0 primero). */
export function porDespensa(despensa: Set<string>, lista = RECETAS) {
  return lista
    .map((r) => ({ r, faltan: faltantes(r, despensa) }))
    .sort((a, b) => a.faltan.length - b.faltan.length || b.r.ing.length - a.r.ing.length);
}

/** Momento del día → tipo de comida sugerido. */
export function comidaDeAhora(): TipoComida {
  const h = new Date().getHours();
  if (h < 11) return "desayuno";
  if (h < 16) return "almuerzo";
  if (h < 18) return "snack";
  return "cena";
}

/** Elección estable por día, para que las sugerencias no cambien en cada recarga. */
export function elegirDelDia<T>(lista: T[], n: number, semilla = 0) {
  if (!lista.length) return [];
  const d = new Date();
  let s = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate() + semilla;
  const copia = [...lista];
  const res: T[] = [];
  while (res.length < n && copia.length) {
    s = (s * 9301 + 49297) % 233280;
    res.push(copia.splice(s % copia.length, 1)[0]);
  }
  return res;
}
