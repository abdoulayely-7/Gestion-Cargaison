import { Cargaison } from "../models/Cargaison.js";
import { 
    obtenirToutesCargaisons,
    obtenirCargaisonsParType,
    obtenirCargaisonsParEtat,
    calculerPourcentageAvancement,
    formaterCoordonnees
} from "../api/cargaison/cargaison.js";

// Variables globales
let cargaisonsData: any[] = [];
let filteredCargaisons: any[] = [];

// Éléments DOM
let tableBody: HTMLElement;
let typeFilter: HTMLSelectElement;
let etatFilter: HTMLSelectElement;
let departFilter: HTMLInputElement;
let destinationFilter: HTMLInputElement;

// Obtenir l'icône selon le type de transport
export function obtenirIconeTypeTransport(type: string): string {
    switch (type.toLowerCase()) {
        case 'maritime': return 'anchor';
        case 'aerien': return 'plane';
        case 'routier': return 'truck';
        default: return 'package';
    }
}

// Obtenir le label du type de transport
export function obtenirLabelTypeTransport(type: string): string {
    switch (type.toLowerCase()) {
        case 'maritime': return 'Maritime';
        case 'aerien': return 'Aérien';
        case 'routier': return 'Routier';
        default: return type;
    }
}

// Obtenir la couleur selon le type
export function obtenirCouleurTypeTransport(type: string): string {
    switch (type.toLowerCase()) {
        case 'maritime': return 'bg-blue-100 text-blue-800';
        case 'aerien': return 'bg-green-100 text-green-800';
        case 'routier': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Obtenir le label de l'état
export function obtenirLabelEtat(etat: string): string {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'En attente';
        case 'en cours': return 'En cours';
        case 'en transit': return 'En transit';
        case 'livré': return 'Livré';
        default: return etat;
    }
}

// Obtenir la couleur selon l'état
export function obtenirCouleurEtat(etat: string): string {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'bg-yellow-100 text-yellow-800';
        case 'en cours': return 'bg-blue-100 text-blue-800';
        case 'en transit': return 'bg-green-100 text-green-800';
        case 'livré': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Formater le prix
export function formaterPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(prix).replace('XOF', 'FCFA');
}

// Initialiser les éléments DOM
function initialiserElementsDOM(): void {
    tableBody = document.querySelector('#cargaisons-table-body') as HTMLElement;
    typeFilter = document.querySelector('#type-filter') as HTMLSelectElement;
    etatFilter = document.querySelector('#etat-filter') as HTMLSelectElement;
    departFilter = document.querySelector('#depart-filter') as HTMLInputElement;
    destinationFilter = document.querySelector('#destination-filter') as HTMLInputElement;
}

// Afficher les cargaisons dans le tableau
export function afficherCargaisons(cargaisons: any[]): void {
    if (!tableBody) return;

    if (cargaisons.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                    <i data-lucide="package" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium">Aucune cargaison trouvée</p>
                    <p class="text-sm">Aucune cargaison ne correspond aux critères de recherche.</p>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = cargaisons.map(cargaison => {
        const pourcentage = calculerPourcentageAvancement(cargaison.etatAvancement);
        
        return `
        <tr class="hover:bg-gray-50 cursor-pointer" onclick="voirDetailsCargaison(${cargaison.id})">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${obtenirLabelTypeTransport(cargaison.type).substring(0, 3).toUpperCase()}-${String(cargaison.id).padStart(3, '0')}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenirCouleurTypeTransport(cargaison.type)}">
                    <i data-lucide="${obtenirIconeTypeTransport(cargaison.type)}" class="w-3 h-3 mr-1"></i>
                    ${obtenirLabelTypeTransport(cargaison.type)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>${cargaison.lieuDepart} → ${cargaison.lieuArrivee}</div>
                <div class="text-xs text-gray-500">${cargaison.distance.toLocaleString()} km</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${pourcentage}%"></div>
                    </div>
                    <span class="text-xs">${pourcentage}%</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenirCouleurEtat(cargaison.etatAvancement)}">
                    ${obtenirLabelEtat(cargaison.etatAvancement)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${cargaison.prixTransport ? formaterPrix(cargaison.prixTransport) : 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="event.stopPropagation(); voirDetailsCargaison(${cargaison.id})" class="text-indigo-600 hover:text-indigo-900">Voir</button>
                    <button onclick="event.stopPropagation(); modifierCargaison(${cargaison.id})" class="text-gray-600 hover:text-gray-900">Modifier</button>
                </div>
            </td>
        </tr>
    `;
    }).join('');

    // Réinitialiser les icônes Lucide
    if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
    }
}

// Filtrer les cargaisons
export function filtrerCargaisons(): void {
    const typeValue = typeFilter?.value || '';
    const etatValue = etatFilter?.value || '';
    const departValue = departFilter?.value.toLowerCase() || '';
    const destinationValue = destinationFilter?.value.toLowerCase() || '';

    filteredCargaisons = cargaisonsData.filter(cargaison => {
        const typeMatch = typeValue === '' || typeValue === 'tous' || cargaison.type.toLowerCase() === typeValue.toLowerCase();
        const etatMatch = etatValue === '' || etatValue === 'tous' || cargaison.etatAvancement.toLowerCase() === etatValue.toLowerCase();
        const departMatch = departValue === '' || cargaison.lieuDepart.toLowerCase().includes(departValue);
        const destinationMatch = destinationValue === '' || cargaison.lieuArrivee.toLowerCase().includes(destinationValue);

        return typeMatch && etatMatch && departMatch && destinationMatch;
    });

    afficherCargaisons(filteredCargaisons);
}

// Filtrer par type en utilisant l'API
export async function filtrerParType(type: string): Promise<void> {
    try {
        afficherChargement();
        if (type === 'tous' || type === '') {
            cargaisonsData = await obtenirToutesCargaisons();
        } else {
            cargaisonsData = await obtenirCargaisonsParType(type);
        }
        filteredCargaisons = [...cargaisonsData];
        afficherCargaisons(filteredCargaisons);
    } catch (error) {
        console.error('Erreur lors du filtrage par type:', error);
        afficherErreur('Erreur lors du filtrage par type.');
    }
}

// Filtrer par état en utilisant l'API
export async function filtrerParEtat(etat: string): Promise<void> {
    try {
        afficherChargement();
        if (etat === 'tous' || etat === '') {
            cargaisonsData = await obtenirToutesCargaisons();
        } else {
            cargaisonsData = await obtenirCargaisonsParEtat(etat);
        }
        filteredCargaisons = [...cargaisonsData];
        afficherCargaisons(filteredCargaisons);
    } catch (error) {
        console.error('Erreur lors du filtrage par état:', error);
        afficherErreur('Erreur lors du filtrage par état.');
    }
}

// Initialiser les événements
function initialiserEvenements(): void {
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            filtrerParType(target.value);
        });
    }
    if (etatFilter) {
        etatFilter.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            filtrerParEtat(target.value);
        });
    }
    if (departFilter) {
        departFilter.addEventListener('input', filtrerCargaisons);
    }
    if (destinationFilter) {
        destinationFilter.addEventListener('input', filtrerCargaisons);
    }
}

