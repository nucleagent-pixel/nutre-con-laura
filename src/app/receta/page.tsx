"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Protegido from "@/components/Protegido";
import Cargando from "@/components/Cargando";
import { BotonFavorita, EstadoDespensa } from "@/components/TarjetaReceta";
import { useApp } from "@/components/AuthProvider";
import { ETIQUETAS, NOMBRE_INGREDIENTE, TIPOS, receta } from "@/lib/recetas";
import { DIAS, MOMENTOS, clave } from "@/lib/menu";
import type { Receta, TipoComida } from "@/lib/tipos";

export default function RecetaPagina() {
  return (
    <Protegido>
      <Suspense fallback={<Cargando />}>
        <Contenido />
      </Suspense>
    </Protegido>
  );
}

function Contenido() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => setId(new URLSearchParams(window.location.search).get("id") ?? ""), []);
  if (id === null) return <Cargando />;
  const r = receta(id);
  if (!r) {
    return (
      <div className="tarjeta text-center">
        <p>No encontramos esta receta.</p>
        <Link href="/recetas/" className="boton mt-4">
          Ver recetas
        </Link>
      </div>
    );
  }
  return <Detalle r={r} />;
}

function Detalle({ r }: { r: Receta }) {
  const { datos } = useApp();
  const [hechos, setHechos] = useState<Set<number>>(new Set());
  const [agregar, setAgregar] = useState(false);
  const despensa = new Set<string>(datos.despensa);
  const tipo = TIPOS.find((t) => t.id === r.tipos[0])!;

  return (
    <article className="space-y-6">
      <Link href={r.verde ? "/batidos/" : `/recetas/?tipo=${r.tipos[0]}`} className="text-sm text-carbon/70 hover:text-carbon">
        ← {r.verde ? "Batidos verdes" : tipo.plural}
      </Link>

      <div className="relative -mx-5 sm:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.foto} alt={r.titulo} className="aspect-[4/3] w-full object-cover sm:rounded-[2rem]" />
        <div className="absolute right-4 top-4">
          <BotonFavorita id={r.id} claro />
        </div>
      </div>

      <header>
        <p className="text-sm font-semibold text-salvia">{r.tipos.map((t) => TIPOS.find((x) => x.id === t)!.texto).join(" · ")}</p>
        <h1 className="titular mt-1">{r.titulo}</h1>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Dato titulo="Tiempo" valor={r.tiempo} />
          <Dato titulo="Porciones" valor={String(r.porciones)} />
          <Dato titulo="Calorías" valor={r.kcal ? `≈ ${r.kcal}` : "—"} detalle={r.kcal ? "kcal por porción" : undefined} />
        </dl>
        {r.etiquetas.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {r.etiquetas.map((e) => (
              <span key={e} className="chip">
                {ETIQUETAS.find((x) => x.id === e)!.texto}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="flex gap-2">
        <button className="boton flex-1" onClick={() => setAgregar(!agregar)} aria-expanded={agregar}>
          Agregar a mi menú
        </button>
      </div>
      {agregar && <AgregarAlMenu r={r} onListo={() => setAgregar(false)} />}

      <section aria-labelledby="t-ing">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="t-ing" className="font-titulo text-3xl font-semibold">
            Ingredientes
          </h2>
          <p className="text-sm">
            <EstadoDespensa r={r} />
          </p>
        </div>
        <ul className="space-y-2">
          {r.ingredientes.map((l, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-niebla">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-salvia" aria-hidden />
              <span>{l}</span>
            </li>
          ))}
        </ul>
        {datos.despensa.length > 0 && r.ing.some((i) => !despensa.has(i)) && (
          <p className="mt-3 text-sm text-carbon/70">
            No tienes en tu despensa:{" "}
            <strong>
              {r.ing
                .filter((i) => !despensa.has(i))
                .map((i) => NOMBRE_INGREDIENTE[i]?.toLowerCase())
                .join(", ")}
            </strong>
            .
          </p>
        )}
      </section>

      <section aria-labelledby="t-pasos">
        <h2 id="t-pasos" className="mb-3 font-titulo text-3xl font-semibold">
          Preparación
        </h2>
        <p className="-mt-2 mb-3 text-sm text-carbon/70">Toca cada paso para marcarlo mientras cocinas.</p>
        <ol className="space-y-2">
          {r.pasos.map((p, i) => {
            const hecho = hechos.has(i);
            return (
              <li key={i}>
                <button
                  onClick={() =>
                    setHechos((h) => {
                      const n = new Set(h);
                      if (n.has(i)) n.delete(i);
                      else n.add(i);
                      return n;
                    })
                  }
                  aria-pressed={hecho}
                  className={`flex w-full gap-4 rounded-2xl px-4 py-3 text-left ring-1 transition-colors ${
                    hecho ? "bg-salvia-fondo text-carbon/50 ring-transparent" : "bg-white ring-niebla"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-titulo text-lg font-bold ${
                      hecho ? "bg-salvia text-white" : "bg-lino"
                    }`}
                  >
                    {hecho ? "✓" : i + 1}
                  </span>
                  <span className={`pt-1 ${hecho ? "line-through" : ""}`}>{p}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {r.kcal && (
        <p className="text-xs text-carbon/60">
          Las calorías son aproximadas y sirven solo como referencia. No reemplazan la orientación de un profesional en nutrición.
        </p>
      )}
    </article>
  );
}

function Dato({ titulo, valor, detalle }: { titulo: string; valor: string; detalle?: string }) {
  return (
    <div className="rounded-2xl bg-white px-2 py-3 ring-1 ring-niebla">
      <dt className="text-xs text-carbon/60">{titulo}</dt>
      <dd className="mt-0.5 font-titulo text-xl font-semibold leading-tight">{valor}</dd>
      {detalle && <dd className="text-[11px] text-carbon/60">{detalle}</dd>}
    </div>
  );
}

function AgregarAlMenu({ r, onListo }: { r: Receta; onListo: () => void }) {
  const { datos, actualizar } = useApp();
  const momentoSugerido: TipoComida = r.tipos.includes("desayuno")
    ? "desayuno"
    : r.tipos.includes("almuerzo")
      ? "almuerzo"
      : r.tipos.includes("cena")
        ? "cena"
        : "snack";
  const [momento, setMomento] = useState<TipoComida>(momentoSugerido);
  const [listo, setListo] = useState("");

  function agregarEn(dia: string) {
    actualizar({ menu: { ...datos.menu, [clave(dia, momento)]: r.id } });
    setListo(DIAS.find((d) => d.id === dia)!.texto);
    setTimeout(onListo, 1200);
  }

  return (
    <div className="tarjeta space-y-4">
      <div>
        <p className="etiqueta">¿Para qué comida?</p>
        <div className="flex flex-wrap gap-2">
          {MOMENTOS.map((m) => (
            <button key={m.id} onClick={() => setMomento(m.id)} aria-pressed={momento === m.id} className={`chip ${momento === m.id ? "chip-activo" : ""}`}>
              {m.texto}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="etiqueta">¿Qué día?</p>
        <div className="grid grid-cols-4 gap-2">
          {DIAS.map((d) => {
            const ocupado = datos.menu[clave(d.id, momento)];
            return (
              <button key={d.id} onClick={() => agregarEn(d.id)} className="rounded-2xl bg-lino px-2 py-2.5 text-sm font-semibold transition-colors hover:bg-salvia hover:text-white">
                {d.texto.slice(0, 3)}
                {ocupado && <span className="block text-[10px] font-normal opacity-70">reemplaza</span>}
              </button>
            );
          })}
        </div>
      </div>
      {listo && (
        <p className="text-sm font-semibold text-salvia" role="status">
          Agregada al {listo.toLowerCase()}.
        </p>
      )}
    </div>
  );
}
