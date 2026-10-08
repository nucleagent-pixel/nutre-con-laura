"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { fb } from "@/lib/firebase";
import { VACIO, cargarNutre, guardarNutre } from "@/lib/datos";
import type { DatosNutre } from "@/lib/tipos";

interface EstadoApp {
  user: User | null;
  cargando: boolean;
  tieneAcceso: boolean;
  datos: DatosNutre;
  /** Cambia los datos en pantalla al instante y los guarda en segundo plano. */
  actualizar: (cambios: Partial<DatosNutre>) => void;
  errorGuardado: string;
  cerrarSesion: () => Promise<void>;
}

const Contexto = createContext<EstadoApp | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);
  const [tieneAcceso, setTieneAcceso] = useState(false);
  const [datos, setDatos] = useState<DatosNutre>(VACIO);
  const [errorGuardado, setErrorGuardado] = useState("");
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    const { auth, db } = fb();
    return onAuthStateChanged(auth, async (u) => {
      setCargando(true);
      setUser(u);
      userRef.current = u;
      if (!u?.email) {
        setTieneAcceso(false);
        setDatos(VACIO);
        setCargando(false);
        return;
      }
      const email = u.email.toLowerCase();
      // Mismo criterio que la app del reto: entra cualquiera con cuenta, salvo que esté bloqueada.
      const [adm, bloq] = await Promise.all([
        getDoc(doc(db, "admins", email)).catch(() => null),
        getDoc(doc(db, "bloqueados", email)).catch(() => null),
      ]);
      const acceso = !!adm?.exists() || !bloq?.exists();
      setTieneAcceso(acceso);
      if (acceso) {
        try {
          setDatos(await cargarNutre(u.uid, email));
        } catch (e) {
          console.error("No se pudieron cargar los datos", e);
        }
      }
      setCargando(false);
    });
  }, []);

  const actualizar = useCallback((cambios: Partial<DatosNutre>) => {
    setDatos((d) => ({ ...d, ...cambios }));
    const u = userRef.current;
    if (!u) return;
    guardarNutre(u.uid, cambios)
      .then(() => setErrorGuardado(""))
      .catch((e) => {
        console.error(e);
        setErrorGuardado("No se pudo guardar el último cambio. Revisa tu conexión.");
      });
  }, []);

  const cerrarSesion = useCallback(async () => {
    await signOut(fb().auth);
  }, []);

  return (
    <Contexto.Provider value={{ user, cargando, tieneAcceso, datos, actualizar, errorGuardado, cerrarSesion }}>
      {children}
    </Contexto.Provider>
  );
}

export function useApp() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useApp debe usarse dentro de AuthProvider");
  return c;
}
