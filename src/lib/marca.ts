// Textos y datos de la marca. Edita aquí sin tocar el resto del código.
export const MARCA = {
  nombre: "Nutre con Laura",
  instructora: "Laura",
  eslogan: "Haz de la alimentación tu amiga, no tu enemiga.",
  avatar: "/laura-avatar.jpg",
  // Link a la web del reto de pilates (para el botón "Ir a mis clases"). Déjalo vacío para ocultarlo.
  urlReto: "",
};

export const NOTAS_LAURA = [
  "Comer bien no es comer perfecto. Es comer con intención.",
  "Un plato con color es un plato con nutrientes.",
  "No hay alimentos prohibidos, hay porciones y frecuencias.",
  "Hoy prueba agregar una verdura más a tu almuerzo.",
  "El agua también es parte de tu alimentación. ¿Ya tomaste un vaso?",
  "Cocinar en casa es una forma de cuidarte.",
  "Escucha tu hambre: come despacio y para cuando estés satisfecha.",
  "Lo que compras define lo que comes. Haz tu lista con calma.",
  "Un buen desayuno te acompaña toda la mañana.",
  "Disfruta la comida sin culpa. Es parte del proceso.",
];

export function notaDelDia() {
  const inicio = new Date(new Date().getFullYear(), 0, 0).getTime();
  const dia = Math.floor((Date.now() - inicio) / 86400000);
  return NOTAS_LAURA[dia % NOTAS_LAURA.length];
}
