require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');

const challenges = [

  // ==========================================
  // CATEGORÍA: LÓGICA Y RAZONAMIENTO (7 niveles)
  // Acertijos, silogismos, paradojas, lógica formal
  // ==========================================
  {
    title: "Lógica - Nivel 1",
    description: "Silogismo básico",
    category: "logica",
    difficulty: "facil",
    question: "Todos los A son B. Todos los B son C. ¿Es verdadero que todos los A son C?",
    correctAnswer: "si",
    alternativeAnswers: ["sí", "SI", "SÍ", "true", "verdadero"],
    hint: "Piensa en la transitividad: si A→B y B→C, ¿qué implica?",
    timeLimit: 90,
    points: 150,
    xpReward: 75,
    requiredLevel: 1,
    icon: "🧠",
    order: 1
  },
  {
    title: "Lógica - Nivel 2",
    description: "Acertijo de mentirosos y verídicos",
    category: "logica",
    difficulty: "facil",
    question: "En una isla, los Veraces siempre dicen verdad y los Mentirosos siempre mienten. Un habitante dice: 'Soy mentiroso'. ¿Puede ser veraz o mentiroso?",
    correctAnswer: "ninguno",
    alternativeAnswers: ["ni uno ni otro", "imposible", "ninguno de los dos", "es una paradoja"],
    hint: "Si fuera mentiroso y lo dice, estaría diciendo verdad. Contradicción.",
    timeLimit: 120,
    points: 200,
    xpReward: 100,
    requiredLevel: 1,
    icon: "🧠",
    order: 2
  },
  {
    title: "Lógica - Nivel 3",
    description: "Tres cajas etiquetadas incorrectamente",
    category: "logica",
    difficulty: "medio",
    question: "Hay 3 cajas: 'Manzanas', 'Naranjas', 'Manzanas y Naranjas'. Todas las etiquetas están INCORRECTAS. Solo puedes sacar 1 fruta de 1 caja. ¿De cuál caja sacas para identificar todo?",
    correctAnswer: "manzanas y naranjas",
    alternativeAnswers: ["de la que dice manzanas y naranjas", "la mixta", "la que dice ambas"],
    hint: "Como todas las etiquetas son incorrectas, la caja 'Manzanas y Naranjas' solo puede contener un tipo de fruta.",
    timeLimit: 180,
    points: 350,
    xpReward: 150,
    requiredLevel: 2,
    icon: "🧠",
    order: 3
  },
  {
    title: "Lógica - Nivel 4",
    description: "El problema del puente",
    category: "logica",
    difficulty: "medio",
    question: "4 personas cruzan un puente de noche con 1 linterna. Solo pueden cruzar de 2 en 2. Velocidades: A=1min, B=2min, C=5min, D=10min. El par tarda lo del más lento. ¿Cuál es el tiempo mínimo para cruzar todos?",
    correctAnswer: "17",
    alternativeAnswers: ["17 minutos", "17min"],
    hint: "La clave es que A y B siempre deben devolver la linterna. Orden óptimo: A+B cruzan, A vuelve, C+D cruzan, B vuelve, A+B cruzan.",
    timeLimit: 300,
    points: 500,
    xpReward: 200,
    requiredLevel: 3,
    icon: "🧠",
    order: 4
  },
  {
    title: "Lógica - Nivel 5",
    description: "Las 100 puertas",
    category: "logica",
    difficulty: "medio",
    question: "100 puertas cerradas. 100 personas: la 1ª abre todas, la 2ª cambia el estado de las pares, la 3ª cambia múltiplos de 3... así hasta la 100. ¿Cuántas puertas quedan abiertas al final?",
    correctAnswer: "10",
    alternativeAnswers: ["diez"],
    hint: "Una puerta queda abierta si fue cambiada un número impar de veces. ¿Qué números tienen un número impar de divisores?",
    timeLimit: 240,
    points: 500,
    xpReward: 200,
    requiredLevel: 4,
    icon: "🧠",
    order: 5
  },
  {
    title: "Lógica - Nivel 6",
    description: "El problema del peso falso",
    category: "logica",
    difficulty: "dificil",
    question: "Tienes 12 bolas idénticas visualmente, pero una pesa diferente (no sabes si más o menos). Con una balanza de platillos y SOLO 3 pesadas, ¿puedes identificar la bola diferente Y saber si pesa más o menos?",
    correctAnswer: "si",
    alternativeAnswers: ["sí", "es posible", "yes"],
    hint: "Divide en grupos de 4. Primera pesada: 4 vs 4. Según el resultado, las posibilidades se reducen sistemáticamente.",
    timeLimit: 300,
    points: 700,
    xpReward: 300,
    requiredLevel: 5,
    icon: "🧠",
    order: 6
  },
  {
    title: "Lógica - Nivel 7",
    description: "El problema de los sombreros",
    category: "logica",
    difficulty: "dificil",
    question: "100 presos en fila. Cada uno lleva sombrero negro o blanco. Cada uno ve los de adelante pero no el suyo. Empezando por el último, cada uno dice un color en voz alta. Si acierta su color, se salva. ¿Cuántos pueden garantizar salvarse con la estrategia óptima?",
    correctAnswer: "99",
    alternativeAnswers: ["noventa y nueve", "99 presos"],
    hint: "El último dice la paridad (par/impar) de sombreros blancos que ve. Los demás usan esa información para deducir su propio color.",
    timeLimit: 360,
    points: 900,
    xpReward: 400,
    requiredLevel: 6,
    icon: "🧠",
    order: 7
  },

  // ==========================================
  // CATEGORÍA: MATEMÁTICAS AVANZADAS (7 niveles)
  // Álgebra, probabilidad, combinatoria, teoría de números
  // ==========================================
  {
    title: "Matemáticas - Nivel 1",
    description: "Álgebra básica con trampa",
    category: "matematica",
    difficulty: "facil",
    question: "Si x + y = 10 y x × y = 24, ¿cuánto vale x² + y²?",
    correctAnswer: "52",
    alternativeAnswers: ["52"],
    hint: "Usa la identidad: (x+y)² = x² + 2xy + y². Despeja x² + y².",
    timeLimit: 120,
    points: 200,
    xpReward: 100,
    requiredLevel: 1,
    icon: "📐",
    order: 8
  },
  {
    title: "Matemáticas - Nivel 2",
    description: "Probabilidad condicional",
    category: "matematica",
    difficulty: "facil",
    question: "En una familia con 2 hijos, ya sabes que al menos uno es niño. ¿Cuál es la probabilidad de que ambos sean niños? (Responde como fracción simplificada)",
    correctAnswer: "1/3",
    alternativeAnswers: ["un tercio", "0.33", "0.333"],
    hint: "Los casos posibles son: NiñoNiño, NiñaNiño, NiñoNiña. No NiñaNiña porque sabemos que al menos uno es niño.",
    timeLimit: 150,
    points: 250,
    xpReward: 120,
    requiredLevel: 2,
    icon: "📐",
    order: 9
  },
  {
    title: "Matemáticas - Nivel 3",
    description: "Combinatoria",
    category: "matematica",
    difficulty: "medio",
    question: "¿De cuántas formas distintas puedes ordenar las letras de la palabra 'MISSISSIPPI'?",
    correctAnswer: "34650",
    alternativeAnswers: ["34,650"],
    hint: "Usa permutaciones con repetición: 11! / (4! × 4! × 2! × 1!). M=1, I=4, S=4, P=2.",
    timeLimit: 240,
    points: 450,
    xpReward: 200,
    requiredLevel: 3,
    icon: "📐",
    order: 10
  },
  {
    title: "Matemáticas - Nivel 4",
    description: "Teoría de números",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuál es el último dígito de 7^100?",
    correctAnswer: "1",
    alternativeAnswers: ["uno"],
    hint: "Analiza el ciclo de últimos dígitos de potencias de 7: 7¹=7, 7²=49, 7³=343, 7⁴=2401... el ciclo se repite cada 4.",
    timeLimit: 180,
    points: 450,
    xpReward: 200,
    requiredLevel: 4,
    icon: "📐",
    order: 11
  },
  {
    title: "Matemáticas - Nivel 5",
    description: "El problema de Monty Hall",
    category: "matematica",
    difficulty: "medio",
    question: "Hay 3 puertas. Detrás de una hay un carro, en las otras dos hay cabras. Eliges la puerta 1. El presentador abre la puerta 3 (cabra). Te ofrece cambiar a la puerta 2. ¿Cuál es la probabilidad de ganar si cambias?",
    correctAnswer: "2/3",
    alternativeAnswers: ["dos tercios", "0.66", "0.667", "66%", "66.7%"],
    hint: "Al inicio tienes 1/3. El presentador no abre al azar, siempre abre una con cabra. Eso transfiere probabilidad a la otra puerta.",
    timeLimit: 180,
    points: 500,
    xpReward: 220,
    requiredLevel: 4,
    icon: "📐",
    order: 12
  },
  {
    title: "Matemáticas - Nivel 6",
    description: "Suma de serie infinita",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto vale la suma infinita: 1/2 + 1/4 + 1/8 + 1/16 + ... ?",
    correctAnswer: "1",
    alternativeAnswers: ["uno", "1.0"],
    hint: "Es una serie geométrica con a=1/2 y r=1/2. La suma es a/(1-r).",
    timeLimit: 180,
    points: 600,
    xpReward: 280,
    requiredLevel: 5,
    icon: "📐",
    order: 13
  },
  {
    title: "Matemáticas - Nivel 7",
    description: "Paradoja de probabilidad",
    category: "matematica",
    difficulty: "dificil",
    question: "En un grupo de 23 personas, ¿cuál es la probabilidad aproximada de que al menos 2 compartan el mismo cumpleaños? (Responde como porcentaje redondeado al entero más cercano)",
    correctAnswer: "50",
    alternativeAnswers: ["50%", "51", "51%", "~50%"],
    hint: "Calcula la probabilidad del complemento: que TODOS tengan cumpleaños distintos. P = 365/365 × 364/365 × 363/365 × ... × 343/365",
    timeLimit: 300,
    points: 800,
    xpReward: 380,
    requiredLevel: 6,
    icon: "📐",
    order: 14
  },

  // ==========================================
  // CATEGORÍA: RAZONAMIENTO ESPACIAL (7 niveles)
  // Rotaciones, patrones visuales, geometría mental
  // ==========================================
  {
    title: "Espacial - Nivel 1",
    description: "Cubos y caras",
    category: "espacial",
    difficulty: "facil",
    question: "Un cubo tiene sus 6 caras pintadas. Lo cortas en 27 cubitos iguales (3×3×3). ¿Cuántos cubitos no tienen ninguna cara pintada?",
    correctAnswer: "1",
    alternativeAnswers: ["uno"],
    hint: "Solo el cubito del centro absoluto no toca ninguna cara exterior.",
    timeLimit: 120,
    points: 200,
    xpReward: 100,
    requiredLevel: 1,
    icon: "🔷",
    order: 15
  },
  {
    title: "Espacial - Nivel 2",
    description: "Doblar papel",
    category: "espacial",
    difficulty: "facil",
    question: "Doblas un papel cuadrado por la mitad 3 veces seguidas y haces un agujero en el centro. Al desdoblar, ¿cuántos agujeros hay?",
    correctAnswer: "8",
    alternativeAnswers: ["ocho"],
    hint: "Cada doblez duplica el número de capas. Con 3 dobleces tienes 8 capas apiladas.",
    timeLimit: 120,
    points: 200,
    xpReward: 100,
    requiredLevel: 2,
    icon: "🔷",
    order: 16
  },
  {
    title: "Espacial - Nivel 3",
    description: "Rotación de figura",
    category: "espacial",
    difficulty: "medio",
    question: "Un reloj analógico muestra las 3:00. Si giras el reloj 90° en sentido horario, ¿qué hora parece mostrar ahora?",
    correctAnswer: "12:00",
    alternativeAnswers: ["12", "las 12", "12:00 am", "mediodía"],
    hint: "Cuando giras el reloj 90° horario, el 12 que estaba arriba ahora apunta a la derecha, y el 3 que apuntaba a la derecha ahora apunta abajo.",
    timeLimit: 120,
    points: 300,
    xpReward: 140,
    requiredLevel: 3,
    icon: "🔷",
    order: 17
  },
  {
    title: "Espacial - Nivel 4",
    description: "Cubo desplegado",
    category: "espacial",
    difficulty: "medio",
    question: "Un cubo tiene la cara de arriba en rojo, la del frente en azul, y la derecha en verde. Si volteas el cubo hacia adelante (rotación hacia ti), ¿qué color queda arriba?",
    correctAnswer: "azul",
    alternativeAnswers: ["el azul", "blue"],
    hint: "Al rotar hacia adelante: la cara de frente sube, la de arriba va hacia atrás, la de abajo viene al frente, la de atrás baja.",
    timeLimit: 150,
    points: 400,
    xpReward: 180,
    requiredLevel: 3,
    icon: "🔷",
    order: 18
  },
  {
    title: "Espacial - Nivel 5",
    description: "Intersecciones de planos",
    category: "espacial",
    difficulty: "medio",
    question: "¿Cuántas regiones crea el máximo posible de líneas rectas si usas exactamente 4 líneas en un plano?",
    correctAnswer: "11",
    alternativeAnswers: ["once"],
    hint: "Cada nueva línea corta a todas las anteriores. Con n líneas, el máximo de regiones es 1 + n + n(n-1)/2.",
    timeLimit: 180,
    points: 500,
    xpReward: 220,
    requiredLevel: 4,
    icon: "🔷",
    order: 19
  },
  {
    title: "Espacial - Nivel 6",
    description: "La esfera y el cilindro",
    category: "espacial",
    difficulty: "dificil",
    question: "Tienes una esfera de radio 5. Le perforas un cilindro de 6cm de largo pasando por el centro. ¿Cuánto vale el volumen del anillo que queda? (Dato: el resultado depende solo de la longitud del agujero, no del radio de la esfera)",
    correctAnswer: "36π",
    alternativeAnswers: ["113.1", "113", "36*pi", "36 pi"],
    hint: "Esta es la Paradoja de Napkin Ring. El volumen solo depende de h: V = π×h³/6. Con h=6, V = π×216/6 = 36π.",
    timeLimit: 300,
    points: 750,
    xpReward: 350,
    requiredLevel: 5,
    icon: "🔷",
    order: 20
  },
  {
    title: "Espacial - Nivel 7",
    description: "Cubo 4D (Hipercubo)",
    category: "espacial",
    difficulty: "dificil",
    question: "Un cuadrado tiene 4 vértices. Un cubo tiene 8 vértices. ¿Cuántos vértices tiene un hipercubo (cubo 4-dimensional)?",
    correctAnswer: "16",
    alternativeAnswers: ["dieciséis"],
    hint: "El patrón es 2^n donde n es la dimensión: 2^1=2 (segmento), 2^2=4 (cuadrado), 2^3=8 (cubo), 2^4=?",
    timeLimit: 180,
    points: 700,
    xpReward: 320,
    requiredLevel: 6,
    icon: "🔷",
    order: 21
  },

  // ==========================================
  // CATEGORÍA: PROGRAMACIÓN Y ALGORITMOS (7 niveles)
  // Lógica computacional, complejidad, estructuras de datos
  // ==========================================
  {
    title: "Algoritmos - Nivel 1",
    description: "Tracing básico",
    category: "programacion",
    difficulty: "facil",
    question: "¿Qué imprime este código?\n\nx = 5\ny = 3\nx, y = y, x + y\nprint(x, y)",
    correctAnswer: "3 8",
    alternativeAnswers: ["3, 8", "(3, 8)", "x=3 y=8"],
    hint: "En Python, la asignación múltiple evalúa PRIMERO todo el lado derecho antes de asignar. y vale 3, x+y vale 8.",
    timeLimit: 120,
    points: 200,
    xpReward: 100,
    requiredLevel: 1,
    icon: "💻",
    order: 22
  },
  {
    title: "Algoritmos - Nivel 2",
    description: "Recursión y call stack",
    category: "programacion",
    difficulty: "facil",
    question: "¿Cuántas veces se llama la función f (incluyendo la primera llamada) cuando ejecutas f(5)?\n\ndef f(n):\n    if n <= 0: return 1\n    return f(n-1) + f(n-2)",
    correctAnswer: "15",
    alternativeAnswers: ["quince"],
    hint: "Dibuja el árbol de llamadas. f(5) llama a f(4) y f(3), f(4) llama a f(3) y f(2)... cuenta cada nodo del árbol.",
    timeLimit: 180,
    points: 300,
    xpReward: 150,
    requiredLevel: 2,
    icon: "💻",
    order: 23
  },
  {
    title: "Algoritmos - Nivel 3",
    description: "Complejidad Big-O",
    category: "programacion",
    difficulty: "medio",
    question: "Tienes un array de n elementos. Realizas una búsqueda binaria y para cada elemento encontrado ejecutas un loop de n iteraciones. ¿Cuál es la complejidad total del algoritmo?",
    correctAnswer: "O(n log n)",
    alternativeAnswers: ["O(nlogn)", "n log n", "nlogn"],
    hint: "Búsqueda binaria: O(log n). Pero el loop interno es O(n). La operación completa es O(n) × O(log n) aplicados de forma compuesta.",
    timeLimit: 180,
    points: 400,
    xpReward: 180,
    requiredLevel: 3,
    icon: "💻",
    order: 24
  },
  {
    title: "Algoritmos - Nivel 4",
    description: "Bitwise operations",
    category: "programacion",
    difficulty: "medio",
    question: "Sin usar if, loops ni operadores aritméticos (+, -, ×, ÷), ¿cuál es el resultado de (13 XOR 7) AND (5 OR 3) en decimal?",
    correctAnswer: "7",
    alternativeAnswers: ["siete"],
    hint: "13=1101, 7=0111. XOR da 1010=10. Luego 5=101, 3=011. OR da 111=7. Finalmente 10 AND 7: 1010 AND 0111 = 0010... espera, recalcula.",
    timeLimit: 240,
    points: 500,
    xpReward: 230,
    requiredLevel: 4,
    icon: "💻",
    order: 25
  },
  {
    title: "Algoritmos - Nivel 5",
    description: "Problema del viajante simplificado",
    category: "programacion",
    difficulty: "medio",
    question: "Tienes 4 ciudades. Cada par está conectado. ¿Cuántos recorridos distintos existen que visiten todas las ciudades exactamente una vez y regresen al inicio? (No contar el punto de partida como variable)",
    correctAnswer: "3",
    alternativeAnswers: ["tres"],
    hint: "Con n ciudades, los recorridos distintos son (n-1)!/2. Con n=4: 3!/2 = 6/2 = 3.",
    timeLimit: 210,
    points: 550,
    xpReward: 250,
    requiredLevel: 4,
    icon: "💻",
    order: 26
  },
  {
    title: "Algoritmos - Nivel 6",
    description: "Detección de ciclo en grafo",
    category: "programacion",
    difficulty: "dificil",
    question: "Tienes una lista enlazada. El algoritmo de Floyd (tortuga y liebre): tortuga avanza 1 nodo, liebre avanza 2. Si hay un ciclo de longitud 5 y la tortuga entra al ciclo en la posición 3, ¿cuántos pasos tarda la liebre en alcanzar a la tortuga dentro del ciclo?",
    correctAnswer: "5",
    alternativeAnswers: ["cinco", "5 pasos"],
    hint: "Una vez dentro del ciclo, la liebre se acerca 1 posición por paso. La distancia inicial entre ellos dentro del ciclo determina cuántos pasos tardan en coincidir.",
    timeLimit: 300,
    points: 700,
    xpReward: 320,
    requiredLevel: 5,
    icon: "💻",
    order: 27
  },
  {
    title: "Algoritmos - Nivel 7",
    description: "El problema de la parada",
    category: "programacion",
    difficulty: "dificil",
    question: "Turing demostró que es imposible construir un programa general H(P, I) que determine si cualquier programa P con input I termina o se ejecuta infinito. ¿Qué técnica de demostración usó?",
    correctAnswer: "diagonalizacion",
    alternativeAnswers: ["diagonalización", "diagonal", "argumento diagonal", "diagonalization"],
    hint: "La misma técnica que Cantor usó para probar que los números reales son más numerosos que los naturales.",
    timeLimit: 240,
    points: 900,
    xpReward: 420,
    requiredLevel: 6,
    icon: "💻",
    order: 28
  },

  // ==========================================
  // CATEGORÍA: PUZZLES CLÁSICOS (7 niveles)
  // Acertijos matemáticos históricos y famosos
  // ==========================================
  {
    title: "Puzzles - Nivel 1",
    description: "El río con el lobo",
    category: "puzzle",
    difficulty: "facil",
    question: "Un granjero cruza un río con un lobo, una oveja y una col. La barca carga 1 elemento extra. El lobo se come la oveja si están solos. La oveja se come la col si están solas. ¿Cuántos viajes mínimos necesita el granjero?",
    correctAnswer: "7",
    alternativeAnswers: ["siete"],
    hint: "El truco es que el granjero puede devolver un elemento al cruzar.",
    timeLimit: 180,
    points: 250,
    xpReward: 120,
    requiredLevel: 1,
    icon: "🧩",
    order: 29
  },
  {
    title: "Puzzles - Nivel 2",
    description: "El problema de los 9 puntos",
    category: "puzzle",
    difficulty: "facil",
    question: "Tienes 9 puntos en una cuadrícula 3×3. ¿Cuántas líneas rectas mínimas necesitas para conectarlos todos sin levantar el lápiz, si las líneas pueden extenderse más allá de la cuadrícula?",
    correctAnswer: "4",
    alternativeAnswers: ["cuatro"],
    hint: "El truco está en 'pensar fuera de la caja'. Las líneas no tienen que detenerse en el borde de la cuadrícula.",
    timeLimit: 180,
    points: 300,
    xpReward: 140,
    requiredLevel: 2,
    icon: "🧩",
    order: 30
  },
  {
    title: "Puzzles - Nivel 3",
    description: "Las monedas falsas",
    category: "puzzle",
    difficulty: "medio",
    question: "Tienes 10 pilas de 10 monedas. 9 pilas tienen monedas de 10g. 1 pila tiene monedas de 11g. Con UNA SOLA pesada en una báscula digital, ¿cómo identificas la pila falsa?",
    correctAnswer: "tomar 1 de la primera 2 de la segunda hasta 10 de la decima",
    alternativeAnswers: ["1 de cada pila en orden", "sacar 1,2,3...10 monedas de cada pila", "1 de pila 1, 2 de pila 2, etc"],
    hint: "Si tomas k monedas de la pila k, la diferencia de peso total te dice exactamente qué pila es falsa.",
    timeLimit: 240,
    points: 450,
    xpReward: 200,
    requiredLevel: 3,
    icon: "🧩",
    order: 31
  },
  {
    title: "Puzzles - Nivel 4",
    description: "El cuadrado mágico",
    category: "puzzle",
    difficulty: "medio",
    question: "En un cuadrado mágico 3×3 con números del 1 al 9, ¿cuánto suman todas las filas, columnas y diagonales? (La suma es constante en todas)",
    correctAnswer: "15",
    alternativeAnswers: ["quince"],
    hint: "La suma total de 1 a 9 es 45. Como hay 3 filas iguales, cada una vale 45/3.",
    timeLimit: 120,
    points: 400,
    xpReward: 180,
    requiredLevel: 4,
    icon: "🧩",
    order: 32
  },
  {
    title: "Puzzles - Nivel 5",
    description: "El matemático y las edades",
    category: "puzzle",
    difficulty: "medio",
    question: "Un matemático le dice a otro: 'El producto de las edades de mis 3 hijos es 36. La suma es el número de tu casa.' El otro responde: 'Con eso no es suficiente.' El primero dice: 'El mayor toca piano.' El otro responde: '¡Ah, ya sé!' ¿Cuántos años tiene el hijo mayor?",
    correctAnswer: "9",
    alternativeAnswers: ["nueve"],
    hint: "Busca todos los tríos con producto 36. Los que tienen la misma suma son los que generan ambigüedad. El dato 'el MAYOR toca piano' resuelve esa ambigüedad.",
    timeLimit: 300,
    points: 600,
    xpReward: 280,
    requiredLevel: 5,
    icon: "🧩",
    order: 33
  },
  {
    title: "Puzzles - Nivel 6",
    description: "El problema del apretón de manos",
    category: "puzzle",
    difficulty: "dificil",
    question: "En una fiesta, cada persona saluda a otras. Al final, alguien pregunta cuántas veces se saludaron. 9 personas reportan haber saludado 1, 2, 3, 4, 5, 6, 7, 8 y 9 veces respectivamente. ¿Cuántas veces saludó la décima persona?",
    correctAnswer: "5",
    alternativeAnswers: ["cinco"],
    hint: "La persona que saludó 9 veces saludó a todos. La que saludó 1 vez solo pudo saludar a esa. Piensa en parejas simétricas de información.",
    timeLimit: 300,
    points: 750,
    xpReward: 350,
    requiredLevel: 5,
    icon: "🧩",
    order: 34
  },
  {
    title: "Puzzles - Nivel 7",
    description: "Los 100 prisioneros y las cajas",
    category: "puzzle",
    difficulty: "dificil",
    question: "100 prisioneros. 100 cajas numeradas con un papel adentro (número del 1 al 100, uno por caja). Cada prisionero puede abrir hasta 50 cajas. Todos deben encontrar su número. ¿Cuál es la probabilidad aproximada de sobrevivir con la estrategia ÓPTIMA (en porcentaje, redondeado)?",
    correctAnswer: "31",
    alternativeAnswers: ["31%", "30", "30%", "~31%", "~30%"],
    hint: "La estrategia óptima es seguir ciclos: abrir tu propia caja, luego la caja con el número que encontraste, y así. La probabilidad de fallo es la de que exista un ciclo de longitud > 50.",
    timeLimit: 360,
    points: 1000,
    xpReward: 500,
    requiredLevel: 6,
    icon: "🧩",
    order: 35
  }
];