// Charger les cargaisons
async function chargerCargaisons(): Promise<void> {
    try {
        afficherChargement();
        cargaisonsData = await obtenirToutesCargaisons();
        filteredCargaisons = [...cargaisonsData];
        afficherCargaisons(filteredCargaisons);
    } catch (error) {
        console.error('Erreur lors du chargement des cargaisons:', error);
        afficherErreur('Erreur lors du chargement des cargaisons. Vérifiez que json-server est démarré.');
    }
}

// Afficher l'état de chargement
function afficherChargement(): void {
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex items-center justify-center space-x-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p class="text-gray-600">Chargement des cargaisons...</p>
                </div>
            </td>
        </tr>
    `;
}

// Afficher une erreur
function afficherErreur(message: string): void {
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-12 text-center text-red-500">
                <i data-lucide="alert-circle" class="w-12 h-12 mx-auto mb-4 text-red-300"></i>
                <p class="text-lg font-medium">Erreur</p>
                <p class="text-sm">${message}</p>
            </td>
        </tr>
    `;
}

// Fonctions globales pour les actions
function voirDetailsCargaison(id: number): void {
    console.log('Voir détails cargaison:', id);
    // TODO: Implémenter la vue détaillée
    window.location.href = `/cargaison/details/${id}`;
}

function modifierCargaison(id: number): void {
    console.log('Modifier cargaison:', id);
    // TODO: Implémenter la modification
    window.location.href = `/cargaison/modifier/${id}`;
}

// Fonction pour rafraîchir les données
export async function rafraichirCargaisons(): Promise<void> {
    await chargerCargaisons();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initialiserElementsDOM();
    initialiserEvenements();
    chargerCargaisons();
});

// Rendre les fonctions globales accessibles
(window as any).voirDetailsCargaison = voirDetailsCargaison;
(window as any).modifierCargaison = modifierCargaison;
(window as any).rafraichirCargaisons = rafraichirCargaisons;

// Export des fonctions principales
export {
    chargerCargaisons,
    voirDetailsCargaison,
    modifierCargaison
};
