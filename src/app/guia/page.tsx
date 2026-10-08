"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Protegido from "@/components/Protegido";
import { useApp } from "@/components/AuthProvider";
import { AGUA, HABITOS, IDEAS, PLATO, PRINCIPIOS } from "@/lib/guia";

export default function Guia() {
  return (
    <Protegido>
      <Contenido />
    </Protegido>
  );
}

function fechaHoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Contenido() {
  const { datos, actualizar } = useApp();
  const hoy = fechaHoy();
  const cumplidos = datos.habitos[hoy] ?? [];
  const [compromiso, setCompromiso] = useState(datos.compromiso);
  const [guardado, setGuardado] = useState(false);
  useEffect(() => setCompromiso(datos.compromiso), [datos.compromiso]);

  function alternarHabito(id: string) {
    const nuevos = cumplidos.includes(id) ? cumplidos.filter((h) => h !== id) : [...cumplidos, id];
    // Se guardan solo los últimos 60 días.
    const fechas = Object.keys(datos.habitos).sort().slice(-59);
    const habitos = Object.fromEntries(fechas.map((f) => [f, datos.habitos[f]]));
    habitos[hoy] = nuevos;
    actualizar({ habitos });
  }

  return (
    <div className="space-y-10">
      <header className="-mx-5 sm:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guia/desayunando.jpg" alt="" className="aspect-[16/10] w-full object-cover sm:rounded-[2rem]" />
        <div className="px-5 pt-5 sm:px-0">
          <h1 className="titular">La alimentación también es parte del cambio</h1>
          <p className="mt-3 leading-relaxed text-carbon/80">
            No necesitas seguir dietas extremas ni eliminar todos tus alimentos favoritos para sentirte mejor. Una alimentación
            equilibrada consiste en crear hábitos sostenibles que aporten energía, favorezcan tu bienestar y complementen el
            ejercicio.
          </p>
          <p className="mt-4 rounded-2xl bg-salvia-fondo px-4 py-3 font-medium">
            Ningún alimento por sí solo produce resultados. Lo importante es la constancia y el equilibrio.
          </p>
        </div>
      </header>

      <section aria-labelledby="t-principios">
        <h2 id="t-principios" className="mb-4 font-titulo text-3xl font-semibold">
          5 principios de una alimentación equilibrada
        </h2>
        <ol className="space-y-2">
          {PRINCIPIOS.map((p, i) => (
            <li key={p.clave} className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3 ring-1 ring-niebla">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-salvia font-titulo text-xl font-bold text-white">{i + 1}</span>
              <span>{p.texto}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="t-plato">
        <h2 id="t-plato" className="font-titulo text-3xl font-semibold">
          Así puede verse un plato equilibrado
        </h2>
        <p className="mt-2 text-carbon/70">Una buena distribución en tu plato te ayuda a tener energía y sentirte bien.</p>
        {/* Barra proporcional del plato */}
        <div className="mt-4 flex h-4 overflow-hidden rounded-full" aria-hidden>
          {PLATO.map((p) => (
            <span key={p.titulo} className={p.color} style={{ width: `${p.porcentaje}%` }} />
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {PLATO.map((p) => (
            <div key={p.titulo} className="tarjeta">
              <div className="flex items-baseline gap-3">
                <span className={`rounded-full px-2.5 py-0.5 font-titulo text-lg font-bold text-white ${p.color}`}>{p.porcentaje}%</span>
                <p className="font-titulo text-2xl font-semibold">{p.titulo}</p>
              </div>
              <p className="mt-2 text-carbon/80">{p.texto}</p>
              <p className="mt-2 text-sm text-carbon/70">
                <strong className="text-carbon">Ejemplos:</strong> {p.ejemplos}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-carbon/70">Acompaña tu plato con agua, come con atención y escucha las señales de tu cuerpo.</p>
      </section>

      <section aria-labelledby="t-agua" className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-niebla sm:flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guia/agua.jpg" alt="" className="h-56 w-full object-cover object-top sm:h-auto sm:w-2/5" />
        <div className="p-5">
          <h2 id="t-agua" className="font-titulo text-3xl font-semibold">
            No olvides el agua
          </h2>
          <p className="mt-2 text-carbon/80">{AGUA.texto}</p>
          <ul className="mt-3 space-y-1.5">
            {AGUA.consejos.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-salvia" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {IDEAS.map((g) => (
        <section key={g.id} aria-labelledby={`t-${g.id}`}>
          <h2 id={`t-${g.id}`} className="font-titulo text-3xl font-semibold">
            {g.titulo}
          </h2>
          <p className="mb-3 mt-1 text-carbon/70">{g.intro}</p>
          <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
            {g.ideas.map((i) => (
              <li key={i.titulo} className="w-44 shrink-0 snap-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.foto} alt="" loading="lazy" className="aspect-square w-full rounded-[1.5rem] object-cover" />
                <p className="mt-2 font-semibold leading-tight">{i.titulo}</p>
                {i.texto && <p className="mt-0.5 text-sm text-carbon/70">{i.texto}</p>}
              </li>
            ))}
          </ul>
          {g.id !== "snack" && (
            <Link href={`/recetas/?tipo=${g.id}`} className="mt-2 inline-block text-sm font-semibold text-salvia hover:underline">
              Ver recetas de {g.id === "desayuno" ? "desayunos" : g.id === "almuerzo" ? "almuerzos" : "cenas"}
            </Link>
          )}
        </section>
      ))}

      <section aria-labelledby="t-habitos" className="tarjeta">
        <h2 id="t-habitos" className="font-titulo text-3xl font-semibold">
          Pequeños hábitos de hoy
        </h2>
        <p className="mt-1 text-carbon/70">Marca los que cumpliste. Mañana empiezas de nuevo.</p>
        <ul className="mt-4 space-y-2">
          {HABITOS.map((h) => {
            const ok = cumplidos.includes(h.id);
            return (
              <li key={h.id}>
                <button
                  onClick={() => alternarHabito(h.id)}
                  role="checkbox"
                  aria-checked={ok}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${ok ? "bg-salvia text-white" : "bg-lino hover:bg-salvia-fondo"}`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${ok ? "border-white" : "border-carbon/30"}`}>{ok ? "✓" : ""}</span>
                  {h.texto}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm font-semibold text-salvia">
          {cumplidos.length} de {HABITOS.length} hoy
        </p>
      </section>

      <section aria-labelledby="t-comp" className="overflow-hidden rounded-[2rem] bg-carbon text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/guia/bienestar.jpg" alt="" className="h-64 w-full object-cover object-top opacity-90" />
        <div className="space-y-3 p-6">
          <h2 id="t-comp" className="font-titulo text-4xl font-bold leading-none">
            Tu bienestar es el resultado de tus hábitos
          </h2>
          <p className="text-white/85">
            El ejercicio, el descanso y una alimentación equilibrada forman un equipo. No busques la perfección; busca la
            constancia.
          </p>
          <label htmlFor="comp" className="block pt-2 font-semibold">
            Mi compromiso a partir de hoy
          </label>
          <textarea
            id="comp"
            rows={3}
            className="input text-carbon"
            value={compromiso}
            onChange={(e) => setCompromiso(e.target.value)}
            placeholder="Ej: tomar 2 litros de agua al día y cocinar en casa 4 veces por semana."
          />
          <button
            className="boton bg-white text-carbon hover:bg-lino hover:text-carbon"
            disabled={compromiso === datos.compromiso}
            onClick={() => {
              actualizar({ compromiso: compromiso.trim() });
              setGuardado(true);
              setTimeout(() => setGuardado(false), 1800);
            }}
          >
            {guardado ? "Guardado" : "Guardar mi compromiso"}
          </button>
        </div>
      </section>
    </div>
  );
}