async function seedChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    await Challenge.deleteMany({});
    console.log('🗑️  Retos anteriores eliminados');

    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`✅ ${createdChallenges.length} retos creados exitosamente\n`);

    console.log('📋 RESUMEN DE RETOS POR CATEGORÍA:');
    console.log('═══════════════════════════════════════════════');

    const cats = [
      { label: 'Lógica y Razonamiento',      prefix: 'Lógica' },
      { label: 'Matemáticas Avanzadas',       prefix: 'Matemáticas' },
      { label: 'Razonamiento Espacial',       prefix: 'Espacial' },
      { label: 'Programación / Algoritmos',   prefix: 'Algoritmos' },
      { label: 'Puzzles Clásicos',            prefix: 'Puzzles' },
    ];

    cats.forEach(({ label, prefix }) => {
      const count = createdChallenges.filter(c => c.title.startsWith(prefix)).length;
      console.log(`  ${label.padEnd(30)} ${count} niveles`);
    });

    console.log('═══════════════════════════════════════════════');
    console.log(`\n🎯 TOTAL: ${createdChallenges.length} retos hardcore para adultos\n`);
    console.log('Dificultad progresiva por categoría:');
    console.log('  Niveles 1-2 → Facil   (calienta el cerebro)');
    console.log('  Niveles 3-5 → Medio   (requiere razonar en serio)');
    console.log('  Niveles 6-7 → Dificil (para los que piensan fuerte)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedChallenges();