require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');

const challenges = [
  {
    title: "Secuencia Numérica Básica",
    description: "Identifica el patrón y completa la secuencia",
    category: "logica",
    difficulty: "facil",
    question: "¿Cuál es el siguiente número en la secuencia? 2, 4, 8, 16, ___",
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
    title: "Suma Mental Rápida",
    description: "Resuelve la operación matemática",
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
    order: 2
  },
  {
    title: "Patrón de Letras",
    description: "Encuentra la letra que sigue en el patrón",
    category: "logica",
    difficulty: "facil",
    question: "¿Qué letra continúa la secuencia? A, C, E, G, ___",
    correctAnswer: "I",
    alternativeAnswers: ["i", "I"],
    hint: "Están saltando una letra del alfabeto",
    timeLimit: 90,
    points: 100,
    xpReward: 50,
    requiredLevel: 1,
    icon: "🔤",
    order: 3
  },
  {
    title: "Multiplicación Mental",
    description: "Calcula el resultado",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 13 × 7?",
    correctAnswer: "91",
    alternativeAnswers: ["91"],
    hint: "Puedes descomponer: (10 × 7) + (3 × 7)",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 2,
    icon: "✖️",
    order: 4
  },
  {
    title: "Secuencia Fibonacci",
    description: "Continúa la famosa secuencia",
    category: "logica",
    difficulty: "medio",
    question: "¿Cuál es el siguiente número? 1, 1, 2, 3, 5, 8, ___",
    correctAnswer: "13",
    alternativeAnswers: ["13"],
    hint: "Cada número es la suma de los dos anteriores",
    timeLimit: 120,
    points: 250,
    xpReward: 100,
    requiredLevel: 3,
    icon: "🌀",
    order: 5
  },
  {
    title: "División Exacta",
    description: "Encuentra el resultado de la división",
    category: "matematica",
    difficulty: "medio",
    question: "¿Cuánto es 144 ÷ 12?",
    correctAnswer: "12",
    alternativeAnswers: ["12"],
    hint: "Piensa en las tablas de multiplicar",
    timeLimit: 90,
    points: 250,
    xpReward: 100,
    requiredLevel: 2,
    icon: "➗",
    order: 6
  },
  {
    title: "Patrón Geométrico",
    description: "Identifica el patrón en la secuencia",
    category: "patrones",
    difficulty: "medio",
    question: "¿Qué número continúa? 1, 4, 9, 16, 25, ___",
    correctAnswer: "36",
    alternativeAnswers: ["36"],
    hint: "Son números al cuadrado: 1², 2², 3²...",
    timeLimit: 120,
    points: 250,
    xpReward: 100,
    requiredLevel: 3,
    icon: "🔷",
    order: 7
  },
  {
    title: "Ecuación Simple",
    description: "Resuelve para encontrar X",
    category: "matematica",
    difficulty: "dificil",
    question: "Si X + 15 = 37, ¿cuánto vale X?",
    correctAnswer: "22",
    alternativeAnswers: ["22"],
    hint: "Resta 15 de ambos lados de la ecuación",
    timeLimit: 120,
    points: 500,
    xpReward: 200,
    requiredLevel: 5,
    icon: "🧮",
    order: 8
  },
  {
    title: "Potencias",
    description: "Calcula la potencia",
    category: "matematica",
    difficulty: "dificil",
    question: "¿Cuánto es 5³ (5 al cubo)?",
    correctAnswer: "125",
    alternativeAnswers: ["125"],
    hint: "Es lo mismo que 5 × 5 × 5",
    timeLimit: 90,
    points: 500,
    xpReward: 200,
    requiredLevel: 5,
    icon: "📐",
    order: 9
  },
  {
    title: "Secuencia Compleja",
    description: "Encuentra el patrón oculto",
    category: "logica",
    difficulty: "dificil",
    question: "¿Qué número sigue? 2, 6, 12, 20, 30, ___",
    correctAnswer: "42",
    alternativeAnswers: ["42"],
    hint: "Diferencias: +4, +6, +8, +10... ¿Cuál sigue?",
    timeLimit: 180,
    points: 500,
    xpReward: 200,
    requiredLevel: 6,
    icon: "🧩",
    order: 10
  }
];

async function seedChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección existente
    await Challenge.deleteMany({});
    console.log('🗑️  Retos antiguos eliminados');

    // Insertar nuevos retos
    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`✅ ${createdChallenges.length} retos creados exitosamente\n`);

    console.log('📋 Resumen de retos creados:');
    console.log('─────────────────────────────────────');
    
    const byDifficulty = {
      facil: createdChallenges.filter(c => c.difficulty === 'facil').length,
      medio: createdChallenges.filter(c => c.difficulty === 'medio').length,
      dificil: createdChallenges.filter(c => c.difficulty === 'dificil').length
    };

    console.log(`🟢 Fácil:   ${byDifficulty.facil} retos`);
    console.log(`🟡 Medio:   ${byDifficulty.medio} retos`);
    console.log(`🔴 Difícil: ${byDifficulty.dificil} retos`);
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedChallenges();