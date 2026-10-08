# Nutre con Laura

Web de alimentación del Reto Pilates 30D: 120 recetas (desayunos, almuerzos, cenas, snacks y postres), 20 batidos verdes, despensa ("¿qué puedo cocinar con lo que tengo?"), menú semanal con lista de compras y la guía de alimentación.

Usa **el mismo proyecto de Firebase que la web del reto** (`pilates-9b67f`): la clienta entra con el mismo correo y contraseña, y sus datos de alimentación se guardan en su mismo documento (`usuarios/{uid}` → campo `nutre`). No hay que cambiar las reglas de Firestore.

## Publicarla (igual que la web del reto)

1. **GitHub:** crea un repositorio nuevo (ej. `nutre-con-laura`) y sube todo el contenido de esta carpeta. Revisa que queden `src`, `public` y `package.json` en la raíz.
2. **Netlify:** Add new site → Import from Git → elige el repositorio.
3. **Variables:** en Netlify → Environment variables → **Import from a .env file**, pega las mismas 6 variables `NEXT_PUBLIC_FIREBASE_...` que tiene la web del reto (mismos valores).
4. **Firebase → Authentication → Configuración → Dominios autorizados:** agrega el dominio nuevo de Netlify (ej. `nutre-con-laura.netlify.app`). Sin esto el login no funciona.
5. Deploy.

## Personalizar

| Qué | Dónde |
|---|---|
| Nombre, eslogan, notas de Laura, link a la web del reto | `src/lib/marca.ts` |
| Recetas y batidos | `src/data/recetas.json` |
| Alimentos de la despensa | `src/data/ingredientes.json` |
| Textos de la guía | `src/lib/guia.ts` |
| Logo | sube `public/marca/logo-nutre.png` (y `logo-nutre-blanco.png` para el login), fondo transparente |

## Cómo funciona la despensa

Cada receta tiene una lista de ingredientes **esenciales** y otra de **extras** (hierbas, limón, semillas, ingredientes "opcionales" o "para decorar"). Solo los esenciales cuentan para "te falta". Sal, aceite, agua y especias se dan por hechos.

## Próximo paso: recetas con IA

La estructura está lista para agregar el botón "Créame una receta con lo que tengo" (OpenAI desde una función de Netlify, con límite diario por clienta).
