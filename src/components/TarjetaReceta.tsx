"use client";

import Link from "next/link";
import { useApp } from "./AuthProvider";
import { faltantes } from "@/lib/recetas";
import type { Receta } from "@/lib/tipos";

export function BotonFavorita({ id, claro = false }: { id: string; claro?: boolean }) {
  const { datos, actualizar } = useApp();
  const es = datos.favoritas.includes(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        actualizar({ favoritas: es ? datos.favoritas.filter((f) => f !== id) : [...datos.favoritas, id] });
      }}
      aria-pressed={es}
      aria-label={es ? "Quitar de favoritas" : "Guardar en favoritas"}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        claro ? "bg-white/90 text-carbon hover:bg-white" : "bg-lino hover:bg-niebla"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={es ? "#A87C55" : "none"} stroke={es ? "#A87C55" : "currentColor"} strokeWidth={2} aria-hidden>
        <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Texto corto sobre si se puede hacer con la despensa. */
export function EstadoDespensa({ r, compacto = false }: { r: Receta; compacto?: boolean }) {
  const { datos } = useApp();
  if (!datos.despensa.length) return null;
  const f = faltantes(r, new Set<string>(datos.despensa)).length;
  if (f === 0) return <span className="font-semibold text-salvia">{compacto ? "La puedes hacer" : "Tienes todo para hacerla"}</span>;
  if (f <= 2) return <span className="text-madera">Te {f === 1 ? "falta 1 ingrediente" : `faltan ${f}`}</span>;
  return null;
}

export default function TarjetaReceta({ r, ancho = false }: { r: Receta; ancho?: boolean }) {
  return (
    <Link href={`/receta/?id=${r.id}`} className={`group block ${ancho ? "w-44 shrink-0 snap-start" : ""}`}>
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-niebla">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.foto} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute right-2 top-2">
          <BotonFavorita id={r.id} claro />
        </div>
        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold">
          {r.tiempo.split("+")[0].trim()}
          {r.kcal ? ` · ≈${r.kcal} kcal` : ""}
        </span>
      </div>
      <p className="mt-2 font-semibold leading-tight">{r.titulo}</p>
      <p className="mt-0.5 text-sm">
        <EstadoDespensa r={r} compacto />
      </p>
    </Link>
  );
}
