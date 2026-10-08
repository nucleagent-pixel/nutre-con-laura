"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./AuthProvider";
import Cargando from "./Cargando";
import NavInferior from "./NavInferior";
import Marca from "./Marca";

export default function Protegido({ children }: { children: ReactNode }) {
  const { user, cargando, tieneAcceso, errorGuardado } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;
    if (!user) router.replace("/login/");
    else if (!tieneAcceso) router.replace("/sin-acceso/");
  }, [cargando, user, tieneAcceso, router]);

  if (cargando || !user || !tieneAcceso) return <Cargando />;

  return (
    <div className="min-h-dvh pb-28">
      <main className="mx-auto max-w-xl px-5 pt-5">
        <div className="mb-6">
          <Marca />
        </div>
        {errorGuardado && (
          <p role="alert" className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorGuardado}
          </p>
        )}
        {children}
      </main>
      <NavInferior />
    </div>
  );
}
