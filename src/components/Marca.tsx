"use client";

import { useState } from "react";
import { MARCA } from "@/lib/marca";

/** Símbolo provisional: un plato visto desde arriba con una hoja. */
export function Simbolo({ tam = 36, claro = false }: { tam?: number; claro?: boolean }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r="20" fill="none" stroke={claro ? "#fff" : "#55684F"} strokeWidth="3.5" />
      <path
        d="M17 31c0-9 6-15 15-15 0 9-6 15-15 15z"
        fill={claro ? "#F1F0EB" : "#A87C55"}
      />
      <path d="M17 31l8-8" stroke={claro ? "#55684F" : "#F1F0EB"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Si subes public/marca/logo-nutre.png (fondo transparente) se usa ese; si no, el símbolo con el nombre. */
export default function Marca({ claro = false, grande = false }: { claro?: boolean; grande?: boolean }) {
  const [sinLogo, setSinLogo] = useState(false);
  if (!sinLogo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={claro ? "/marca/logo-nutre-blanco.png" : "/marca/logo-nutre.png"}
        alt={MARCA.nombre}
        className={grande ? "h-20 w-auto" : "h-10 w-auto"}
        onError={() => setSinLogo(true)}
      />
    );
  }
  return (
    <div className={`flex items-center gap-2.5 font-titulo leading-none ${claro ? "text-white" : "text-carbon"}`}>
      <Simbolo tam={grande ? 56 : 34} claro={claro} />
      <div>
        <p className={`${grande ? "text-5xl" : "text-2xl"} font-bold tracking-tight`}>nutre</p>
        <p className={`${grande ? "text-2xl" : "text-sm"} font-light tracking-[0.25em] ${claro ? "text-white/85" : "text-salvia"}`}>
          con laura
        </p>
      </div>
    </div>
  );
}

export function AvatarLaura({ tam = 44 }: { tam?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={MARCA.avatar}
      alt={MARCA.instructora}
      className="shrink-0 rounded-full object-cover ring-2 ring-white"
      style={{ width: tam, height: tam }}
    />
  );
}
