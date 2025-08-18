#!/bin/bash

echo "🚀 Démarrage des serveurs pour Gestion Cargaison..."

# Fonction pour nettoyer en cas d'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $API_PID $PHP_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Démarrer le serveur API (port 3000)
echo "📡 Démarrage du serveur API sur le port 3000..."
cd "$(dirname "$0")/api"
node server.js &
API_PID=$!

# Démarrer le serveur PHP (port 8000)
echo "🐘 Démarrage du serveur PHP sur le port 8000..."
cd "$(dirname "$0")/back"
php -S localhost:8000 &
PHP_PID=$!

echo ""
echo "✅ Serveurs démarrés:"
echo "   📡 API: http://localhost:3000"
echo "   🐘 Frontend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Attendre que les processus se terminent
wait
