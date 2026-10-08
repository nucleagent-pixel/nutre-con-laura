"use client";

import Link from "next/link";
import Protegido from "@/components/Protegido";
import { BotonFavorita, EstadoDespensa } from "@/components/TarjetaReceta";
import { RECETAS } from "@/lib/recetas";

export default function Batidos() {
  return (
    <Protegido>
      <Contenido />
    </Protegido>
  );
}

const CONSEJOS = [
  "Licúa primero las hojas con el líquido y después agrega lo demás: queda más suave.",
  "Congela fruta en porciones para tener batidos fríos sin hielo.",
  "Tómalo recién hecho: así conserva mejor su sabor y color.",
];

function Contenido() {
  const verdes = RECETAS.filter((r) => r.verde);
  const otros = RECETAS.filter((r) => !r.verde && r.tipos.includes("batido"));

  return (
    <div className="space-y-7">
      <header className="-mx-5 bg-[#DDE6CF] px-5 pb-7 pt-6 sm:mx-0 sm:rounded-[2rem]">
        <h1 className="titular text-salvia">Batidos verdes</h1>
        <p className="mt-2 max-w-sm text-carbon/80">
          Ideas fáciles de 5 minutos para complementar tu alimentación. Una porción cada una.
        </p>
        <ul className="mt-5 space-y-2 text-sm">
          {CONSEJOS.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-salvia" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </header>

      <ul className="space-y-3">
        {verdes.map((r) => (
          <li key={r.id}>
            <Link href={`/receta/?id=${r.id}`} className="flex items-center gap-4 rounded-[1.5rem] bg-white p-3 ring-1 ring-niebla transition-colors hover:ring-salvia/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.foto} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block font-titulo text-xl font-semibold leading-tight">{r.titulo}</span>
                <span className="mt-0.5 block text-sm text-carbon/60">
                  {r.tiempo} · {r.ingredientes.length} ingredientes
                </span>
                <span className="block text-sm">
                  <EstadoDespensa r={r} compacto />
                </span>
              </span>
              <BotonFavorita id={r.id} />
            </Link>
          </li>
        ))}
      </ul>

      {otros.length > 0 && (
        <section>
          <h2 className="mb-3 font-titulo text-3xl font-semibold">Otros batidos y smoothies</h2>
          <ul className="space-y-3">
            {otros.map((r) => (
              <li key={r.id}>
                <Link href={`/receta/?id=${r.id}`} className="flex items-center gap-4 rounded-[1.5rem] bg-white p-3 ring-1 ring-niebla transition-colors hover:ring-salvia/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.foto} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-titulo text-xl font-semibold leading-tight">{r.titulo}</span>
                    <span className="mt-0.5 block text-sm text-carbon/60">
                      {r.tiempo}
                      {r.kcal ? ` · ≈ ${r.kcal} kcal` : ""}
                    </span>
                  </span>
                  <BotonFavorita id={r.id} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
