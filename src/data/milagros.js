/**
 * ==============================================================================
 * UN JARDÍN PARA MILAGROS - ARCHIVO CENTRAL DE DATOS Y CONTENIDOS
 * ==============================================================================
 * 
 * Dedicatoria romántica, elegante, sincera y respetuosa para Milagros.
 * Transmite interés genuino, curiosidad y calma para conocerla poco a poco.
 */

export const gardenData = {
  // Dedicatoria y portada inicial
  dedication: {
    recipient: "Milagros",
    subtitle: "Hay personas que llegan sin avisar y despiertan ganas de conocerlas un poco más.",
    discreet: "Este pequeño espacio nació de esa curiosidad.",
    enterButtonText: "Entrar al jardín",
    initialTourSubtitles: [
      {
        text: "Hay personas que generan curiosidad desde las primeras conversaciones.",
        duration: 3400,
        delay: 400
      }
    ]
  },

  // 1. FLORES Y SECCIONES PRINCIPALES
  flowers: [
    {
      id: "conociendote",
      title: "Hay algo bonito en empezar a conocerte",
      subtitle: "Un comienzo tranquilo",
      date: "Septiembre 2024",
      type: "dedication",
      flowerColor: "champagne",
      isPrimary: true,
      position3D: { x: 0, y: 0.65, z: -1.2 },
      card: {
        title: "Hay algo bonito en empezar a conocerte",
        paragraphs: [
          "No sé todavía todas las cosas que te hacen sonreír, qué momentos guardas con más cariño ni cuáles son esos pequeños detalles capaces de mejorar tu día.",
          "Y quizás eso sea precisamente lo bonito: todavía tengo muchas cosas por descubrir de ti.",
          "Hay algo en tu manera de ser, en nuestras conversaciones y en esos pequeños detalles que he podido conocer, que despertó en mí las ganas de seguir descubriendo un poco más de ti.",
          "No quiero apresurar nada. Prefiero que las cosas bonitas tengan su propio tiempo."
        ],
        highlight: "Me alegra haberte conocido, Milagros.",
        highlightSub: "Y me gusta pensar que esto apenas comienza a escribirse.",
        footnote: "Un rincón sencillo, hecho con calma y respeto para ti."
      }
    },
    {
      id: "belleza-tranquila",
      title: "Hay bellezas que se descubren despacio",
      subtitle: "Lo que no se ve a primera vista",
      date: "Presente",
      type: "reflection",
      flowerColor: "rose",
      isPrimary: false,
      position3D: { x: -1.8, y: 0.55, z: -2.2 },
      card: {
        title: "Hay bellezas que se descubren despacio",
        paragraphs: [
          "Claro que hay algo bonito en una sonrisa, una mirada o una forma especial de expresarse.",
          "Pero creo que lo verdaderamente interesante aparece después.",
          "En la manera de hablar.\nEn cómo alguien trata a los demás.\nEn las cosas que le hacen ilusión.\nEn los pequeños gestos que quizá pasan desapercibidos.",
          "Esas son las cosas que me gustaría ir descubriendo de ti."
        ],
        highlight: "La belleza más bonita es la que se descubre con el tiempo.",
        highlightSub: "En cada pequeño detalle.",
        footnote: "Con calma y sin prisa."
      }
    },
    {
      id: "recuerdo-ascenso",
      title: "Un paso importante",
      subtitle: "Un logro especial",
      date: "Septiembre 2024",
      type: "memory",
      flowerColor: "gold",
      isPrimary: false,
      position3D: { x: 1.8, y: 0.55, z: -2.4 },
      card: {
        title: "Un paso importante",
        paragraphs: [
          "Cuando me contaste sobre tu ascenso en el trabajo, me dio mucha alegría escucharte.",
          "Sé que detrás de cada logro hay esfuerzo, responsabilidad y dedicación, y me pareció un bonito detalle recordar aquí ese paso que diste."
        ],
        highlight: "Un momento para recordar y celebrar.",
        highlightSub: "Uno de los primeros recuerdos compartidos.",
        footnote: "Celebrar a quienes hacen las cosas bien siempre es un buen plan."
      }
    }
  ],

  // 2. ESPACIOS VACÍOS / POR FLORECER ("Momentos que todavía no existen")
  emptyPlots: [
    {
      id: "plot-1",
      title: "Momentos que todavía no existen",
      position3D: { x: -2.6, y: 0.2, z: -3.2 },
      phrases: [
        "Este espacio está casi vacío.",
        "Y me gusta que sea así.",
        "Significa que todavía quedan conversaciones, lugares, fotografías y pequeños momentos que podrían algún día llegar hasta aquí.",
        "No quiero inventar recuerdos antes de vivirlos.",
        "Prefiero dejarles un lugar por si algún día llegan."
      ]
    },
    {
      id: "plot-2",
      title: "Momentos que todavía no existen",
      position3D: { x: 2.8, y: 0.2, z: -3.4 },
      phrases: [
        "Este espacio está casi vacío.",
        "Y me gusta que sea así.",
        "Significa que todavía quedan conversaciones, lugares, fotografías y pequeños momentos que podrían algún día llegar hasta aquí.",
        "No quiero inventar recuerdos antes de vivirlos.",
        "Prefiero dejarles un lugar por si algún día llegan."
      ]
    },
    {
      id: "plot-3",
      title: "Momentos que todavía no existen",
      position3D: { x: -1.4, y: 0.2, z: -6.2 },
      phrases: [
        "Este espacio está casi vacío.",
        "Y me gusta que sea así.",
        "Significa que todavía quedan conversaciones, lugares, fotografías y pequeños momentos que podrían algún día llegar hasta aquí.",
        "No quiero inventar recuerdos antes de vivirlos.",
        "Prefiero dejarles un lugar por si algún día llegan."
      ]
    }
  ],

  // 3. LA BANCA DE LAS NOTAS ("Para cuando quieras detenerte un momento")
  bench: {
    title: "Para cuando quieras detenerte un momento",
    subtitle: "Cinco pensamientos para leer con calma.",
    position3D: { x: 3.0, y: 0.5, z: -1.6 },
    notes: [
      {
        id: 1,
        content: "Hay personas que generan curiosidad desde las primeras conversaciones."
      },
      {
        id: 2,
        content: "No quiero conocerte deprisa. Prefiero descubrirte con calma."
      },
      {
        id: 3,
        content: "Las pequeñas cosas suelen decir mucho más que las grandes palabras."
      },
      {
        id: 4,
        content: "Todavía sé poco de ti, pero me gusta lo que voy descubriendo."
      },
      {
        id: 5,
        content: "Quizás los mejores recuerdos empiezan simplemente con una buena conversación."
      }
    ]
  },

  // 4. FUENTE DE LOS PEQUEÑOS DETALLES
  fountain: {
    title: "Fuente de los pequeños detalles",
    subtitle: "Toca el agua y deja que aparezca un pensamiento.",
    position3D: { x: -3.2, y: 0.35, z: -1.4 },
    thoughts: [
      "Las historias más bonitas normalmente empiezan sin saber cómo terminarán.",
      "Hay conversaciones que uno recuerda sin saber exactamente por qué.",
      "Los detalles pequeños suelen ser los que más se quedan en el alma.",
      "A veces una persona simplemente despierta ganas de descubrir todo su mundo.",
      "Conocer a alguien también significa aprender a contemplar con el corazón.",
      "Hay miradas que transmiten calma incluso en medio del ruido.",
      "Las cosas más bellas de la vida florecen con calma y sinceridad."
    ]
  },

  // 5. GALERÍA DE MOMENTOS
  gallery: {
    title: "Galería de momentos",
    emptyState: {
      title: "Galería de momentos",
      subtitle: "Todo álbum comienza antes de tener su primera fotografía.",
      description: "Por ahora, este espacio simplemente espera."
    },
    moments: []
  },

  // 6. SECCIÓN FINAL / CIERRE ESPECIAL
  finalLetter: {
    title: "Ecos del corazón",
    subtitle: "Un verso para ti",
    paragraphs: [
      "Dicen que el destino escribe con luz de estrellas las historias más hermosas, y desde que coincidimos, cada uno de tus detalles se convirtió en mi poesía favorita.",
      "Hay una magia única en tu sonrisa y una dulzura infinita en tu forma de ser, de esas que acarician el alma y convierten cualquier instante en un recuerdo inolvidable.",
      "No hacen falta infinitas palabras cuando el sentimiento nace con tanta pureza; solo me basta contemplar tu alegría para saber que el mundo es infinitamente más bello porque tú estás en él."
    ],
    highlight: "Milagros, eres esa melodía perfecta que hace florecer los latidos de mi corazón.",
    signOff: "Con todo mi corazón, para Milagros"
  },

  // 7. ALGO NUEVO PARA TI (Farol especial)
  newDetailSurprise: {
    hasNewSurprise: false,
    lampPosition3D: { x: -0.5, y: 1.3, z: -4.5 },
    title: "Algo nuevo para ti",
    notificationText: "Hay una pequeña luz encendida en el jardín.",
    surpriseCard: {
      badge: "Nuevo detalle",
      title: "Un detalle pensado para hoy",
      date: "Hoy",
      message: "Un mensaje especial preparado con calma para Milagros.",
      actionButton: {
        enabled: false,
        text: "Ver sorpresa",
        url: ""
      }
    }
  },

  // 8. CAMINO SECRETO (Sendero secundario)
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
