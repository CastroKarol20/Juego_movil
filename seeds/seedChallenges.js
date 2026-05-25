require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');

const challenges = [
  // ==========================================
  // CATEGORÍA: SECUENCIAS NUMÉRICAS (7 niveles)
  // ==========================================
  {
    title: "Secuencias Numéricas - Nivel 1",
    description: "Secuencia básica - dobles",
    category: "logica",
    difficulty: "facil",
    question: "¿Cuál es el siguiente número? 2, 4, 8, 16, ___",
    correctAnswer: "32",
    alternativeAnswers: ["32"],
    hint: "Cada número es el doble del anterior",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "🔢",
    order: 1
  },
  {
    title: "Secuencias Numéricas - Nivel 2",
    description: "Secuencia de suma constante",
    category: "logica",
    difficulty: "facil",
    question: "¿Cuál es el siguiente número? 5, 10, 15, 20, ___",
    correctAnswer: "25",
    alternativeAnswers: ["25"],
    hint: "Se suma 5 cada vez",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "🔢",
    order: 2
  },
  {
    title: "Secuencias Numéricas - Nivel 3",
    description: "Secuencia con patrón alternado",
    category: "logica",
    difficulty: "medio",
    question: "¿Cuál es el siguiente número? 1, 2, 4, 8, 16, ___",
    correctAnswer: "32",
    alternativeAnswers: ["32"],
    hint: "Cada número se multiplica por 2",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 2,
    icon: "🔢",
    order: 3
  },
  {
    title: "Secuencias Numéricas - Nivel 4",
    description: "Secuencia Fibonacci simple",
    category: "logica",
    difficulty: "medio",
    question: "¿Cuál es el siguiente número? 1, 1, 2, 3, 5, 8, ___",
    correctAnswer: "13",
    alternativeAnswers: ["13"],
    hint: "Suma los dos números anteriores",
    timeLimit: 120,
    points: 250,
    xpReward: 100,
    requiredLevel: 3,
    icon: "🔢",
    order: 4
  },
  {
    title: "Secuencias Numéricas - Nivel 5",
    description: "Secuencia de cuadrados",
    category: "logica",
    difficulty: "medio",
    question: "¿Cuál es el siguiente número? 1, 4, 9, 16, 25, ___",
    correctAnswer: "36",
    alternativeAnswers: ["36"],
    hint: "Son números al cuadrado: 1², 2², 3²...",
    timeLimit: 120,
    points: 300,
    xpReward: 150,
    requiredLevel: 4,
    icon: "🔢",
    order: 5
  },
  {
    title: "Secuencias Numéricas - Nivel 6",
    description: "Secuencia con diferencias crecientes",
    category: "logica",
    difficulty: "dificil",
    question: "¿Cuál es el siguiente número? 2, 6, 12, 20, 30, ___",
    correctAnswer: "42",
    alternativeAnswers: ["42"],
    hint: "Diferencias: +4, +6, +8, +10... ¿Cuál sigue?",
    timeLimit: 180,
    points: 500,
    xpReward: 200,
    requiredLevel: 5,
    icon: "🔢",
    order: 6
  },
  {
    title: "Secuencias Numéricas - Nivel 7",
    description: "Secuencia compleja de cubos",
    category: "logica",
    difficulty: "dificil",
    question: "¿Cuál es el siguiente número? 1, 8, 27, 64, ___",
    correctAnswer: "125",
    alternativeAnswers: ["125"],
    hint: "Son números al cubo: 1³, 2³, 3³...",
    timeLimit: 180,
    points: 600,
    xpReward: 250,
    requiredLevel: 6,
    icon: "🔢",
    order: 7
  },

  // ==========================================
  // CATEGORÍA: SUMAS Y RESTAS (7 niveles)
  // ==========================================
  {
    title: "Sumas y Restas - Nivel 1",
    description: "Suma básica de dos dígitos",
    category: "matematica",
    difficulty: "facil",
    question: "¿Cuánto es 15 + 27?",
    correctAnswer: "42",
    alternativeAnswers: ["42"],
    hint: "Suma las unidades primero, luego las decenas",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "➕",
    order: 8
  },
  {
    title: "Sumas y Restas - Nivel 2",
    description: "Resta simple",
    category: "matematica",
    difficulty: "facil",
    question: "¿Cuánto es 50 - 23?",
    correctAnswer: "27",
    alternativeAnswers: ["27"],
    hint: "Resta unidades y decenas por separado",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "➖",
    order: 9
  },
  {
    title: "Sumas y Restas - Nivel 3",
    description: "Suma de tres números",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 12 + 18 + 25?",
    correctAnswer: "55",
    alternativeAnswers: ["55"],
    hint: "Suma de a pares: (12+18) + 25",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 2,
    icon: "➕",
    order: 10
  },
  {
    title: "Sumas y Restas - Nivel 4",
    description: "Operaciones combinadas",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 30 + 15 - 8?",
    correctAnswer: "37",
    alternativeAnswers: ["37"],
    hint: "Resuelve de izquierda a derecha",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 3,
    icon: "➕➖",
    order: 11
  },
  {
    title: "Sumas y Restas - Nivel 5",
    description: "Sumas con números grandes",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 157 + 268?",
    correctAnswer: "425",
    alternativeAnswers: ["425"],
    hint: "Suma columna por columna empezando por las unidades",
    timeLimit: 120,
    points: 300,
    xpReward: 150,
    requiredLevel: 4,
    icon: "➕",
    order: 12
  },
  {
    title: "Sumas y Restas - Nivel 6",
    description: "Restas con llevadas",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto es 500 - 237?",
    correctAnswer: "263",
    alternativeAnswers: ["263"],
    hint: "Necesitas pedir prestado de las centenas",
    timeLimit: 120,
    points: 500,
    xpReward: 200,
    requiredLevel: 5,
    icon: "➖",
    order: 13
  },
  {
    title: "Sumas y Restas - Nivel 7",
    description: "Operación compleja combinada",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto es 125 + 87 - 56 + 44?",
    correctAnswer: "200",
    alternativeAnswers: ["200"],
    hint: "Resuelve paso a paso de izquierda a derecha",
    timeLimit: 150,
    points: 600,
    xpReward: 250,
    requiredLevel: 6,
    icon: "➕➖",
    order: 14
  },

  // ==========================================
  // CATEGORÍA: MULTIPLICACIONES (7 niveles)
  // ==========================================
  {
    title: "Multiplicaciones - Nivel 1",
    description: "Tabla del 2",
    category: "matematica",
    difficulty: "facil",
    question: "¿Cuánto es 2 × 6?",
    correctAnswer: "12",
    alternativeAnswers: ["12"],
    hint: "Es sumar 2 seis veces",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "✖️",
    order: 15
  },
  {
    title: "Multiplicaciones - Nivel 2",
    description: "Tabla del 5",
    category: "matematica",
    difficulty: "facil",
    question: "¿Cuánto es 5 × 7?",
    correctAnswer: "35",
    alternativeAnswers: ["35"],
    hint: "Los múltiplos de 5 terminan en 0 o 5",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "✖️",
    order: 16
  },
  {
    title: "Multiplicaciones - Nivel 3",
    description: "Tabla del 7",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 7 × 8?",
    correctAnswer: "56",
    alternativeAnswers: ["56"],
    hint: "7 × 8 = 56 (es uno de los más difíciles)",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 2,
    icon: "✖️",
    order: 17
  },
  {
    title: "Multiplicaciones - Nivel 4",
    description: "Multiplicación por dos dígitos",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 12 × 8?",
    correctAnswer: "96",
    alternativeAnswers: ["96"],
    hint: "Puedes hacer (10 × 8) + (2 × 8)",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 3,
    icon: "✖️",
    order: 18
  },
  {
    title: "Multiplicaciones - Nivel 5",
    description: "Multiplicación más compleja",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 13 × 7?",
    correctAnswer: "91",
    alternativeAnswers: ["91"],
    hint: "Descompón: (10 × 7) + (3 × 7)",
    timeLimit: 120,
    points: 300,
    xpReward: 150,
    requiredLevel: 4,
    icon: "✖️",
    order: 19
  },
  {
    title: "Multiplicaciones - Nivel 6",
    description: "Multiplicación de dos dígitos",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto es 15 × 12?",
    correctAnswer: "180",
    alternativeAnswers: ["180"],
    hint: "15 × 10 = 150, luego suma 15 × 2",
    timeLimit: 150,
    points: 500,
    xpReward: 200,
    requiredLevel: 5,
    icon: "✖️",
    order: 20
  },
  {
    title: "Multiplicaciones - Nivel 7",
    description: "Multiplicación avanzada",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto es 25 × 16?",
    correctAnswer: "400",
    alternativeAnswers: ["400"],
    hint: "25 × 4 = 100, entonces 25 × 16 = 100 × 4",
    timeLimit: 180,
    points: 600,
    xpReward: 250,
    requiredLevel: 6,
    icon: "✖️",
    order: 21
  },

  // ==========================================
  // CATEGORÍA: DIVISIONES (7 niveles)
  // ==========================================
  {
    title: "Divisiones - Nivel 1",
    description: "División exacta simple",
    category: "matematica",
    difficulty: "facil",
    question: "¿Cuánto es 12 ÷ 3?",
    correctAnswer: "4",
    alternativeAnswers: ["4"],
    hint: "¿Cuántas veces cabe el 3 en 12?",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "➗",
    order: 22
  },
  {
    title: "Divisiones - Nivel 2",
    description: "División por 5",
    category: "matematica",
    difficulty: "facil",
    question: "¿Cuánto es 35 ÷ 5?",
    correctAnswer: "7",
    alternativeAnswers: ["7"],
    hint: "Piensa en la tabla del 5",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "➗",
    order: 23
  },
  {
    title: "Divisiones - Nivel 3",
    description: "División exacta media",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 56 ÷ 7?",
    correctAnswer: "8",
    alternativeAnswers: ["8"],
    hint: "Usa la tabla del 7",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 2,
    icon: "➗",
    order: 24
  },
  {
    title: "Divisiones - Nivel 4",
    description: "División de dos dígitos",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 96 ÷ 8?",
    correctAnswer: "12",
    alternativeAnswers: ["12"],
    hint: "8 × 12 = 96",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 3,
    icon: "➗",
    order: 25
  },
  {
    title: "Divisiones - Nivel 5",
    description: "División más compleja",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 144 ÷ 12?",
    correctAnswer: "12",
    alternativeAnswers: ["12"],
    hint: "12 × 12 = 144",
    timeLimit: 120,
    points: 300,
    xpReward: 150,
    requiredLevel: 4,
    icon: "➗",
    order: 26
  },
  {
    title: "Divisiones - Nivel 6",
    description: "División de números grandes",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto es 180 ÷ 15?",
    correctAnswer: "12",
    alternativeAnswers: ["12"],
    hint: "15 × 10 = 150, entonces necesitas 12",
    timeLimit: 150,
    points: 500,
    xpReward: 200,
    requiredLevel: 5,
    icon: "➗",
    order: 27
  },
  {
    title: "Divisiones - Nivel 7",
    description: "División compleja",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto es 225 ÷ 15?",
    correctAnswer: "15",
    alternativeAnswers: ["15"],
    hint: "Divide primero entre 5, luego entre 3",
    timeLimit: 180,
    points: 600,
    xpReward: 250,
    requiredLevel: 6,
    icon: "➗",
    order: 28
  },

  // ==========================================
  // CATEGORÍA: LÓGICA DE LETRAS (7 niveles)
  // ==========================================
  {
    title: "Lógica de Letras - Nivel 1",
    description: "Secuencia alfabética simple",
    category: "patrones",
    difficulty: "facil",
    question: "¿Qué letra sigue? A, B, C, D, ___",
    correctAnswer: "E",
    alternativeAnswers: ["e", "E"],
    hint: "Son letras consecutivas del alfabeto",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "🔤",
    order: 29
  },
  {
    title: "Lógica de Letras - Nivel 2",
    description: "Saltos de una letra",
    category: "patrones",
    difficulty: "facil",
    question: "¿Qué letra sigue? A, C, E, G, ___",
    correctAnswer: "I",
    alternativeAnswers: ["i", "I"],
    hint: "Están saltando una letra",
    timeLimit: 60,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "🔤",
    order: 30
  },
  {
    title: "Lógica de Letras - Nivel 3",
    description: "Secuencia con saltos de dos",
    category: "patrones",
    difficulty: "medio",
    question: "¿Qué letra sigue? A, D, G, J, ___",
    correctAnswer: "M",
    alternativeAnswers: ["m", "M"],
    hint: "Saltan dos letras cada vez",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 2,
    icon: "🔤",
    order: 31
  },
  {
    title: "Lógica de Letras - Nivel 4",
    description: "Patrón inverso",
    category: "patrones",
    difficulty: "medio",
    question: "¿Qué letra sigue? Z, Y, X, W, ___",
    correctAnswer: "V",
    alternativeAnswers: ["v", "V"],
    hint: "Van hacia atrás en el alfabeto",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 3,
    icon: "🔤",
    order: 32
  },
  {
    title: "Lógica de Letras - Nivel 5",
    description: "Saltos crecientes",
    category: "patrones",
    difficulty: "medio",
    question: "¿Qué letra sigue? A, B, D, G, ___",
    correctAnswer: "K",
    alternativeAnswers: ["k", "K"],
    hint: "Saltos de +1, +2, +3, entonces +4",
    timeLimit: 120,
    points: 300,
    xpReward: 150,
    requiredLevel: 4,
    icon: "🔤",
    order: 33
  },
  {
    title: "Lógica de Letras - Nivel 6",
    description: "Patrón complejo alternado",
    category: "patrones",
    difficulty: "dificil",
    question: "¿Qué letra sigue? A, Z, B, Y, C, ___",
    correctAnswer: "X",
    alternativeAnswers: ["x", "X"],
    hint: "Alterna entre principio y final del alfabeto",
    timeLimit: 150,
    points: 500,
    xpReward: 200,
    requiredLevel: 5,
    icon: "🔤",
    order: 34
  },
  {
    title: "Lógica de Letras - Nivel 7",
    description: "Patrón de vocales",
    category: "patrones",
    difficulty: "dificil",
    question: "¿Qué letra sigue? A, E, I, O, ___",
    correctAnswer: "U",
    alternativeAnswers: ["u", "U"],
    hint: "Son las vocales en orden",
    timeLimit: 90,
    points: 600,
    xpReward: 250,
    requiredLevel: 6,
    icon: "🔤",
    order: 35
  }
];

async function seedChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    await Challenge.deleteMany({});
    console.log('🗑️  Retos antiguos eliminados');

    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`✅ ${createdChallenges.length} retos creados exitosamente\n`);

    console.log('📋 RESUMEN DE RETOS POR CATEGORÍA:');
    console.log('═══════════════════════════════════════');
    
    const categories = {
      'Secuencias Numéricas': createdChallenges.filter(c => c.title.startsWith('Secuencias')).length,
      'Sumas y Restas': createdChallenges.filter(c => c.title.startsWith('Sumas')).length,
      'Multiplicaciones': createdChallenges.filter(c => c.title.startsWith('Multiplicaciones')).length,
      'Divisiones': createdChallenges.filter(c => c.title.startsWith('Divisiones')).length,
      'Lógica de Letras': createdChallenges.filter(c => c.title.startsWith('Lógica')).length
    };

    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat.padEnd(25)} ${count} niveles`);
    });

    console.log('═══════════════════════════════════════');
    console.log(`\n🎯 TOTAL: ${createdChallenges.length} retos con niveles progresivos\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedChallenges();