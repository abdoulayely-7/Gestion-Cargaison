#!/bin/bash

echo "🚀 Test du projet Gestion Cargaison"
echo "===================================="

# Test 1: Compilation TypeScript
echo "📝 Test 1: Compilation TypeScript..."
cd front
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Compilation TypeScript réussie"
else
    echo "❌ Erreur de compilation TypeScript"
    exit 1
fi

# Test 2: Vérification des dépendances
echo "📦 Test 2: Vérification des dépendances..."
npm install --silent
if [ $? -eq 0 ]; then
    echo "✅ Dépendances installées avec succès"
else
    echo "❌ Erreur d'installation des dépendances"
    exit 1
fi

# Test 3: Validation JSON
echo "📄 Test 3: Validation du fichier JSON..."
cd ../
if [ -f "data/db.json" ]; then
    echo "✅ Fichier de données trouvé"
    # Tester si le JSON est valide
    python3 -m json.tool data/db.json > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ JSON valide"
    else
        echo "❌ JSON invalide"
        exit 1
    fi
else
    echo "❌ Fichier de données manquant"
    exit 1
fi

# Test 4: Vérification des fichiers essentiels
echo "🔍 Test 4: Vérification des fichiers essentiels..."
essential_files=(
    "front/src/api/cargaison/cargaison.ts"
    "front/src/api/colis/colis.ts"
    "front/src/config/environnement.ts"
    "back/index.php"
    "back/Router.php"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file présent"
    else
        echo "❌ $file manquant"
        exit 1
    fi
done

echo ""
echo "🎉 Tous les tests sont passés avec succès !"
echo "Le projet est prêt à être utilisé."
echo ""
echo "Pour démarrer le projet :"
echo "1. Terminal 1: cd front && npm run watch"
echo "2. Terminal 2: php -S localhost:8000 -t back/"
echo "3. Ouvrir http://localhost:8000 dans le navigateur"
