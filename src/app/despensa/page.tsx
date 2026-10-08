"use client";

import { useMemo, useState } from "react";
import Protegido from "@/components/Protegido";
import TarjetaReceta from "@/components/TarjetaReceta";
import { useApp } from "@/components/AuthProvider";
import { INGREDIENTES, NOMBRE_INGREDIENTE, porDespensa } from "@/lib/recetas";

export default function Despensa() {
  return (
    <Protegido>
      <Contenido />
    </Protegido>
  );
}

const GRUPOS = [...new Set(INGREDIENTES.map((i) => i.grupo))];

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function Contenido() {
  const { datos, actualizar } = useApp();
  const [vista, setVista] = useState<"tengo" | "cocinar">(datos.despensa.length ? "cocinar" : "tengo");
  const [busqueda, setBusqueda] = useState("");
  const [nivel, setNivel] = useState<0 | 1 | 2>(0);
  const despensa = useMemo(() => new Set<string>(datos.despensa), [datos.despensa]);

  const alternar = (id: string) =>
    actualizar({ despensa: despensa.has(id) ? datos.despensa.filter((x) => x !== id) : [...datos.despensa, id] });

  const resultados = useMemo(() => porDespensa(despensa), [despensa]);
  const conteo = [0, 1, 2].map((n) => resultados.filter((x) => x.faltan.length === n).length);
  const q = normalizar(busqueda.trim());

  return (
    <div className="space-y-5">
      <header>
        <h1 className="titular">Mi despensa</h1>
        <p className="mt-2 text-carbon/70">Marca lo que compras siempre o lo que tienes hoy en casa, y descubre qué puedes cocinar.</p>
      </header>

      <div className="grid grid-cols-2 rounded-full bg-salvia-fondo p-1 text-sm font-semibold" role="tablist">
        {(
          [
            ["tengo", `Lo que tengo (${datos.despensa.length})`],
            ["cocinar", "Qué puedo cocinar"],
          ] as const
        ).map(([k, t]) => (
          <button
            key={k}
            role="tab"
            aria-selected={vista === k}
            onClick={() => setVista(k)}
            className={`rounded-full py-2.5 transition-colors ${vista === k ? "bg-white shadow-sm" : "text-carbon/60"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {vista === "tengo" ? (
        <>
          <input
            type="search"
            className="input"
            placeholder="Busca un alimento: palta, cambur, caraotas…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar alimento"
          />
          <p className="text-sm text-carbon/70">
            Sal, aceite, agua y especias se cuentan como básicos que ya tienes.
          </p>
          {GRUPOS.map((g) => {
            const items = INGREDIENTES.filter((i) => i.grupo === g && (!q || normalizar(i.nombre).includes(q)));
            if (!items.length) return null;
            const marcados = items.filter((i) => despensa.has(i.id)).length;
            return (
              <section key={g} aria-label={g}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="font-titulo text-2xl font-semibold">{g}</h2>
                  {marcados > 0 && <span className="text-sm text-carbon/60">{marcados} marcados</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((i) => {
                    const tiene = despensa.has(i.id);
                    return (
                      <button
                        key={i.id}
                        onClick={() => alternar(i.id)}
                        aria-pressed={tiene}
                        className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                          tiene ? "bg-salvia font-semibold text-white" : "bg-white ring-1 ring-niebla hover:bg-salvia-fondo"
                        }`}
                      >
                        {tiene ? "✓ " : ""}
                        {i.nombre}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {datos.despensa.length > 0 && (
            <div className="sticky bottom-24 z-10 flex gap-2">
              <button className="boton flex-1 shadow-lg" onClick={() => setVista("cocinar")}>
                Ver qué puedo cocinar ({conteo[0]})
              </button>
              <button
                className="boton-sec shadow-lg"
                onClick={() => confirm("¿Vaciar tu despensa?") && actualizar({ despensa: [] })}
              >
                Vaciar
              </button>
            </div>
          )}
        </>
      ) : datos.despensa.length === 0 ? (
        <div className="tarjeta space-y-3 text-center">
          <p className="font-semibold">Tu despensa está vacía.</p>
          <p className="text-carbon/70">Marca los alimentos que tienes en casa para ver qué recetas puedes preparar.</p>
          <button className="boton" onClick={() => setVista("tengo")}>
            Marcar alimentos
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {([0, 1, 2] as const).map((n) => (
              <button
                key={n}
                onClick={() => setNivel(n)}
                aria-pressed={nivel === n}
                className={`rounded-2xl px-2 py-3 text-center transition-colors ${
                  nivel === n ? "bg-carbon text-white" : "bg-white ring-1 ring-niebla hover:bg-salvia-fondo"
                }`}
              >
                <span className="block font-titulo text-3xl font-bold leading-none">{conteo[n]}</span>
                <span className="mt-1 block text-xs">{n === 0 ? "Tienes todo" : n === 1 ? "Falta 1" : "Faltan 2"}</span>
              </button>
            ))}
          </div>
          {conteo[nivel] === 0 ? (
            <p className="tarjeta text-carbon/70">
              {nivel === 0
                ? "Todavía no hay recetas que puedas hacer solo con lo que marcaste. Mira las que te faltan 1 o 2 ingredientes, o agrega más alimentos."
                : "No hay recetas en este grupo."}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
              {resultados
                .filter((x) => x.faltan.length === nivel)
                .map(({ r, faltan }) => (
                  <div key={r.id}>
                    <TarjetaReceta r={r} />
                    {faltan.length > 0 && (
                      <p className="mt-0.5 text-sm text-carbon/70">Falta: {faltan.map((f) => NOMBRE_INGREDIENTE[f]?.toLowerCase()).join(", ")}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
