# 🎯 Pasos Exactos Para Implementar en Flutter

## ESTRUCTURA DE LA APP

```
main.dart
├── screens/
│   ├── home_screen.dart (PANTALLA 1: Ver todas las categorías)
│   ├── category_levels_screen.dart (PANTALLA 2: Ver niveles de una categoría)
│   └── level_challenges_screen.dart (PANTALLA 3: Ver retos de un nivel)
├── models/
│   ├── category_model.dart
│   ├── level_model.dart
│   └── challenge_model.dart
├── services/
│   └── challenge_service.dart
└── constants/
    └── api_constants.dart
```

---

## PASO 1: Crear los Modelos de Datos

### `lib/models/challenge_model.dart`

```dart
class Challenge {
  final String id;
  final String title;
  final String description;
  final String difficulty;
  final String question;
  final String correctAnswer;
  final List<String> alternativeAnswers;
  final String hint;
  final int timeLimit;
  final int points;
  final int xpReward;
  final int requiredLevel;
  final String icon;
  final int order;

  Challenge({
    required this.id,
    required this.title,
    required this.description,
    required this.difficulty,
    required this.question,
    required this.correctAnswer,
    required this.alternativeAnswers,
    required this.hint,
    required this.timeLimit,
    required this.points,
    required this.xpReward,
    required this.requiredLevel,
    required this.icon,
    required this.order,
  });

  factory Challenge.fromJson(Map<String, dynamic> json) {
    return Challenge(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      difficulty: json['difficulty'] ?? '',
      question: json['question'] ?? '',
      correctAnswer: json['correctAnswer'] ?? '',
      alternativeAnswers: List<String>.from(json['alternativeAnswers'] ?? []),
      hint: json['hint'] ?? '',
      timeLimit: json['timeLimit'] ?? 0,
      points: json['points'] ?? 0,
      xpReward: json['xpReward'] ?? 0,
      requiredLevel: json['requiredLevel'] ?? 1,
      icon: json['icon'] ?? '',
      order: json['order'] ?? 0,
    );
  }
}
```

### `lib/models/level_model.dart`

```dart
import 'challenge_model.dart';

class Level {
  final int level;
  final bool isUnlocked;
  final int userCurrentLevel;
  final int requiredToUnlock;
  final int challengesCount;
  final int completedCount;
  final String? lockReason;
  final List<Challenge>? challenges; // null si está bloqueado

  Level({
    required this.level,
    required this.isUnlocked,
    required this.userCurrentLevel,
    required this.requiredToUnlock,
    required this.challengesCount,
    required this.completedCount,
    this.lockReason,
    this.challenges,
  });

  factory Level.fromJson(Map<String, dynamic> json) {
    return Level(
      level: json['level'] ?? 0,
      isUnlocked: json['isUnlocked'] ?? false,
      userCurrentLevel: json['userCurrentLevel'] ?? 1,
      requiredToUnlock: json['requiredToUnlock'] ?? 0,
      challengesCount: json['challengesCount'] ?? 0,
      completedCount: json['completedCount'] ?? 0,
      lockReason: json['lockReason'],
      challenges: json['challenges'] != null
          ? (json['challenges'] as List)
              .map((c) => Challenge.fromJson(c))
              .toList()
          : null,
    );
  }
}
```

### `lib/models/category_model.dart`

