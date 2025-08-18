import { rechercherColisAvecInfos, annulerColis, obtenirProgressionEtat, obtenirIconeTransport, obtenirLabelTypeProduit, obtenirLabelTransport, obtenirCargaison, obtenirCoordonnees, simulerPositionActuelle } from "../api/colis/colis.js";
import { ColisMapService } from "../service/ColisMapService.js";
import { Colis } from "../models/Colis.js";
import { Cargaison } from "../models/Cargaison.js";
// Variables globales
let searchInput;
let searchResult;
let mapService;
let currentColis = null;
// Fonction utilitaire pour afficher les messages de succès
function showSuccess(message) {
    // Créer ou récupérer le conteneur de messages
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.className = 'fixed top-4 right-4 z-50';
        document.body.appendChild(messageContainer);
    }
    // Créer le message
    const messageElement = document.createElement('div');
    messageElement.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2 shadow-md';
    messageElement.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    messageContainer.appendChild(messageElement);
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 5000);
}
function initEventListeners() {
    // Recherche avec bouton
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', () => performSearch());
    }
    // Recherche avec Entrée
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}
async function performSearch() {
    const code = searchInput?.value.trim();
    if (!code) {
        showError('Veuillez entrer un code de suivi.');
        return;
    }
    try {
        showLoading();
        const result = await rechercherColisAvecInfos(code);
        if (!result.existe) {
            // Afficher le message d'erreur personnalisé
            showError(result.message || 'Colis non trouvé');
            return;
        }
        currentColis = result.colis;
        await displayColisInfo(result.colis, result.cargaison, result.infosAvancement);
    }
    catch (error) {
        console.error('Erreur lors de la recherche:', error);
        showError('Erreur lors de la recherche. Veuillez réessayer.');
    }
}
async function displayColisInfo(colis, cargaison, infosAvancement) {
    const transportIcon = cargaison ? obtenirIconeTransport(cargaison.type.toString()) : 'package';
    const canCancel = cargaison && cargaison.etatGlobal !== 'Fermé' && colis.etat !== 'Annulé';
    searchResult.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 ${getStatusColor(infosAvancement.etat)} rounded-full flex items-center justify-center">
                        <i data-lucide="${getStatusIcon(infosAvancement.etat)}" class="h-6 w-6 ${getStatusTextColor(infosAvancement.etat)}"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Colis #${colis.code}</h3>
                        ${canCancel ? `
                        <button onclick="annulerColisAction()" class="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                            Annuler le colis
                        </button>
                        ` : ''}
                    </div>
                    
                    <!-- État principal avec progression -->
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-lg font-semibold ${getStatusTextColor(infosAvancement.etat)}">${infosAvancement.etat}</span>
                            <span class="text-sm text-gray-500">${infosAvancement.pourcentage}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div class="h-2 rounded-full ${getProgressBarColor(infosAvancement.etat)}" style="width: ${infosAvancement.pourcentage}%"></div>
                        </div>
                        <p class="text-gray-700 mb-2">${infosAvancement.message}</p>
                        
                        ${infosAvancement.estimation ? `
                        <div class="flex items-center text-blue-600 mb-2">
                            <i data-lucide="clock" class="w-4 h-4 mr-2"></i>
                            <span class="font-medium">${infosAvancement.estimation}</span>
                        </div>
                        ` : ''}
                        
                        ${infosAvancement.retard ? `
                        <div class="flex items-center text-red-600 mb-2">
                            <i data-lucide="alert-triangle" class="w-4 h-4 mr-2"></i>
                            <span class="font-medium">${infosAvancement.retard}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-medium text-gray-700 mb-3">Informations du colis</h4>
                            <div class="space-y-2 text-sm">
                                <p><span class="text-gray-500">Type:</span> <span class="font-medium">${colis.typeProduit}</span></p>
                                ${colis.souTypeProduit ? `<p><span class="text-gray-500">Sous-type:</span> <span class="font-medium">${colis.souTypeProduit}</span></p>` : ''}
                                ${colis.libelleProduit ? `<p><span class="text-gray-500">Produit:</span> <span class="font-medium">${colis.libelleProduit}</span></p>` : ''}
                                <p><span class="text-gray-500">Poids:</span> <span class="font-medium">${colis.poids} kg</span></p>
                                ${cargaison ? `<p><span class="text-gray-500">Transport:</span> <span class="font-medium capitalize">${cargaison.type}</span></p>` : ''}
                                <p><span class="text-gray-500">Date enregistrement:</span> <span class="font-medium">${new Date(colis.dateEnregistrement).toLocaleDateString('fr-FR')}</span></p>
                                ${colis.notes ? `<p><span class="text-gray-500">Notes:</span> <span class="font-medium">${colis.notes}</span></p>` : ''}
                            </div>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-3">Expéditeur et Destinataire</h4>
                            <div class="space-y-3 text-sm">
                                <div>
                                    <p class="font-medium text-gray-600 mb-1">Expéditeur:</p>
                                    <p class="font-medium">${colis.expediteur.prenom} ${colis.expediteur.nom}</p>
                                    <p class="text-gray-500">${colis.expediteur.telephone}</p>
                                    ${colis.expediteur.adresse ? `<p class="text-gray-500">${colis.expediteur.adresse}</p>` : ''}
                                </div>
                                <div>
                                    <p class="font-medium text-gray-600 mb-1">Destinataire:</p>
                                    <p class="font-medium">${colis.destinataire.prenom} ${colis.destinataire.nom}</p>
                                    <p class="text-gray-500">${colis.destinataire.telephone}</p>
                                    ${colis.destinataire.adresse ? `<p class="text-gray-500">${colis.destinataire.adresse}</p>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${cargaison && cargaison.lieuDepart && cargaison.lieuArrivee ? `
                    <div class="mt-6">
                        <h4 class="font-medium text-gray-700 mb-3">Itinéraire</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-green-600"></i>
                                <span class="text-gray-500">Départ:</span> <span class="font-medium ml-2">${cargaison.lieuDepart}</span>
                            </div>
                            <div class="flex items-center">
                                <i data-lucide="flag" class="w-4 h-4 mr-2 text-red-600"></i>
                                <span class="text-gray-500">Arrivée:</span> <span class="font-medium ml-2">${cargaison.lieuArrivee}</span>
                            </div>
                            ${cargaison.distance ? `
                            <div class="flex items-center">
                                <i data-lucide="route" class="w-4 h-4 mr-2 text-blue-600"></i>
                                <span class="text-gray-500">Distance:</span> <span class="font-medium ml-2">${cargaison.distance.toLocaleString()} km</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    // Afficher la carte si disponible
    if (cargaison && cargaison.lieuDepart && cargaison.lieuArrivee) {
        await afficherCarte(colis, cargaison);
    }
    // Réinitialiser les icônes Lucide
    if (typeof window.lucide !== 'undefined') {
        window.lucide.createIcons();
    }
}
// Fonctions utilitaires pour les couleurs et icônes selon l'état
function getStatusColor(etat) {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'bg-yellow-100';
        case 'en cours': return 'bg-blue-100';
        case 'arrivé': return 'bg-green-100';
        case 'récupéré': return 'bg-green-100';
        case 'perdu': return 'bg-red-100';
        case 'archivé': return 'bg-gray-100';
        case 'annulé': return 'bg-red-100';
        default: return 'bg-gray-100';
    }
}
function getStatusTextColor(etat) {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'text-yellow-600';
        case 'en cours': return 'text-blue-600';
        case 'arrivé': return 'text-green-600';
        case 'récupéré': return 'text-green-600';
        case 'perdu': return 'text-red-600';
        case 'archivé': return 'text-gray-600';
        case 'annulé': return 'text-red-600';
        default: return 'text-gray-600';
    }
}
function getStatusIcon(etat) {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'clock';
        case 'en cours': return 'truck';
        case 'arrivé': return 'package-check';
        case 'récupéré': return 'check-circle';
        case 'perdu': return 'x-circle';
        case 'archivé': return 'archive';
        case 'annulé': return 'x-circle';
        default: return 'package';
    }
}
function getProgressBarColor(etat) {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'bg-yellow-500';
        case 'en cours': return 'bg-blue-500';
        case 'arrivé': return 'bg-green-500';
        case 'récupéré': return 'bg-green-500';
        case 'perdu': return 'bg-red-500';
        case 'archivé': return 'bg-gray-500';
        case 'annulé': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}
