"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", texto: "Inicio", icono: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" },
  { href: "/recetas/", texto: "Recetas", icono: "M4 3v7a3 3 0 003 3v8M7 3v6M10 3v7a3 3 0 01-3 3M17 21V3c-2 1-3 3.5-3 7s1 4 3 4" },
  { href: "/despensa/", texto: "Despensa", icono: "M4 7h16l-1.5 13h-13zM8 7V5a4 4 0 018 0v2" },
  { href: "/menu/", texto: "Mi menú", icono: "M5 4h14v17H5zM9 9h6M9 13h6M9 17h3" },
  { href: "/guia/", texto: "Guía", icono: "M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z" },
];

export default function NavInferior() {
  const ruta = usePathname();
  const activo = (href: string) =>
    href === "/" ? ruta === "/" : ruta.startsWith(href) || (href === "/recetas/" && (ruta.startsWith("/receta") || ruta.startsWith("/batidos")));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-niebla bg-lino/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-xl justify-between px-2">
        {ITEMS.map((it) => (
          <li key={it.href} className="flex-1">
            <Link
              href={it.href}
              aria-current={activo(it.href) ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                activo(it.href) ? "text-salvia" : "text-carbon/50 hover:text-carbon"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={it.icono} />
              </svg>
              {it.texto}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
