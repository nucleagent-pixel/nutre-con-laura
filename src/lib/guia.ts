// Contenido de la "Guía de alimentación para potenciar tu Reto Pilates".

export const PRINCIPIOS = [
  { texto: "Llena la mayor parte de tu plato con verduras.", clave: "verduras" },
  { texto: "Incluye una fuente de proteína en cada comida.", clave: "proteína" },
  { texto: "Prefiere grasas saludables.", clave: "grasas saludables" },
  { texto: "Elige cereales integrales cuando sea posible.", clave: "cereales integrales" },
  { texto: "Mantente bien hidratada durante el día.", clave: "hidratada" },
];

export const PLATO = [
  {
    porcentaje: 50,
    titulo: "Verduras",
    texto: "Llena la mitad de tu plato con verduras variadas. Aportan vitaminas, minerales, fibra y antioxidantes.",
    ejemplos: "Espinaca, brócoli, zanahoria, pimentón, tomate, pepino, repollo, lechuga, calabacín.",
    color: "bg-salvia",
  },
  {
    porcentaje: 25,
    titulo: "Proteínas",
    texto: "Ocupa un cuarto del plato con alimentos que te ayuden a construir y reparar tejidos, y a mantener la saciedad.",
    ejemplos: "Pollo, pescado, huevos, legumbres, tofu, carne magra.",
    color: "bg-madera",
  },
  {
    porcentaje: 25,
    titulo: "Carbohidratos de buena calidad",
    texto: "Completa el otro cuarto del plato con carbohidratos que te brinden energía sostenida.",
    ejemplos: "Arroz integral, quinoa, papa, camote, avena, pan integral, batata.",
    color: "bg-miel",
  },
];

export const AGUA = {
  texto:
    "Mantener una buena hidratación ayuda al funcionamiento normal del organismo y puede favorecer un mejor rendimiento durante la actividad física.",
  consejos: ["Lleva una botella reutilizable.", "Bebe agua durante el día.", "Incrementa tu consumo si haces ejercicio o hace mucho calor."],
};

export interface Idea {
  titulo: string;
  texto?: string;
  foto: string;
  buscar?: string; // texto para buscar recetas parecidas
}

export const IDEAS: { id: string; titulo: string; intro: string; ideas: Idea[] }[] = [
  {
    id: "desayuno",
    titulo: "5 desayunos sencillos",
    intro: "Opciones nutritivas, rápidas y deliciosas para comenzar tu día con energía.",
    ideas: [
      { titulo: "Yogur natural con frutas y avena", texto: "Ligero y rico en calcio, fibra y antioxidantes.", foto: "/guia/idea-desayuno-1.jpg", buscar: "yogur" },
      { titulo: "Huevos con pan integral y tomate", texto: "Proteína de calidad, energía y saciedad duradera.", foto: "/guia/idea-desayuno-2.jpg", buscar: "huevo" },
      { titulo: "Avena cocida con canela y fruta", texto: "Energía sostenible y amiga de la digestión.", foto: "/guia/idea-desayuno-3.jpg", buscar: "avena" },
      { titulo: "Tostadas integrales con aguacate y huevo", texto: "Grasas saludables, proteínas y nutrientes esenciales.", foto: "/guia/idea-desayuno-4.jpg", buscar: "aguacate" },
      { titulo: "Batido de frutas con yogur natural", texto: "Refrescante, nutritivo y completo. Ideal para mañanas activas.", foto: "/guia/idea-desayuno-5.jpg", buscar: "smoothie" },
    ],
  },
  {
    id: "almuerzo",
    titulo: "5 almuerzos equilibrados",
    intro: "Opciones nutritivas y deliciosas para mantener tu energía durante el día.",
    ideas: [
      { titulo: "Pollo con arroz integral y verduras", texto: "Proteínas magras, fibra y vitaminas.", foto: "/guia/idea-almuerzo-1.jpg", buscar: "pollo" },
      { titulo: "Salmón con vegetales", texto: "Omega-3, proteínas de calidad y antioxidantes.", foto: "/guia/idea-almuerzo-2.jpg", buscar: "salmón" },
      { titulo: "Ensalada con pollo y aguacate", texto: "Ligera, fresca y con grasas saludables.", foto: "/guia/idea-almuerzo-3.jpg", buscar: "ensalada" },
      { titulo: "Lentejas con verduras", texto: "Hierro, fibra y saciedad duradera. Ideal opción vegetal.", foto: "/guia/idea-almuerzo-4.jpg", buscar: "lentejas" },
      { titulo: "Carne magra con papa y ensalada", texto: "Proteínas, carbohidratos complejos y fibra.", foto: "/guia/idea-almuerzo-5.jpg", buscar: "res" },
    ],
  },
  {
    id: "cena",
    titulo: "5 cenas ligeras",
    intro: "Opciones saludables, fáciles de preparar y perfectas para terminar el día.",
    ideas: [
      { titulo: "Omelette de espinacas y tomate", foto: "/guia/idea-cena-1.jpg", buscar: "espinaca" },
      { titulo: "Sopa de verduras casera", foto: "/guia/idea-cena-2.jpg", buscar: "sopa" },
      { titulo: "Pechuga de pollo con quinoa y brócoli", foto: "/guia/idea-cena-3.jpg", buscar: "quinoa" },
      { titulo: "Ensalada de atún y aguacate", foto: "/guia/idea-cena-4.jpg", buscar: "atún" },
      { titulo: "Tostada integral con aguacate y huevo", foto: "/guia/idea-cena-5.jpg", buscar: "tostada" },
    ],
  },
  {
    id: "snack",
    titulo: "Para media mañana o media tarde",
    intro: "Ideas saludables para mantener tu energía y evitar grandes comidas entre horas.",
    ideas: [
      { titulo: "Fruta fresca", foto: "/guia/idea-snack-1.jpg" },
      { titulo: "Yogur natural", foto: "/guia/idea-snack-2.jpg" },
      { titulo: "Frutos secos", foto: "/guia/idea-snack-3.jpg" },
      { titulo: "Palitos de zanahoria", foto: "/guia/idea-snack-4.jpg" },
      { titulo: "Queso fresco", foto: "/guia/idea-snack-5.jpg" },
      { titulo: "Hummus con vegetales", foto: "/guia/idea-snack-6.jpg" },
    ],
  },
];

export const HABITOS = [
  { id: "despacio", texto: "Comer despacio" },
  { id: "verduras", texto: "Incluir verduras" },
  { id: "agua", texto: "Tomar suficiente agua" },
  { id: "dormir", texto: "Dormir bien" },
  { id: "horarios", texto: "Mantener horarios regulares" },
  { id: "actividad", texto: "Practicar actividad física" },
  { id: "sin-culpa", texto: "Disfrutar la comida sin culpa" },
];
