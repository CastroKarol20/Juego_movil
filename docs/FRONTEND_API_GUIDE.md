# 🎮 Guía de Endpoints para el Frontend

## Resumen Rápido

| Endpoint | Uso | Qué devuelve |
|----------|-----|--------------|
| `GET /api/challenges/categories-summary` | Ver todas las categorías | Resumen: progreso, niveles desbloqueados, etc. |
| `GET /api/challenges/by-category/:category` | Ver niveles y retos de una categoría | Niveles con `isUnlocked`, retos agrupados |
| `GET /api/challenges/available` | (ANTIGUO) Obtener solo retos disponibles | Array de retos sin agrupar |
| `GET /api/challenges` | (ANTIGUO) Obtener TODOS los retos | Array de los 35 retos sin filtrar |

---

## 1️⃣ PANTALLA PRINCIPAL - Ver Todas las Categorías

**Endpoint:**
```
GET /api/challenges/categories-summary
Authorization: Bearer {token}
```

**Respuesta:**
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
      "icon": "logica_icon",
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
      "icon": "matematica_icon",
      "nextRewardAt": "Completa nivel 1"
    }
    // ... más categorías
  ]
}
```

**Cómo Renderizar en Flutter:**
```dart
// En el widget que muestra todas las categorías
for (var category in categoriesList) {
  Card(
    child: ListTile(
      title: Text(category['name']),
      subtitle: Text('${category['completedChallenges']}/${category['totalChallenges']} completados'),
      trailing: Text('${category['progress']}%'),
      onTap: () => navigateToCategoryDetails(category['category']),
    ),
  );
}
```

---

## 2️⃣ VISTA DE NIVELES - Seleccionar Categoría

**Endpoint:**
```
GET /api/challenges/by-category/logica
Authorization: Bearer {token}
```

**Respuesta:**
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
        "requiredToUnlock": 1,
        "challengesCount": 3,
        "completedCount": 3,
        "lockReason": null,
        "challenges": [
          {
            "_id": "60d5ec49c1234567890abcd1",
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
            "icon": "logic_icon",
            "order": 1
          }
          // ... más retos
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

**Cómo Renderizar en Flutter:**
```dart
// En el widget que muestra niveles
for (var level in categoryData['levels']) {
  final isUnlocked = level['isUnlocked'];
  
  Card(
    child: ListTile(
      title: Text('Nivel ${level['level']}'),
      subtitle: Text('${level['completedCount']}/${level['challengesCount']} retos'),
      leading: Icon(
        isUnlocked ? Icons.check_circle : Icons.lock,
        color: isUnlocked ? Colors.green : Colors.grey,
      ),
      enabled: isUnlocked,
      onTap: isUnlocked 
        ? () => navigateToRetos(level)
        : () => showDialog('${level['lockReason']}'),
    ),
  );
}
```

---

## 3️⃣ LISTA DE RETOS - Seleccionar Nivel

**Usa los retos que vienen en `challenges` del endpoint anterior**

```dart
// level viene de /api/challenges/by-category/{category}
if (level['isUnlocked'] && level['challenges'] != null) {
  for (var reto in level['challenges']) {
    Card(
      child: ListTile(
        title: Text(reto['title']),
        subtitle: Text(reto['description']),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.timer, size: 14),
            Text('${reto['timeLimit']}s'),
            SizedBox(width: 8),
            Icon(Icons.star, size: 14),
            Text('${reto['xpReward']}xp'),
          ],
        ),
        onTap: () => playChallenge(reto['_id']),
      ),
    );
  }
}
```

---

## 📋 Categorías Disponibles

Los valores de `category` son:

```javascript
'logica'        // Lógica
'matematica'    // Matemática
'espacial'      // Espacial
'programacion'  // Programación
'puzzle'        // Puzzle
```

**Ejemplos de URLs:**
```
GET /api/challenges/by-category/logica
GET /api/challenges/by-category/matematica
GET /api/challenges/by-category/espacial
GET /api/challenges/by-category/programacion
GET /api/challenges/by-category/puzzle
```

---

## 🔑 Campos Importantes para el Frontend

### En `categories-summary`:
- `progress` - Porcentaje (0-100)
- `unlockedLevels` - Cuántos niveles están desbloqueados
- `totalLevels` - Total de niveles en la categoría

### En `by-category/{category}`:
- `isUnlocked` - **IMPORTANTE**: determina si mostrar o bloquear el nivel
- `challengesCount` - Total de retos en ese nivel
- `completedCount` - Retos completados
- `challenges` - `null` si está bloqueado, array si está desbloqueado

---

## ✅ Checklist para el Frontend

- [ ] Llamar a `/categories-summary` cuando abre la app
- [ ] Mostrar todas las categorías con progreso
- [ ] Al tocar categoría, llamar a `/by-category/{category}`
- [ ] Mostrar niveles: si `isUnlocked=true` → activo, si `false` → gris con candado
- [ ] Solo mostrar retos si `challenges` no es `null`
- [ ] Mantener token JWT en header `Authorization: Bearer {token}`

---

## 🚀 Próximas Tareas (No Implementadas)

Después, necesitaremos crear estos endpoints:

1. `POST /api/challenges/{id}/complete` - Marcar reto como completado
2. `POST /api/challenges/{id}/submit` - Enviar respuesta y validar
3. `GET /api/user/profile` - Obtener perfil actualizado tras ganar XP/puntos

