import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { fb } from "./firebase";
import type { DatosNutre } from "./tipos";

// Se guarda en el mismo documento de la clienta que usa la app del reto (usuarios/{uid}),
// dentro del campo "nutre", así las reglas de seguridad que ya existen lo protegen.

export const VACIO: DatosNutre = { favoritas: [], despensa: [], menu: {}, habitos: {}, compromiso: "" };

export async function cargarNutre(uid: string, email: string): Promise<DatosNutre> {
  const ref = doc(fb().db, "usuarios", uid);
  const s = await getDoc(ref);
  if (!s.exists()) {
    // Clienta que entra primero a esta app: se crea su documento.
    await setDoc(ref, { email: email.toLowerCase(), nombre: "", completados: {}, diasActivos: [], nutre: VACIO });
    return { ...VACIO };
  }
  return { ...VACIO, ...(s.data().nutre ?? {}) };
}

/** Reemplaza los campos indicados (por ejemplo, el menú completo). */
export async function guardarNutre(uid: string, cambios: Partial<DatosNutre>) {
  const campos = Object.fromEntries(Object.entries(cambios).map(([k, v]) => [`nutre.${k}`, v]));
  await updateDoc(doc(fb().db, "usuarios", uid), campos);
}
