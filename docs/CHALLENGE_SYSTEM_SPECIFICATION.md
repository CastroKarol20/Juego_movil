# 📚 Especificación del Sistema de Retos - Frontend

## 1. Flujo General de la UI

```
┌─────────────────────────────────────┐
│  PANTALLA PRINCIPAL DE CATEGORÍAS   │
│  ┌──────────┐ ┌──────────┐ ┌──────┐│
│  │ Lógica   │ │Matemática│ │Espacial
│  │   7/7    │ │   0/7    │ │  2/7  │
│  └──────────┘ └──────────┘ └──────┘│
└─────────────────────────────────────┘
           ↓ (Usuario toca)
┌─────────────────────────────────────┐
│   VISTA DE NIVELES (Lógica)         │
│  ┌────────────┐ ┌────────────┐     │
│  │ Nivel 1 ✓  │ │ Nivel 2 🔒 │     │
│  │ 3/3 retos  │ │ 0/3 retos  │     │
│  └────────────┘ └────────────┘     │
│  ┌────────────┐                     │
│  │ Nivel 3 🔒 │                     │
│  │ 0/3 retos  │                     │
│  └────────────┘                     │
└─────────────────────────────────────┘
           ↓ (Usuario toca nivel)
┌─────────────────────────────────────┐
│   LISTA DE RETOS (Lógica - Nivel 1) │
│  ┌─────────────────────────────────┐│
│  │ 1. Silogismo básico        Fácil││
│  │    ⏱️ 120s | 🎯 50pts | ✨ 100xp││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 2. Lógica proposicional    Fácil││
│  │    ⏱️ 180s | 🎯 75pts | ✨ 150xp││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 2. Estructura de Respuestas del API

### 2.1 GET `/api/challenges/by-category/{category}`

Devuelve todos los retos de una categoría **con información de desbloqueo**:

```json
{
  "success": true,
  "data": {
    "category": "logica",
    "totalChallenges": 7,
    "levels": [
      {
        "level": 1,
        "isUnlocked": true,
        "userCurrentLevel": 1,
        "challengesCount": 3,
        "completedCount": 3,
        "challenges": [
          {
            "id": "60d5ec49c1234567890abcd1",
            "title": "Silogismo básico",
            "description": "Completa el silogismo lógico",
            "difficulty": "facil",
            "question": "Si todo es verde y todo es azul, entonces...",
            "correctAnswer": "Nothing can be both",
            "alternativeAnswers": ["Todo es verde-azul", "Nada existe"],
            "hint": "Piensa en la lógica de conjuntos",
            "timeLimit": 120,
            "points": 50,
            "xpReward": 100,
            "requiredLevel": 1,
            "isCompleted": true,
            "icon": "logic_icon",
            "order": 1
          }
          // ... más retos del nivel 1
        ]
      },
      {
        "level": 2,
        "isUnlocked": false,
        "userCurrentLevel": 1,
        "requiredToUnlock": 2,
        "challengesCount": 2,
        "completedCount": 0,
        "lockReason": "Debes alcanzar nivel 2 para desbloquear",
        "challenges": null
      },
      {
        "level": 3,
        "isUnlocked": false,
        "userCurrentLevel": 1,
        "requiredToUnlock": 3,
        "challengesCount": 2,
        "completedCount": 0,
        "lockReason": "Debes alcanzar nivel 3 para desbloquear",
        "challenges": null
      }
    ]
  }
}
```

### 2.2 GET `/api/challenges/categories-summary`

Devuelve resumen de todas las categorías:

```json
{
  "success": true,
  "data": [
    {
      "category": "logica",
      "name": "Lógica",
      "totalChallenges": 7,
      "completedChallenges": 3,
      "progress": 43,
      "unlockedLevels": 1,
      "totalLevels": 3,
      "icon": "logic_icon",
      "nextRewardAt": "Nivel 2"
    },
    {
      "category": "matematica",
      "name": "Matemática",
      "totalChallenges": 7,
      "completedChallenges": 0,
      "progress": 0,
      "unlockedLevels": 1,
      "totalLevels": 3,
      "icon": "math_icon",
      "nextRewardAt": "Completa nivel 1"
    }
    // ... más categorías
  ]
}
```

---

## 3. Lógica de Bloqueo/Desbloqueo

### 3.1 Regla Principal

```javascript
// En el backend
const isLevelUnlocked = challenge.requiredLevel <= user.level;

