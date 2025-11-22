# 🪐 MATH PLUS : LA BIBLE DU CRÉATEUR (V3.0)

**Guide de référence technique et pédagogique pour la création de contenu.**

Ce document détaille la structure JSON stricte requise pour alimenter l'application **Math Plus**.
L'objectif est de créer un contenu **interactif**, **visuel** et **mathématiquement rigoureux**.

---

## ⚡ 1. MICRO-SYNTAXE & TEXTE

Ces règles s'appliquent partout (Leçons, Quiz, Exercices).

### A. Formatage de Texte
| Effet | Syntaxe | Rendu |
| :--- | :--- | :--- |
| **Gras** | `**Texte important**` | **Texte important** |
| **Titre d'étape** | `>>Initialisation :` | **Initialisation :** (Bloc avec saut de ligne réduit) |
| **Trou Interactif** | `___réponse___` | Un champ cliquable/révélable (ex: `___5___`). |

### B. Mathématiques (KaTeX)
Le moteur de rendu est **KaTeX**. Il faut distinguer deux modes :

1.  **Mode En Ligne (`$ ... $`)** : Pour les formules dans le texte.
    *   Exemple : `Soit $f$ une fonction...`
2.  **Mode Bloc (`$$ ... $$`)** : Pour les formules centrées et mises en valeur.
    *   Exemple : `$$ \lim_{x \to +\infty} f(x) = 0 $$`

> **⚠️ RÈGLE D'OR : LA VERTICALITÉ**
> Utilisez **toujours** `\displaystyle` ou `\dfrac` pour les fractions et symboles complexes afin qu'ils ne soient pas écrasés.
> *   ❌ `\frac{1}{x}` (Illisible sur mobile)
> *   ✅ `\dfrac{1}{x}` (Lisible)
> *   ✅ `\vec{u}` (Vecteur simple)
> *   ✅ `\overrightarrow{AB}` (Vecteur double lettres)

---

## 📚 2. STRUCTURE D'UNE LEÇON (`_lesson.json`)

Fichier : `[chapitre]_lesson.json`

### Squelette Global
```json
{
  "header": {
    "title": "Titre du Chapitre",
    "subtitle": "Sous-titre accrocheur",
    "classe": "1bsm",
    "chapter": "Chapitre X",
    "academicYear": "2025-2026"
  },
  "sections": [
    {
      "title": "I. Titre de la Section",
      "subsections": [
        {
          "title": "1. Titre Sous-Section",
          "elements": [ 
             // ... Liste des BOÎTES (voir ci-dessous) ...
          ]
        }
      ]
    }
  ]
}
```

### Catalogue des Éléments (`elements`)

Chaque élément est un objet JSON avec un `type`.

#### 1. Les Boîtes de Contenu (Standard)
Utilisées pour : `definition-box`, `property-box`, `theorem-box`, `method-box`, `remark-box`, `warning-box`, `activity-box`, `example-box`, `consequence-box`, `demo-box`, `proof-box`.

*   **`title`** (Optionnel) : Le titre affiché dans l'en-tête de la boîte.
*   **`preamble`** (Optionnel) : Texte introductif en gras (souvent utilisé comme sous-titre interne).
*   **`content`** : Chaîne de caractères OU Tableau de chaînes (pour les listes).
*   **`listType`** : `"bullet"` (puces) ou `"numbered"` (chiffres). Obligatoire si `content` est un tableau.

```json
{
  "type": "definition-box",
  "title": "Fonction Bornée",
  "content": [
    "Une fonction $f$ est bornée si elle est majorée et minorée.",
    "$$ \\forall x \\in I, \\quad m \\le f(x) \\le M $$"
  ],
  "listType": "bullet"
}
```

#### 2. La Boîte "À vous de jouer" (`practice-box`)
Spéciale pour l'auto-évaluation immédiate.

```json
{
  "type": "practice-box",
  "title": "Application",
  "statement": "Calculer la dérivée de $f(x) = x^2$.",
  "solution": [
    "On utilise la formule $(x^n)' = nx^{n-1}$.",
    "Ici $n=2$, donc $f'(x) = ___2x___$."
  ],
  "listType": "numbered"
}
```

#### 3. Images (`image`)
Peut être un élément seul ou intégré dans une boîte.

```json
{
  "type": "image",
  "image": {
    "src": "https://exemple.com/image.png", // URL ou chemin local
    "alt": "Description",
    "caption": "Légende affichée sous l'image",
    "width": "50%", // Largeur CSS
    "position": "center", // 'left', 'right', 'center'
    "transparent": true // Enlève la bordure et l'ombre (pour SVG/PNG détourés)
  }
}
```

#### 4. Graphique de Fonction 2D Simple (`graph-2d`)
Génère un traceur de courbes léger pour les fonctions simples.

```json
{
  "type": "graph-2d",
  "graph2d": {
    "title": "Fonction Carrée",
    "xDomain": [-3, 3],
    "yDomain": [-1, 5],
    "grid": true,
    "functions": [
      { "fn": "x^2", "color": "#0056D2" },
      { "fn": "2*x + 1", "color": "#F2D049", "graphType": "polyline" }
    ]
  }
}
```

---

## 🔬 3. ZOOM SUR GEOGEBRA (`geogebra`)

