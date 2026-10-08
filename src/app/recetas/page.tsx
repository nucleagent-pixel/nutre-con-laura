"use client";

import { useEffect, useMemo, useState } from "react";
import Protegido from "@/components/Protegido";
import TarjetaReceta from "@/components/TarjetaReceta";
import { useApp } from "@/components/AuthProvider";
import { ETIQUETAS, RECETAS, TIPOS, faltantes } from "@/lib/recetas";
import type { Etiqueta, TipoComida } from "@/lib/tipos";

export default function Recetas() {
  return (
    <Protegido>
      <Contenido />
    </Protegido>
  );
}

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function Contenido() {
  const { datos } = useApp();
  const [tipo, setTipo] = useState<TipoComida | "todas">("todas");
  const [filtros, setFiltros] = useState<Etiqueta[]>([]);
  const [soloFavoritas, setSoloFavoritas] = useState(false);
  const [soloDespensa, setSoloDespensa] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tipo");
    if (t && TIPOS.some((x) => x.id === t)) setTipo(t as TipoComida);
  }, []);

  const despensa = useMemo(() => new Set<string>(datos.despensa), [datos.despensa]);

  const lista = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return RECETAS.filter(
      (r) =>
        (tipo === "todas" || r.tipos.includes(tipo)) &&
        filtros.every((f) => r.etiquetas.includes(f)) &&
        (!soloFavoritas || datos.favoritas.includes(r.id)) &&
        (!soloDespensa || faltantes(r, despensa).length === 0) &&
        (!q || normalizar(r.titulo + " " + r.ingredientes.join(" ")).includes(q)),
    );
  }, [tipo, filtros, soloFavoritas, soloDespensa, busqueda, datos.favoritas, despensa]);

  const alternar = (e: Etiqueta) => setFiltros((f) => (f.includes(e) ? f.filter((x) => x !== e) : [...f, e]));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="titular">Recetas</h1>
        <p className="mt-2 text-carbon/70">{RECETAS.length} recetas para acompañar tu proceso.</p>
      </header>

      <input
        type="search"
        className="input"
        placeholder="Busca por nombre o ingrediente: pollo, avena…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        aria-label="Buscar recetas"
      />

      <nav aria-label="Tipo de comida" className="-mx-5 overflow-x-auto px-5">
        <div className="flex w-max gap-2">
          {[{ id: "todas" as const, plural: "Todas" }, ...TIPOS].map((t) => (
            <button
              key={t.id}
              onClick={() => setTipo(t.id)}
              aria-pressed={tipo === t.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tipo === t.id ? "bg-carbon text-white" : "bg-white ring-1 ring-niebla hover:bg-salvia-fondo"
              }`}
            >
              {t.plural}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex flex-wrap gap-2">
        {ETIQUETAS.map((e) => (
          <button key={e.id} onClick={() => alternar(e.id)} aria-pressed={filtros.includes(e.id)} className={`chip ${filtros.includes(e.id) ? "chip-activo" : ""}`}>
            {e.texto}
          </button>
        ))}
        <button onClick={() => setSoloFavoritas(!soloFavoritas)} aria-pressed={soloFavoritas} className={`chip ${soloFavoritas ? "chip-activo" : ""}`}>
          Mis favoritas
        </button>
        {datos.despensa.length > 0 && (
          <button onClick={() => setSoloDespensa(!soloDespensa)} aria-pressed={soloDespensa} className={`chip ${soloDespensa ? "chip-activo" : ""}`}>
            Con lo que tengo
          </button>
        )}
      </div>

      <p className="text-sm text-carbon/70" aria-live="polite">
        {lista.length} {lista.length === 1 ? "receta" : "recetas"}
      </p>

      {lista.length === 0 ? (
        <div className="tarjeta text-center">
          <p className="font-semibold">No hay recetas con esos filtros.</p>
          <button
            className="boton-sec mt-4"
            onClick={() => {
              setFiltros([]);
              setSoloFavoritas(false);
              setSoloDespensa(false);
              setBusqueda("");
              setTipo("todas");
            }}
          >
            Quitar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {lista.map((r) => (
            <TarjetaReceta key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}