// El frontend debe renderizar:
if (isLevelUnlocked) {
  // Mostrar retos normalmente
  // Botón: "Jugar" / "Continuar"
  // Badge: ✓ Desbloqueado | Progreso 3/3
} else {
  // Mostrar nivel bloqueado
  // Botón DESHABILITADO
  // Icono: 🔒
  // Texto: "Desbloquea en nivel {requiredLevel}"
  // Progreso: gris 0/7
}
```

### 3.2 Ejemplo Concreto

Usuario en **Nivel 1**:
- ✅ Nivel 1 desbloqueado (1 ≤ 1)
- 🔒 Nivel 2 bloqueado (2 > 1)
- 🔒 Nivel 3 bloqueado (3 > 1)

Usuario en **Nivel 2**:
- ✅ Nivel 1 desbloqueado (1 ≤ 2)
- ✅ Nivel 2 desbloqueado (2 ≤ 2)
- 🔒 Nivel 3 bloqueado (3 > 2)

---

## 4. Cómo el Frontend Debe Implementar Esto

### 4.1 Paso 1: Obtener Datos de Categoría

```dart
// En Flutter
Future<void> loadCategoryWithLevels(String category) async {
  final response = await http.get(
    Uri.parse('http://192.168.101.73:5000/api/challenges/by-category/$category'),
    headers: {'Authorization': 'Bearer $token'},
  );
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    setState(() {
      categoryData = data['data']; // Contiene levels y challenges
    });
  }
}
```

### 4.2 Paso 2: Renderizar Niveles con Estado

```dart
// Mostrar cada nivel
for (var levelData in categoryData['levels']) {
  final isUnlocked = levelData['isUnlocked'];
  final level = levelData['level'];
  final progress = '${levelData['completedCount']}/${levelData['challengesCount']}';
  
  Card(
    child: ListTile(
      title: Text('Nivel $level'),
      subtitle: Text(progress),
      leading: Icon(
        isUnlocked ? Icons.check_circle : Icons.lock,
        color: isUnlocked ? Colors.green : Colors.grey,
      ),
      trailing: isUnlocked ? Icon(Icons.arrow_forward) : Icon(Icons.lock),
      enabled: isUnlocked,
      onTap: isUnlocked ? () => showChallenges(level) : null,
    ),
  );
}
```

### 4.3 Paso 3: Renderizar Retos del Nivel

```dart
// Solo si isUnlocked == true
if (levelData['isUnlocked']) {
  for (var challenge in levelData['challenges']) {
    Card(
      child: ListTile(
        title: Text(challenge['title']),
        subtitle: Text(challenge['description']),
        // Mostrar datos
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.timer, size: 16),
            Text('${challenge['timeLimit']}s'),
            SizedBox(width: 10),
            Icon(Icons.star, size: 16),
            Text('${challenge['xpReward']}xp'),
          ],
        ),
        onTap: () => playChallenge(challenge['id']),
      ),
    );
  }
}
```

---

## 5. Estados Posibles de un Reto

| Estado | Icono | Acción | Notas |
|--------|-------|--------|-------|
| **Desbloqueado sin jugar** | 📄 | Botón "Jugar" activo | Se puede completar |
| **Desbloqueado completado** | ✅ | Botón "Repetir" activo | Gana menos XP |
| **Bloqueado por nivel** | 🔒 | Botón deshabilitado | Esperar a nivel siguiente |
| **Bloqueado por reto anterior** | 🔐 | Botón deshabilitado | (Si quieres orden secuencial) |

---

## 6. Datos que Necesita el Frontend

Para cada categoría/nivel, el backend debe proporcionar:

```javascript
{
  category: String,           // "logica"
  level: Number,              // 1, 2, 3
  isUnlocked: Boolean,        // true/false
  userCurrentLevel: Number,   // Nivel actual del usuario
  requiredToUnlock: Number,   // Nivel necesario para desbloquear
  challengesCount: Number,    // Total de retos en este nivel
  completedCount: Number,     // Retos completados
  lockReason: String,         // "Debes alcanzar nivel 2..."
  challenges: Array || null   // Array de retos si desbloqueado, null si bloqueado
}
```

---

## 7. Flujo Completo de Usuario

```
1. Usuario abre la app
   ↓
2. Ve todas las CATEGORÍAS con progreso (3/7, 0/7, 2/7, etc.)
   ↓
3. Toca categoría (ej: "Lógica")
   ↓
4. Ve NIVELES: Nivel 1 ✓ | Nivel 2 🔒 | Nivel 3 🔒
   ↓
5. Toca Nivel 1
   ↓
6. Ve lista de RETOS desbloqueados (3 retos)
   ↓
7. Toca un reto y juega
   ↓
8. Gana XP y sube de nivel
   ↓
9. Vuelve a ver NIVELES: Nivel 1 ✓ | Nivel 2 ✓ | Nivel 3 🔒
   ↓
10. Nivel 2 ahora está desbloqueado y visible
```

---

## 8. Notas Importantes

- **El backend devuelve `null` para `challenges` si el nivel está bloqueado**
- **El frontend NO debe intentar mostrar retos bloqueados**
- **El campo `isUnlocked` determina TODO**: si mostrar, si habilitar botones, si permitir tap
- **El progreso se actualiza AUTOMÁTICAMENTE** cuando el usuario sube de nivel
- **No hay caché**: Siempre obtener datos frescos del servidor al cambiar de pantalla

---

## 9. Ejemplo de Respuesta Real

```json
{
  "success": true,
  "data": {
    "category": "logica",
    "totalChallenges": 7,
    "levels": [
      {
        "level": 1,
        "isUnlocked": true,
        "userCurrentLevel": 1,
        "challengesCount": 3,
        "completedCount": 3,
        "challenges": [
          {
            "id": "...",
            "title": "Silogismo básico",
            "difficulty": "facil",
            "question": "Si todo es verde...",
            "timeLimit": 120,
            "points": 50,
            "xpReward": 100,
            "requiredLevel": 1,
            "isCompleted": true
          },
          // ... 2 más
        ]
      },
      {
        "level": 2,
        "isUnlocked": false,
        "userCurrentLevel": 1,
        "requiredToUnlock": 2,
        "challengesCount": 2,
        "completedCount": 0,
        "lockReason": "Debes alcanzar nivel 2 para desbloquear",
        "challenges": null
      }
    ]
  }
}
```

---

## 10. Resumen para el Frontend

✅ **SI el nivel está desbloqueado:**
- Mostrar retos
- Permitir jugar
- Mostrar progreso (3/3)
- Mostrar ícono ✓

🔒 **SI el nivel está bloqueado:**
- NO mostrar retos (detalles son null)
- Desabilitar botones
- Mostrar candado 🔒
- Mostrar mensaje "Debes alcanzar nivel X"
- Mostrar progreso gris (0/7)