```dart
import 'level_model.dart';

class Category {
  final String name;
  final String category;
  final int totalChallenges;
  final int completedChallenges;
  final int progress; // 0-100
  final int unlockedLevels;
  final int totalLevels;
  final String icon;
  final String nextRewardAt;

  Category({
    required this.name,
    required this.category,
    required this.totalChallenges,
    required this.completedChallenges,
    required this.progress,
    required this.unlockedLevels,
    required this.totalLevels,
    required this.icon,
    required this.nextRewardAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      name: json['name'] ?? '',
      category: json['category'] ?? '',
      totalChallenges: json['totalChallenges'] ?? 0,
      completedChallenges: json['completedChallenges'] ?? 0,
      progress: json['progress'] ?? 0,
      unlockedLevels: json['unlockedLevels'] ?? 0,
      totalLevels: json['totalLevels'] ?? 0,
      icon: json['icon'] ?? '',
      nextRewardAt: json['nextRewardAt'] ?? '',
    );
  }
}

class CategoryWithLevels {
  final String category;
  final int totalChallenges;
  final List<Level> levels;

  CategoryWithLevels({
    required this.category,
    required this.totalChallenges,
    required this.levels,
  });

  factory CategoryWithLevels.fromJson(Map<String, dynamic> json) {
    return CategoryWithLevels(
      category: json['category'] ?? '',
      totalChallenges: json['totalChallenges'] ?? 0,
      levels: (json['levels'] as List)
          .map((l) => Level.fromJson(l))
          .toList(),
    );
  }
}
```

---

## PASO 2: Crear el Servicio de API

### `lib/services/challenge_service.dart`

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/category_model.dart';

class ChallengeService {
  // Cambiar esto por tu IP
  static const String baseUrl = 'http://192.168.101.73:5000/api';
  
  final String token;

  ChallengeService({required this.token});

  // 1. Obtener todas las categorías con resumen
  Future<List<Category>> getAllCategories() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/challenges/categories-summary'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> categoriesList = data['data'];
        return categoriesList
            .map((c) => Category.fromJson(c))
            .toList();
      } else {
        throw Exception('Error al obtener categorías: ${response.statusCode}');
      }
    } catch (e) {
      print('Error en getAllCategories: $e');
      rethrow;
    }
  }

  // 2. Obtener niveles y retos de una categoría
  Future<CategoryWithLevels> getCategoryWithLevels(String category) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/challenges/by-category/$category'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return CategoryWithLevels.fromJson(data['data']);
      } else {
        throw Exception('Error al obtener categoría: ${response.statusCode}');
      }
    } catch (e) {
      print('Error en getCategoryWithLevels: $e');
      rethrow;
    }
  }
}
```

---

## PASO 3: Crear la Primera Pantalla (Todas las Categorías)

### `lib/screens/home_screen.dart`

```dart
import 'package:flutter/material.dart';
import '../services/challenge_service.dart';
import '../models/category_model.dart';
import 'category_levels_screen.dart';

class HomeScreen extends StatefulWidget {
  final String token;

  const HomeScreen({Key? key, required this.token}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late ChallengeService challengeService;
  late Future<List<Category>> categoriesFuture;

  @override
  void initState() {
    super.initState();
    challengeService = ChallengeService(token: widget.token);
    // Llamar al API para obtener categorías
    categoriesFuture = challengeService.getAllCategories();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🎮 Categorías'),
        backgroundColor: Colors.deepPurple,
      ),
      body: FutureBuilder<List<Category>>(
        future: categoriesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, color: Colors.red, size: 48),
                  const SizedBox(height: 16),
                  Text('Error: ${snapshot.error}'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => setState(() {
                      categoriesFuture = challengeService.getAllCategories();
                    }),
                    child: const Text('Reintentar'),
                  ),
                ],
              ),
            );
          }

          final categories = snapshot.data ?? [];

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return CategoryCard(
                category: category,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CategoryLevelsScreen(
                        token: widget.token,
                        category: category,
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}

class CategoryCard extends StatelessWidget {
  final Category category;
  final VoidCallback onTap;

  const CategoryCard({
    Key? key,
    required this.category,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: ListTile(
        leading: Text(
          category.icon,
          style: const TextStyle(fontSize: 32),
        ),
        title: Text(
          category.name,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              '${category.completedChallenges}/${category.totalChallenges} completados',
            ),
            const SizedBox(height: 4),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: category.progress / 100,
                minHeight: 6,
                backgroundColor: Colors.grey[300],
                valueColor:
                    AlwaysStoppedAnimation<Color>(Colors.green[400] ?? Colors.green),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Niveles desbloqueados: ${category.unlockedLevels}/${category.totalLevels}',
              style: const TextStyle(fontSize: 12),
            ),
          ],
        ),
        trailing: const Icon(Icons.arrow_forward),
        onTap: onTap,
      ),
    );
  }
}
```

---

## PASO 4: Crear la Segunda Pantalla (Niveles)

### `lib/screens/category_levels_screen.dart`

```dart
import 'package:flutter/material.dart';
import '../services/challenge_service.dart';
import '../models/category_model.dart';
import 'level_challenges_screen.dart';

