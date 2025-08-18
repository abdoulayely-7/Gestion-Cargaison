import { 
    obtenirColisAvecCargaison,
    obtenirProgressionEtat,
    obtenirIconeTransport,
    obtenirLabelTypeProduit,
    obtenirLabelTransport,
    obtenirCargaison,
    obtenirCoordonnees,
    simulerPositionActuelle
} from "../api/colis/colis.js";
import { ColisMapService } from "../service/ColisMapService.js";
import { Colis } from "../models/Colis.js";
import { Cargaison } from "../models/Cargaison.js";

// Variables globales
let searchInput: HTMLInputElement;
let searchResult: HTMLElement;
let mapService: ColisMapService;

function initEventListeners(): void {
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

async function performSearch(): Promise<void> {
    const code = searchInput?.value.trim();

    if (!code) {
        showError('Veuillez entrer un code de suivi.');
        return;
    }

    try {
        showLoading();

        const result = await obtenirColisAvecCargaison(code);
        
        if (!result) {
            showError('Aucun colis trouvé avec ce code de suivi.');
            return;
        }

        const { colis, cargaison } = result;
        await displayColisInfo(colis, cargaison);
        
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors de la recherche. Vérifiez que json-server est démarré sur le port 3000.');
    }
}

async function displayColisInfo(colis: Colis, cargaison: Cargaison): Promise<void> {
    const progress = obtenirProgressionEtat(cargaison.etatAvancement.toString());
    const transportIcon = obtenirIconeTransport(cargaison.type.toString());

    searchResult.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 ${progress.step === 4 ? 'bg-green-100' : 'bg-ocean-100'} rounded-full flex items-center justify-center">
                        <i data-lucide="${progress.step === 4 ? 'package-check' : 'package'}" class="h-6 w-6 ${progress.step === 4 ? 'text-green-600' : 'text-ocean-600'}"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Colis #${colis.code}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-medium text-gray-700 mb-3">Informations du colis</h4>
                            <div class="space-y-2 text-sm">
                                <p><span class="text-gray-500">Type:</span> <span class="font-medium">${obtenirLabelTypeProduit(colis.typeProduit.toString())}</span></p>
                                <p><span class="text-gray-500">Poids:</span> <span class="font-medium">${colis.poids} kg</span></p>
                                <p><span class="text-gray-500">Transport:</span> <span class="font-medium">${obtenirLabelTransport(cargaison.type.toString())}</span></p>
                                <p><span class="text-gray-500">Date enregistrement:</span> <span class="font-medium">${new Date(colis.dateEnregistrement).toLocaleDateString('fr-FR')}</span></p>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-3">Trajet</h4>
                            <div class="space-y-2 text-sm">
                                <p><span class="text-gray-500">Expéditeur:</span> <span class="font-medium">${colis.expediteur.prenom} ${colis.expediteur.nom}</span></p>
                                <p><span class="text-gray-500">Départ:</span> <span class="font-medium">${cargaison.lieuDepart}</span></p>
                                <p><span class="text-gray-500">Destinataire:</span> <span class="font-medium">${colis.destinataire.prenom} ${colis.destinataire.nom}</span></p>
                                <p><span class="text-gray-500">Arrivée:</span> <span class="font-medium">${cargaison.lieuArrivee}</span></p>
                                <p><span class="text-gray-500">Distance:</span> <span class="font-medium">${cargaison.distance} km</span></p>
                            </div>
                        </div>
                    </div>

                    <!-- Carte de localisation -->
                    <div class="mt-6">
                        <h4 class="font-medium text-gray-700 mb-4">Localisation en temps réel</h4>
                        <div id="colisMap" class="h-64 bg-gray-100 rounded-lg border border-gray-200"></div>
                    </div>

                    <!-- Progression -->
                    <div class="mt-6">
                        <h4 class="font-medium text-gray-700 mb-4">État d'avancement</h4>
                        <div class="relative">
                            <div class="flex items-center justify-between">
                                ${generateProgressSteps(progress.step, transportIcon)}
                            </div>
                        </div>
                        <div class="mt-4 p-4 ${progress.step === 4 ? 'bg-green-50' : 'bg-ocean-50'} rounded-lg">
                            <p class="${progress.step === 4 ? 'text-green-800' : 'text-ocean-800'}">
                                <span class="font-semibold">État actuel:</span> ${progress.message}
                            </p>
                            ${colis.dateLivraisonPrev ? `<p class="text-sm mt-1"><span class="font-semibold">Livraison prévue:</span> ${new Date(colis.dateLivraisonPrev).toLocaleDateString('fr-FR')}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    searchResult.style.display = 'block';
    // Réinitialiser les icônes Lucide
    if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
    }

    // Initialiser la carte après l'affichage
    await initializeMap(cargaison);
}

async function initializeMap(cargaison: Cargaison): Promise<void> {
    try {
        let departureCoords: {lat: number, lng: number} | null = null;
        let arrivalCoords: {lat: number, lng: number} | null = null;

        // Utiliser les coordonnées de la cargaison si disponibles (depuis l'API)
        const cargaisonData = await obtenirCargaison((cargaison as any).id);
        
        if (cargaisonData?.coordonneesDepart) {
            departureCoords = cargaisonData.coordonneesDepart;
        } else {
            // Fallback vers l'API de géocodage locale
            departureCoords = await obtenirCoordonnees(cargaison.lieuDepart);
        }

        if (cargaisonData?.coordonneesArrivee) {
            arrivalCoords = cargaisonData.coordonneesArrivee;
        } else {
            // Fallback vers l'API de géocodage locale
            arrivalCoords = await obtenirCoordonnees(cargaison.lieuArrivee);
        }

        if (departureCoords && arrivalCoords) {
            // Simuler la position actuelle basée sur l'état
            const currentCoords = simulerPositionActuelle(departureCoords, arrivalCoords, cargaison.etatAvancement.toString());

            // Initialiser la carte
            mapService.initMap('colisMap');
            
            // Afficher la route et les marqueurs
            await mapService.displayRoute(departureCoords, arrivalCoords, currentCoords, cargaison.type.toString());

            // Ajouter les styles CSS pour les marqueurs
            addMapStyles();
        } else {
            document.getElementById('colisMap')!.innerHTML = `
                <div class="flex items-center justify-center h-full text-gray-500">
                    <p>Carte non disponible - Coordonnées manquantes</p>
                    <p class="text-sm mt-1">Départ: ${cargaison.lieuDepart} | Arrivée: ${cargaison.lieuArrivee}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
        document.getElementById('colisMap')!.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <p>Erreur lors du chargement de la carte</p>
            </div>
        `;
    }
}

function addMapStyles(): void {
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

function generateProgressSteps(currentStep: number, transportIcon: string): string {
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

function showError(message: string): void {
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
    if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
    }
}

function showLoading(): void {
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

export function navigateToLogin(): void {
    window.location.href = '/';
}

// Fonctions globales pour les événements HTML
export function searchColis(): void {
    performSearch();
}

export function showLogin(): void {
    navigateToLogin();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    searchInput = document.getElementById('searchInput') as HTMLInputElement;
    searchResult = document.getElementById('searchResult') as HTMLElement;
    mapService = new ColisMapService();
    initEventListeners();
    
    if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
    }
});
