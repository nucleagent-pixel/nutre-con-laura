export type TipoComida = "desayuno" | "almuerzo" | "cena" | "snack" | "postre" | "batido";
export type Etiqueta = "vegetariana" | "sin-lacteos" | "rapida";

export interface Receta {
  id: string;
  titulo: string;
  tipos: TipoComida[];
  tiempo: string;
  minutos: number;
  porciones: number;
  kcal: number | null;
  ingredientes: string[];
  pasos: string[];
  ing: string[]; // ingredientes esenciales (ids del catálogo)
  extras: string[]; // opcionales o menores (hierbas, limón, semillas…): no cuentan como "te falta"
  etiquetas: Etiqueta[];
  foto: string;
  verde?: boolean;
}

export interface Ingrediente {
  id: string;
  nombre: string;
  grupo: string;
}

// Menú semanal: clave "lun-desayuno" → id de receta
export type Menu = Record<string, string>;

export interface DatosNutre {
  favoritas: string[];
  despensa: string[];
  menu: Menu;
  habitos: Record<string, string[]>; // fecha AAAA-MM-DD → hábitos cumplidos
  compromiso: string;
}