class CategoryLevelsScreen extends StatefulWidget {
  final String token;
  final Category category;

  const CategoryLevelsScreen({
    Key? key,
    required this.token,
    required this.category,
  }) : super(key: key);

  @override
  State<CategoryLevelsScreen> createState() => _CategoryLevelsScreenState();
}

class _CategoryLevelsScreenState extends State<CategoryLevelsScreen> {
  late ChallengeService challengeService;
  late Future<CategoryWithLevels> levelsFuture;

  @override
  void initState() {
    super.initState();
    challengeService = ChallengeService(token: widget.token);
    // Llamar al API para obtener niveles de esta categoría
    levelsFuture =
        challengeService.getCategoryWithLevels(widget.category.category);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.category.icon} ${widget.category.name}'),
        backgroundColor: Colors.deepPurple,
      ),
      body: FutureBuilder<CategoryWithLevels>(
        future: levelsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, color: Colors.red, size: 48),
                  const SizedBox(height: 16),
                  Text('Error: ${snapshot.error}'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => setState(() {
                      levelsFuture = challengeService
                          .getCategoryWithLevels(widget.category.category);
                    }),
                    child: const Text('Reintentar'),
                  ),
                ],
              ),
            );
          }

          final categoryData = snapshot.data;
          final levels = categoryData?.levels ?? [];

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: levels.length,
            itemBuilder: (context, index) {
              final level = levels[index];
              return LevelCard(
                level: level,
                onTap: level.isUnlocked
                    ? () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => LevelChallengesScreen(
                              token: widget.token,
                              level: level,
                            ),
                          ),
                        );
                      }
                    : () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(level.lockReason ?? 'Nivel bloqueado'),
                          ),
                        );
                      },
              );
            },
          );
        },
      ),
    );
  }
}

class LevelCard extends StatelessWidget {
  final Level level;
  final VoidCallback onTap;

  const LevelCard({
    Key? key,
    required this.level,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: ListTile(
        leading: Icon(
          level.isUnlocked ? Icons.check_circle : Icons.lock,
          color: level.isUnlocked ? Colors.green : Colors.grey,
          size: 32,
        ),
        title: Text(
          'Nivel ${level.level}',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              '${level.completedCount}/${level.challengesCount} retos',
            ),
            if (!level.isUnlocked && level.lockReason != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  level.lockReason!,
                  style: TextStyle(
                    color: Colors.orange[700],
                    fontSize: 12,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
          ],
        ),
        trailing: Icon(
          level.isUnlocked ? Icons.arrow_forward : Icons.lock,
          color: level.isUnlocked ? Colors.deepPurple : Colors.grey,
        ),
        enabled: level.isUnlocked,
        onTap: onTap,
      ),
    );
  }
}
```

---

## PASO 5: Crear la Tercera Pantalla (Retos del Nivel)

### `lib/screens/level_challenges_screen.dart`

```dart
import 'package:flutter/material.dart';
import '../models/level_model.dart';
import '../models/challenge_model.dart';

class LevelChallengesScreen extends StatelessWidget {
  final String token;
  final Level level;