L'intégration GeoGebra est puissante. Elle ajoute un bouton **"Simulation"** flottant dans la boîte, qui ouvre une modale interactive plein écran.

Vous avez deux façons de créer une simulation :

### Méthode A : Utiliser une ressource existante (Recommandé)
Allez sur [GeoGebra Tube](https://www.geogebra.org/materials), trouvez une activité, et copiez son ID (la fin de l'URL).

```json
{
  "type": "activity-box",
  "title": "Somme des angles",
  "content": "Manipulez les sommets du triangle pour vérifier la propriété.",
  "geogebra": {
    "title": "Propriété des 180°",
    "materialId": "p7d44p8h", // ID unique de la ressource
    "appName": "geometry",     // Type d'app (optionnel si materialId présent)
    "showToolBar": false       // Masquer les outils pour simplifier
  }
}
```

### Méthode B : Scripter la construction (Avancé)
Vous pouvez définir la figure directement via des commandes GGB Script.

```json
{
  "type": "example-box",
  "title": "Tangente en un point",
  "content": "Observez la pente de la tangente en déplaçant le point A.",
  "geogebra": {
    "title": "Simulation Dérivée",
    "appName": "graphing", // 'graphing', 'geometry', '3d', 'classic'
    "width": 800,
    "height": 600,
    "showAlgebraInput": true, // Afficher la colonne de gauche
    "commands": [
      "f(x) = x^2 - 2x",           // 1. Créer la fonction
      "SetColor(f, \"blue\")",     // 2. Couleur
      "A = Point(f)",              // 3. Point sur la courbe
      "T = Tangent(A, f)",         // 4. Tangente
      "SetColor(T, \"red\")",      // 5. Couleur Tangente
      "SetTrace(T, true)",         // 6. Activer la trace
      "StartAnimation(A, true)"    // 7. Animer le point A
    ]
  }
}
```

### Paramètres disponibles pour `geogebra` :
*   `appName`: "graphing" (Fonctions), "geometry" (Géométrie plane), "3d" (Espace), "classic".
*   `materialId`: ID GeoGebra Tube (remplace les commandes).
*   `commands`: Tableau de chaînes (commandes GGB).
*   `showToolBar`: booléen (Barre d'outils haut).
*   `showAlgebraInput`: booléen (Fenêtre algèbre gauche).
*   `showMenuBar`: booléen (Menu fichier).
*   `enableShiftDragZoom`: booléen (Déplacer la vue).

---

## ❓ 4. STRUCTURE D'UN QUIZ (`_quiz.json`)

Fichier : `[chapitre]_quiz.json`

Le quiz est un tableau de questions QCM.

```json
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Quelle est la limite de $\\dfrac{1}{x}$ en $+\\infty$ ?",
      "options": [
        {
          "text": "$0$",
          "is_correct": true,
          "explanation": "C'est une limite usuelle."
        },
        {
          "text": "$+\\infty$",
          "is_correct": false,
          "explanation": "Inverse d'un très grand nombre."
        }
      ]
    }
  ]
}
```
*   **Note** : Le champ `explanation` s'affiche dans une boîte "ÉCLAIRAGE" élégante après la réponse.

---

## 🏋️ 5. STRUCTURE DES EXERCICES (`_exercises.json`)

Fichier : `[chapitre]_exercises.json`

Structure hiérarchique : Exercice -> Questions -> Sous-Questions.

```json
{
  "exercises": [
    {
      "id": "ex_1",
      "title": "Étude de fonction",
      "statement": "Soit $f(x) = x^2 - 4x$.",
      "images": [], // Images globales pour l'énoncé
      "sub_questions": [
        {
          "text": "Calculer la dérivée $f'(x)$.",
          "questionNumber": "1", // Affiche "1."
          "sub_sub_questions": []
        },
        {
          "text": "Étudier les variations.",
          "questionNumber": "2",
          "sub_sub_questions": [
            { "text": "Signe de la dérivée." }, // Affiche "a."
            { "text": "Tableau de variation." }  // Affiche "b."
          ]
        }
      ],
      "hint": [ // Indices progressifs
        { "text": "Utilisez $(u+v)' = u' + v'$.", "questionNumber": "1" }
      ],
      "solution": [ // Correction globale (Future feature)
        "$f'(x) = 2x - 4$."
      ]
    }
  ]
}
```

---

## 🎨 6. PALETTE DES COULEURS & STYLE

L'application gère automatiquement le style "Architectural" :

*   **Définition/Propriété** : Bordure Solide, Fond Blanc.
*   **Théorème** : Bordure Noire Épaisse, Ombre dure.
*   **Exemple/Activité** : Bordure Pointillée (Dashed), Fond Gris clair.
*   **Preuve** : Bordure Zigzag à gauche.
*   **Attention** : Teintes Rouges.

---

## 🛠️ 7. CHECKLIST AVANT PUBLICATION

1.  **Validité JSON** : Pas de virgules manquantes ou en trop à la fin des listes.
2.  **Maths** : Vérifier que toutes les fractions sont en `\dfrac` ou `\displaystyle`.
3.  **Trous** : Vérifier que les réponses dans `___réponse___` sont correctes.
4.  **Images** : Vérifier que les liens sont accessibles.
5.  **IDs** : Les IDs des exercices/quiz doivent être uniques.