// Fonction pour annuler un colis
async function annulerColisAction() {
    if (!currentColis)
        return;
    const confirmation = confirm('Êtes-vous sûr de vouloir annuler ce colis ? Cette action est irréversible.');
    if (confirmation) {
        try {
            await annulerColis(currentColis.id);
            showSuccess('Colis annulé avec succès');
            // Relancer la recherche pour actualiser l'affichage
            setTimeout(() => {
                performSearch();
            }, 1500);
        }
        catch (error) {
            showError(error.message || 'Erreur lors de l\'annulation');
        }
    }
}
async function afficherCarte(colis, cargaison) {
    try {
        if (!cargaison || !cargaison.lieuDepart || !cargaison.lieuArrivee) {
            return;
        }
        let departureCoords = null;
        let arrivalCoords = null;
        // Essayer d'extraire les coordonnées du lieu de départ (format: "lat, lng")
        if (cargaison.lieuDepart.includes(',')) {
            const [lat, lng] = cargaison.lieuDepart.split(',').map((coord) => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
                departureCoords = { lat, lng };
            }
        }
        // Essayer d'extraire les coordonnées du lieu d'arrivée
        if (cargaison.lieuArrivee.includes(',')) {
            const [lat, lng] = cargaison.lieuArrivee.split(',').map((coord) => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
                arrivalCoords = { lat, lng };
            }
        }
        if (departureCoords && arrivalCoords) {
            // Simuler la position actuelle basée sur l'état
            const progress = calculateProgress(colis.etat);
            const currentCoords = interpolatePosition(departureCoords, arrivalCoords, progress);
            // Ajouter la section carte à l'affichage
            const mapSection = document.createElement('div');
            mapSection.className = 'mt-6';
            mapSection.innerHTML = `
                <h4 class="font-medium text-gray-700 mb-4">Localisation en temps réel</h4>
                <div id="colisMap" class="h-64 bg-gray-100 rounded-lg border border-gray-200"></div>
            `;
            const searchResultContent = searchResult.querySelector('.bg-white .flex-1');
            if (searchResultContent) {
                searchResultContent.appendChild(mapSection);
            }
            // Initialiser la carte après un petit délai pour s'assurer que le DOM est prêt
            setTimeout(() => {
                if (mapService) {
                    mapService.initMap('colisMap');
                    mapService.displayRoute(departureCoords, arrivalCoords, currentCoords, cargaison.type.toString());
                }
            }, 100);
        }
    }
    catch (error) {
        console.error('Erreur lors de l\'affichage de la carte:', error);
    }
}
// Calculer le pourcentage de progression basé sur l'état
function calculateProgress(etat) {
    switch (etat.toLowerCase()) {
        case 'en attente': return 0;
        case 'en cours': return 0.5;
        case 'arrivé':
        case 'livré': return 1;
        case 'récupéré': return 1;
        default: return 0;
    }
}
// Interpoler la position entre départ et arrivée
function interpolatePosition(start, end, progress) {
    return {
        lat: start.lat + (end.lat - start.lat) * progress,
        lng: start.lng + (end.lng - start.lng) * progress
    };
}
function addMapStyles() {
    if (!document.getElementById('mapStyles')) {
        const style = document.createElement('style');
        style.id = 'mapStyles';
        style.textContent = `
            .custom-div-icon {
                background: transparent;
                border: none;
            }
            .marker-departure {
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .marker-arrival {
                background: #22c55e;
                color: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .marker-current {
                background: #0ea5e9;
                color: white;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 4px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(14, 165, 233, 0.7);
                }
                70% {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 0 10px rgba(14, 165, 233, 0);
                }
                100% {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(14, 165, 233, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}
function generateProgressSteps(currentStep, transportIcon) {
    const steps = [
        { id: 1, label: 'En attente', icon: 'clock' },
        { id: 2, label: 'En cours', icon: 'truck' },
        { id: 3, label: 'Transport', icon: transportIcon },
        { id: 4, label: 'Livré', icon: 'package-check' }
    ];
    return steps.map((step, index) => {
        const isCompleted = step.id <= currentStep;
        const isCurrent = step.id === currentStep;
        const isLast = index === steps.length - 1;
        return `
            <div class="flex items-center ${!isLast ? 'flex-1' : ''}">
                <div class="flex items-center">
                    <div class="h-8 w-8 ${isCompleted ? 'bg-green-600' : isCurrent ? 'bg-ocean-400' : 'bg-gray-200'} rounded-full flex items-center justify-center text-white font-semibold">
                        ${isCompleted && step.id < currentStep ? '✓' : `<i data-lucide="${step.icon}" class="h-4 w-4"></i>`}
                    </div>
                    <span class="ml-2 text-sm ${isCompleted ? 'text-green-600 font-medium' : isCurrent ? 'text-ocean-600 font-medium' : 'text-gray-400'}">${step.label}</span>
                </div>
                ${!isLast ? `<div class="flex-1 h-1 ${isCompleted && step.id < currentStep ? 'bg-green-600' : isCurrent ? 'bg-ocean-400' : 'bg-gray-200'} mx-4"></div>` : ''}
            </div>
        `;
    }).join('');
}
function showError(message) {
    searchResult.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                        <i data-lucide="alert-circle" class="h-6 w-6 text-red-600"></i>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Colis non trouvé</h3>
                    <p class="text-gray-600">${message}</p>
                </div>
            </div>
        </div>
    `;
    searchResult.style.display = 'block';
    if (typeof window.lucide !== 'undefined') {
        window.lucide.createIcons();
    }
}
function showLoading() {
    searchResult.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-center justify-center space-x-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600"></div>
                <p class="text-gray-600">Recherche en cours...</p>
            </div>
        </div>
    `;
    searchResult.style.display = 'block';
}
export function navigateToLogin() {
    window.location.href = '/';
}
// Fonctions globales pour les événements HTML
export function searchColis() {
    performSearch();
}
export function showLogin() {
    navigateToLogin();
}
// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    searchInput = document.getElementById('searchInput');
    searchResult = document.getElementById('searchResult');
    mapService = new ColisMapService();
    initEventListeners();
    if (typeof window.lucide !== 'undefined') {
        window.lucide.createIcons();
    }
});
//# sourceMappingURL=colis.js.map