"use client";

import Link from "next/link";
import Protegido from "@/components/Protegido";
import TarjetaReceta from "@/components/TarjetaReceta";
import { AvatarLaura } from "@/components/Marca";
import { useApp } from "@/components/AuthProvider";
import { RECETAS, TIPOS, comidaDeAhora, elegirDelDia, porDespensa, receta } from "@/lib/recetas";
import { DIAS, MOMENTOS, clave } from "@/lib/menu";
import { MARCA, notaDelDia } from "@/lib/marca";

export default function Inicio() {
  return (
    <Protegido>
      <Contenido />
    </Protegido>
  );
}

function Contenido() {
  const { user, datos } = useApp();
  const nombre = (user?.displayName || "").split(" ")[0];
  const ahora = comidaDeAhora();
  const textoAhora = TIPOS.find((t) => t.id === ahora)!.texto.toLowerCase();
  const despensa = new Set<string>(datos.despensa);

  const delMomento = RECETAS.filter((r) => r.tipos.includes(ahora) || (ahora === "snack" && r.tipos.includes("postre")));
  const sugeridas = despensa.size
    ? porDespensa(despensa, delMomento).slice(0, 6).map((x) => x.r)
    : elegirDelDia(delMomento, 6);
  const posibles = despensa.size ? porDespensa(despensa).filter((x) => x.faltan.length === 0).length : 0;

  const diaHoy = DIAS[(new Date().getDay() + 6) % 7];
  const menuHoy = MOMENTOS.map((m) => ({ m, r: receta(datos.menu[clave(diaHoy.id, m.id)] ?? "") })).filter((x) => x.r);
  const favoritas = datos.favoritas.map((id) => receta(id)).filter(Boolean);
  const batidos = RECETAS.filter((r) => r.verde).slice(0, 3);

  return (
    <div className="space-y-9">
      <header className="space-y-4">
        <h1 className="titular">Hola{nombre ? `, ${nombre}` : ""}</h1>
        <div className="flex items-start gap-3">
          <AvatarLaura />
          <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 ring-1 ring-niebla">
            <p className="leading-snug">{notaDelDia()}</p>
            <p className="mt-1 text-xs font-semibold text-salvia">{MARCA.instructora}</p>
          </div>
        </div>
      </header>

      {/* Sugerencias para el momento del día */}
      <section aria-labelledby="t-ahora">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="t-ahora" className="font-titulo text-3xl font-semibold leading-none">
            Ideas para tu {textoAhora}
          </h2>
          <Link href={`/recetas/?tipo=${ahora}`} className="shrink-0 text-sm font-semibold text-salvia hover:underline">
            Ver todas
          </Link>
        </div>
        {despensa.size > 0 && <p className="-mt-1 mb-3 text-sm text-carbon/70">Ordenadas según lo que tienes en tu despensa.</p>}
        <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
          {sugeridas.map((r) => (
            <TarjetaReceta key={r.id} r={r} ancho />
          ))}
        </div>
      </section>

      {/* Despensa */}
      <Link
        href="/despensa/"
        className="relative block overflow-hidden rounded-[2rem] bg-salvia p-6 text-white transition-colors hover:bg-carbon"
      >
        {despensa.size === 0 ? (
          <>
            <p className="font-titulo text-4xl font-bold leading-none">¿Qué tienes en casa?</p>
            <p className="mt-3 max-w-xs text-white/90">
              Marca los alimentos que compras siempre y te mostramos qué puedes cocinar con ellos.
            </p>
            <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-carbon">Armar mi despensa</span>
          </>
        ) : (
          <>
            <p className="text-white/85">Con lo que tienes en casa puedes preparar</p>
            <p className="font-titulo text-6xl font-bold leading-none">
              {posibles} {posibles === 1 ? "receta" : "recetas"}
            </p>
            <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-carbon">Ver qué puedo cocinar</span>
          </>
        )}
      </Link>

      {/* Menú de hoy */}
      <section aria-labelledby="t-hoy">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="t-hoy" className="font-titulo text-3xl font-semibold">
            Tu menú de hoy
          </h2>
          <Link href="/menu/" className="text-sm font-semibold text-salvia hover:underline">
            {menuHoy.length ? "Ver semana" : "Armar"}
          </Link>
        </div>
        {menuHoy.length ? (
          <ul className="divide-y divide-niebla overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-niebla">
            {menuHoy.map(({ m, r }) => (
              <li key={m.id}>
                <Link href={`/receta/?id=${r!.id}`} className="flex items-center gap-3 p-3 transition-colors hover:bg-salvia-fondo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r!.foto} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0">
                    <span className="block text-sm text-carbon/60">{m.texto}</span>
                    <span className="block truncate font-semibold">{r!.titulo}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="tarjeta text-carbon/70">
            Aún no tienes menú para esta semana.{" "}
            <Link href="/menu/" className="font-semibold text-salvia underline-offset-4 hover:underline">
              Ármalo en un toque
            </Link>{" "}
            con lo que tienes en casa.
          </p>
        )}
      </section>

      {/* Batidos verdes */}
      <Link href="/batidos/" className="flex items-center gap-4 overflow-hidden rounded-[2rem] bg-[#DDE6CF] p-5 transition-colors hover:bg-[#d2ddc1]">
        <div className="flex shrink-0 -space-x-5">
          {batidos.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={b.id} src={b.foto} alt="" className="h-16 w-16 rounded-full object-cover ring-4 ring-[#DDE6CF]" />
          ))}
        </div>
        <div>
          <p className="font-titulo text-3xl font-bold leading-none text-salvia">Batidos verdes</p>
          <p className="mt-1 text-sm text-carbon/75">{RECETAS.filter((r) => r.verde).length} recetas de 5 minutos</p>
        </div>
      </Link>

      {favoritas.length > 0 && (
        <section aria-labelledby="t-fav">
          <h2 id="t-fav" className="mb-3 font-titulo text-3xl font-semibold">
            Tus favoritas
          </h2>
          <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
            {favoritas.map((r) => (
              <TarjetaReceta key={r!.id} r={r!} ancho />
            ))}
          </div>
        </section>
      )}

      <Link href="/guia/" className="group relative block overflow-hidden rounded-[2rem] bg-carbon text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guia/plato-equilibrado.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" />
        <div className="relative p-6 pt-24">
          <p className="font-titulo text-4xl font-bold leading-none">Guía de alimentación</p>
          <p className="mt-2 max-w-xs text-white/90">El plato equilibrado, ideas para cada comida y pequeños hábitos.</p>
        </div>
      </Link>

      {MARCA.urlReto && (
        <a href={MARCA.urlReto} className="boton-sec w-full">
          Ir a mis clases del reto
        </a>
      )}
    </div>
  );
}