  const LevelChallengesScreen({
    Key? key,
    required this.token,
    required this.level,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Si no está desbloqueado o no hay retos, mostrar mensaje
    if (!level.isUnlocked || level.challenges == null) {
      return Scaffold(
        appBar: AppBar(
          title: Text('Nivel ${level.level}'),
          backgroundColor: Colors.deepPurple,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              Text(
                level.lockReason ?? 'Nivel bloqueado',
                style: const TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    final challenges = level.challenges!;

    return Scaffold(
      appBar: AppBar(
        title: Text('Nivel ${level.level} - ${level.completedCount}/${level.challengesCount}'),
        backgroundColor: Colors.deepPurple,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(8),
        itemCount: challenges.length,
        itemBuilder: (context, index) {
          final challenge = challenges[index];
          return ChallengeCard(
            challenge: challenge,
            onTap: () {
              // TODO: Navegar a la pantalla de juego
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Reto: ${challenge.title}'),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class ChallengeCard extends StatelessWidget {
  final Challenge challenge;
  final VoidCallback onTap;

  const ChallengeCard({
    Key? key,
    required this.challenge,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          child: Text(challenge.order.toString()),
        ),
        title: Text(
          challenge.title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(challenge.description),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.timer, size: 14),
                const SizedBox(width: 4),
                Text('${challenge.timeLimit}s'),
                const SizedBox(width: 16),
                Icon(Icons.star, size: 14),
                const SizedBox(width: 4),
                Text('${challenge.points}pts'),
                const SizedBox(width: 16),
                Icon(Icons.flash_on, size: 14),
                const SizedBox(width: 4),
                Text('${challenge.xpReward}xp'),
              ],
            ),
          ],
        ),
        trailing: Icon(
          _getDifficultyIcon(challenge.difficulty),
          color: _getDifficultyColor(challenge.difficulty),
        ),
        onTap: onTap,
      ),
    );
  }

  IconData _getDifficultyIcon(String difficulty) {
    switch (difficulty) {
      case 'facil':
        return Icons.trending_down;
      case 'medio':
        return Icons.trending_flat;
      case 'dificil':
        return Icons.trending_up;
      default:
        return Icons.help;
    }
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty) {
      case 'facil':
        return Colors.green;
      case 'medio':
        return Colors.orange;
      case 'dificil':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
```

---

## PASO 6: Actualizar `main.dart`

```dart
import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MindForge',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        useMaterial3: true,
      ),
      home: HomeScreen(token: 'TU_TOKEN_JWT_AQUI'), // Reemplaza con token real
    );
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear `lib/models/challenge_model.dart`
- [ ] Crear `lib/models/level_model.dart`
- [ ] Crear `lib/models/category_model.dart`
- [ ] Crear `lib/services/challenge_service.dart`
- [ ] Crear `lib/screens/home_screen.dart`
- [ ] Crear `lib/screens/category_levels_screen.dart`
- [ ] Crear `lib/screens/level_challenges_screen.dart`
- [ ] Actualizar `main.dart`
- [ ] Reemplazar `TU_TOKEN_JWT_AQUI` con token real (o usar SharedPreferences)
- [ ] Cambiar `192.168.101.73` por tu IP si es diferente
- [ ] Probar en emulador

---

## 🎨 FLUJO DE NAVEGACIÓN

```
main.dart
  ↓
HomeScreen (Todas las categorías)
  ↓ (Toca categoría)
CategoryLevelsScreen (Niveles de categoría)
  ↓ (Toca nivel desbloqueado)
LevelChallengesScreen (Retos del nivel)
  ↓ (Toca reto)
TODO: ChallengGameScreen (Juego del reto)
```

---

## 📱 DATOS QUE FLUYEN

```
HomeScreen:
  ← GET /api/challenges/categories-summary
  → Muestra List<Category>

CategoryLevelsScreen:
  ← GET /api/challenges/by-category/{category}
  → Muestra List<Level> con challenges groupados

LevelChallengesScreen:
  ← Usa level.challenges del paso anterior
  → Muestra List<Challenge>
```

