/**
 * ==============================================================================
 * UN JARDÍN PARA MILAGROS - ARCHIVO CENTRAL DE DATOS Y CONTENIDOS
 * ==============================================================================
 * 
 * Estructura de datos para gestionar los detalles, flores, notas y recuerdos.
 * Diseñado con estética sobria, elegante y respetuosa.
 */

export const gardenData = {
  // Dedicatoria y pantalla inicial
  dedication: {
    recipient: "Milagros",
    subtitle: "Hay noticias que merecen algo más que un simple ‘felicidades’.",
    enterButtonText: "Entrar al jardín",
    initialTourSubtitles: [
      {
        text: "Recién estoy comenzando a conocerte.",
        duration: 2400,
        delay: 200
      },
      {
        text: "Pero ya hubo algo que me dio mucha alegría escuchar.",
        duration: 2600,
        delay: 2800
      }
    ]
  },

  // 1. FLORES Y DETALLES PRINCIPALES (Flor del Ascenso y futuros hitos)
  flowers: [
    {
      id: "flor-del-ascenso",
      title: "Una flor por un nuevo comienzo",
      subtitle: "Celebrando tu ascenso",
      date: "Septiembre 2024",
      type: "achievement",
      flowerColor: "champagne",
      isPrimary: true,
      position3D: { x: 0, y: 0.65, z: -1.2 },
      card: {
        title: "Una flor por un nuevo comienzo",
        paragraphs: [
          "Cuando me contaste que te habían ascendido en tu trabajo, pensé que una noticia así merecía algo más que un mensaje rápido.",
          "No conozco todavía todo el camino que recorriste para conseguirlo, pero sé que detrás de un ascenso hay esfuerzo, responsabilidad y muchas cosas que otras personas no siempre ven.",
          "Así que este pequeño rincón del jardín empieza celebrando algo tuyo."
        ],
        highlight: "Felicitaciones por tu ascenso, Milagros.",
        footnote: "Espero que sea el comienzo de muchas cosas buenas para ti."
      }
    }
  ],

  // 2. ESPACIOS VACÍOS / POR FLORECER (Representan que apenas están empezando a conocerse)
  emptyPlots: [
    {
      id: "plot-1",
      position3D: { x: -2.6, y: 0.2, z: -3.2 },
      phrases: [
        "Aquí todavía falta una historia.",
        "Este espacio espera un nuevo momento.",
        "Apenas estamos comenzando a escribir los primeros recuerdos."
      ]
    },
    {
      id: "plot-2",
      position3D: { x: 2.8, y: 0.2, z: -3.4 },
      phrases: [
        "Algunas flores todavía no tienen nombre.",
        "Un espacio reservado para futuras risas o anécdotas compartidas."
      ]
    },
    {
      id: "plot-3",
      position3D: { x: -1.4, y: 0.2, z: -6.2 },
      phrases: [
        "Este rincón crecerá a su propio tiempo.",
        "Las mejores cosas se construyen sin prisa y con calma."
      ]
    }
  ],

  // 3. LA BANCA DE LOS MENSAJES ("Para cuando quieras detenerte un momento")
  bench: {
    title: "Para cuando quieras detenerte un momento",
    subtitle: "Tres notas para leer con calma.",
    position3D: { x: 3.0, y: 0.5, z: -1.6 },
    notes: [
      {
        id: 1,
        content: "Me alegró que quisieras compartir conmigo una noticia tan importante."
      },
      {
        id: 2,
        content: "Espero seguir descubriendo poco a poco las cosas que te hacen sonreír."
      },
      {
        id: 3,
        content: "Las mejores personas no se conocen de golpe. Se van descubriendo."
      }
    ]
  },

  // 4. FUENTE DE LOS PEQUEÑOS DETALLES (Estanque de agua serena)
  fountain: {
    title: "Fuente de los pequeños detalles",
    subtitle: "Toca el agua para descubrir un pensamiento.",
    position3D: { x: -3.2, y: 0.35, z: -1.4 },
    thoughts: [
      "A veces los logros más valiosos son aquellos que se consiguen con constancia silenciosa.",
      "Prestar atención a los detalles es una forma sincera de demostrar que alguien te importa.",
      "Cada persona tiene su propio ritmo y su propia luz; vale la pena tomarse el tiempo de apreciarlas.",
      "Un día normal puede convertirse en un buen día con una buena noticia.",
      "Hay conversaciones que, sin proponérselo, dejan una sensación de calma que dura horas.",
      "Celebrar a quienes hacen las cosas bien siempre es un buen plan."
    ]
  },

  // 5. GALERÍA DE MOMENTOS (Preparada para futuras fotos reales)
  gallery: {
    title: "Galería de momentos",
    emptyState: {
      paragraphs: [
        "Todavía no hay muchas fotografías aquí.",
        "Y quizás eso sea justamente lo bonito.",
        "Hay momentos que todavía no han sucedido."
      ]
    },
    moments: []
  },

  // 6. ALGO NUEVO PARA TI (Farol especial con sorpresa)
  newDetailSurprise: {
    hasNewSurprise: false,
    lampPosition3D: { x: -0.5, y: 1.3, z: -4.5 },
    title: "Algo nuevo para ti",
    notificationText: "Hay una pequeña luz encendida en el jardín.",
    surpriseCard: {
      badge: "Nuevo detalle",
      title: "Un detalle pensado para hoy",
      date: "Hoy",
      message: "Un mensaje especial o enlace a una sorpresa preparada para Milagros.",
      actionButton: {
        enabled: false,
        text: "Ver sorpresa",
        url: ""
      }
    }
  },

  // 7. CAMINO SECRETO (Sendero secundario preparado para el futuro)
  secretPath: {
    unlocked: false,
    position3D: { x: 1.6, y: 0.45, z: -7.8 },
    closedMessage: {
      title: "Un camino que descansa",
      text: "Aún no es momento de abrir este camino.",
      subtext: "Hay rincones del jardín que esperan a que tengamos más historias que contar."
    },
    unlockedMessage: {
      title: "Un rincón reservado",
      text: "El tiempo ha pasado y este sendero ahora tiene algo que mostrarte.",
      linkText: "Descubrir",
      linkUrl: "#"
    }
  }
};
