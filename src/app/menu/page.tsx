"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Protegido from "@/components/Protegido";
import { useApp } from "@/components/AuthProvider";
import { ETIQUETAS, NOMBRE_INGREDIENTE, RECETAS, receta } from "@/lib/recetas";
import { DIAS, MOMENTOS, armarSemana, clave, listaDeCompras } from "@/lib/menu";
import type { Etiqueta, TipoComida } from "@/lib/tipos";

export default function MiMenu() {
  return (
    <Protegido>
      <Contenido />
    </Protegido>
  );
}

function Contenido() {
  const { datos, actualizar } = useApp();
  const [vista, setVista] = useState<"semana" | "compras">("semana");
  const [filtros, setFiltros] = useState<Etiqueta[]>([]);
  const [elegir, setElegir] = useState<{ dia: string; momento: TipoComida } | null>(null);
  const [comprados, setComprados] = useState<Set<string>>(new Set());
  const hoy = DIAS[(new Date().getDay() + 6) % 7].id;
  const [diaAbierto, setDiaAbierto] = useState(hoy);

  const despensa = useMemo(() => new Set<string>(datos.despensa), [datos.despensa]);
  const lleno = Object.keys(datos.menu).length;
  const compras = useMemo(() => listaDeCompras(datos.menu, despensa), [datos.menu, despensa]);

  function armar(soloVacios: boolean) {
    if (!soloVacios && lleno && !confirm("Esto reemplaza tu menú actual. ¿Continuar?")) return;
    actualizar({ menu: armarSemana(despensa, filtros, datos.menu, soloVacios) });
  }

  function quitar(k: string) {
    const m = { ...datos.menu };
    delete m[k];
    actualizar({ menu: m });
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="titular">Mi menú</h1>
        <p className="mt-2 text-carbon/70">Tu semana de comidas, armada con lo que ya tienes en casa.</p>
      </header>

      <div className="grid grid-cols-2 rounded-full bg-salvia-fondo p-1 text-sm font-semibold" role="tablist">
        {(
          [
            ["semana", "Semana"],
            ["compras", `Lista de compras${compras.length ? ` (${compras.length})` : ""}`],
          ] as const
        ).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={vista === k} onClick={() => setVista(k)} className={`rounded-full py-2.5 transition-colors ${vista === k ? "bg-white shadow-sm" : "text-carbon/60"}`}>
            {t}
          </button>
        ))}
      </div>

      {vista === "semana" ? (
        <>
          <section className="tarjeta space-y-3">
            <p className="font-titulo text-2xl font-semibold leading-tight">
              {lleno ? "¿Quieres cambiarlo?" : "Arma tu semana en un toque"}
            </p>
            <p className="text-sm text-carbon/70">
              {datos.despensa.length
                ? "Elegimos primero las recetas que puedes hacer con tu despensa, sin repetir."
                : "Tip: marca primero tu despensa para que el menú use lo que ya tienes."}
            </p>
            <div className="flex flex-wrap gap-2">
              {ETIQUETAS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setFiltros((f) => (f.includes(e.id) ? f.filter((x) => x !== e.id) : [...f, e.id]))}
                  aria-pressed={filtros.includes(e.id)}
                  className={`chip ${filtros.includes(e.id) ? "chip-activo" : ""}`}
                >
                  {e.texto}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="boton" onClick={() => armar(false)}>
                {lleno ? "Armar de nuevo" : "Armar mi semana"}
              </button>
              {lleno > 0 && lleno < DIAS.length * MOMENTOS.length && (
                <button className="boton-sec" onClick={() => armar(true)}>
                  Completar lo vacío
                </button>
              )}
              {lleno > 0 && (
                <button className="px-3 text-sm text-carbon/60 underline-offset-4 hover:underline" onClick={() => confirm("¿Borrar todo el menú?") && actualizar({ menu: {} })}>
                  Borrar menú
                </button>
              )}
            </div>
          </section>

          <ul className="space-y-2">
            {DIAS.map((d) => {
              const abierto = diaAbierto === d.id;
              const cuantos = MOMENTOS.filter((m) => datos.menu[clave(d.id, m.id)]).length;
              return (
                <li key={d.id} className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-niebla">
                  <button onClick={() => setDiaAbierto(abierto ? "" : d.id)} aria-expanded={abierto} className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <span className="font-titulo text-2xl font-semibold">
                      {d.texto}
                      {d.id === hoy && <span className="ml-2 align-middle text-sm font-semibold text-salvia">hoy</span>}
                    </span>
                    <span className="text-sm text-carbon/60">
                      {cuantos}/{MOMENTOS.length} {abierto ? "▴" : "▾"}
                    </span>
                  </button>
                  {abierto && (
                    <ul className="divide-y divide-niebla border-t border-niebla">
                      {MOMENTOS.map((m) => {
                        const k = clave(d.id, m.id);
                        const r = receta(datos.menu[k] ?? "");
                        return (
                          <li key={m.id} className="flex items-center gap-3 px-3 py-3">
                            {r ? (
                              <>
                                <Link href={`/receta/?id=${r.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={r.foto} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                                  <span className="min-w-0">
                                    <span className="block text-sm text-carbon/60">{m.texto}</span>
                                    <span className="block truncate font-semibold">{r.titulo}</span>
                                  </span>
                                </Link>
                                <button className="rounded-full px-2 py-1 text-sm text-carbon/60 hover:bg-lino" onClick={() => setElegir({ dia: d.id, momento: m.id })}>
                                  Cambiar
                                </button>
                                <button className="rounded-full px-2 py-1 text-sm text-carbon/60 hover:bg-lino" onClick={() => quitar(k)} aria-label={`Quitar ${m.texto.toLowerCase()} del ${d.texto.toLowerCase()}`}>
                                  ✕
                                </button>
                              </>
                            ) : (
                              <button onClick={() => setElegir({ dia: d.id, momento: m.id })} className="flex w-full items-center gap-3 text-left">
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-niebla text-2xl text-carbon/30">+</span>
                                <span>
                                  <span className="block text-sm text-carbon/60">{m.texto}</span>
                                  <span className="block font-semibold text-salvia">Elegir receta</span>
                                </span>
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <ListaCompras compras={compras} comprados={comprados} setComprados={setComprados} />
      )}

      {elegir && <Selector dia={elegir.dia} momento={elegir.momento} onCerrar={() => setElegir(null)} />}
    </div>
  );
}

function ListaCompras({
  compras,
  comprados,
  setComprados,
}: {
  compras: { id: string; recetas: string[] }[];
  comprados: Set<string>;
  setComprados: (s: Set<string>) => void;
}) {
  const { datos, actualizar } = useApp();
  if (!Object.keys(datos.menu).length) {
    return <p className="tarjeta text-carbon/70">Arma tu menú de la semana y aquí aparecerá lo que te falta comprar.</p>;
  }
  if (!compras.length) {
    return (
      <div className="tarjeta text-center">
        <p className="font-titulo text-2xl font-semibold">Tienes todo</p>
        <p className="mt-1 text-carbon/70">Con tu despensa alcanza para todo el menú de la semana.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-carbon/70">
        Lo que necesitas para tu menú y no tienes en la despensa. Las cantidades están en cada receta.
      </p>
      <ul className="divide-y divide-niebla overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-niebla">
        {compras.map((c) => {
          const ok = comprados.has(c.id);
          return (
            <li key={c.id}>
              <label className="flex cursor-pointer items-start gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  checked={ok}
                  onChange={() => {
                    const n = new Set(comprados);
                    if (ok) n.delete(c.id);
                    else n.add(c.id);
                    setComprados(n);
                  }}
                  className="mt-1 h-5 w-5 accent-[#55684F]"
                />
                <span className={ok ? "text-carbon/50 line-through" : ""}>
                  <span className="block font-semibold">{NOMBRE_INGREDIENTE[c.id]}</span>
                  <span className="block text-sm text-carbon/60">Para: {c.recetas.slice(0, 3).join(", ")}{c.recetas.length > 3 ? ` y ${c.recetas.length - 3} más` : ""}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {comprados.size > 0 && (
        <button
          className="boton w-full"
          onClick={() => {
            actualizar({ despensa: [...new Set([...datos.despensa, ...comprados])] });
            setComprados(new Set());
          }}
        >
          Pasar {comprados.size} a mi despensa
        </button>
      )}
    </div>
  );
}

function Selector({ dia, momento, onCerrar }: { dia: string; momento: TipoComida; onCerrar: () => void }) {
  const { datos, actualizar } = useApp();
  const despensa = new Set<string>(datos.despensa);
  const tipos: TipoComida[] = momento === "snack" ? ["snack", "postre", "batido"] : [momento];
  const opciones = RECETAS.filter((r) => r.tipos.some((t) => tipos.includes(t)))
    .map((r) => ({ r, f: r.ing.filter((i) => !despensa.has(i)).length, fav: datos.favoritas.includes(r.id) }))
    .sort((a, b) => Number(b.fav) - Number(a.fav) || a.f - b.f);
  const diaTxt = DIAS.find((d) => d.id === dia)!.texto;
  const momTxt = MOMENTOS.find((m) => m.id === momento)!.texto;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-carbon/40 sm:items-center" role="dialog" aria-modal="true" aria-label={`Elegir ${momTxt.toLowerCase()} del ${diaTxt.toLowerCase()}`} onClick={onCerrar}>
      <div className="max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-lino p-5 pb-10 sm:rounded-[2rem]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-titulo text-2xl font-semibold">
            {momTxt} del {diaTxt.toLowerCase()}
          </p>
          <button onClick={onCerrar} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold ring-1 ring-niebla">
            Cerrar
          </button>
        </div>
        <ul className="space-y-2">
          {opciones.map(({ r, f, fav }) => (
            <li key={r.id}>
              <button
                onClick={() => {
                  actualizar({ menu: { ...datos.menu, [clave(dia, momento)]: r.id } });
                  onCerrar();
                }}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left ring-1 ring-niebla transition-colors hover:ring-salvia"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.foto} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.titulo}</span>
                  <span className="block text-sm text-carbon/60">
                    {fav ? "Favorita · " : ""}
                    {datos.despensa.length ? (f === 0 ? "Tienes todo" : `Falta${f === 1 ? "" : "n"} ${f}`) : r.tiempo}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
