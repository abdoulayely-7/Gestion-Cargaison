import { Colis } from "../models/Colis.js";
import { 
    obtenirTousColis,
    marquerColisRecupere,
    marquerColisPerdu,
    archiverColis,
    changerEtatColis,
    obtenirColisParId
} from "../api/colis/colis.js";

// Interface pour la réponse API des colis
interface ColisAPIResponse {
    id: number;
    code: string;
    etat: string;
    poids: number;
    expediteur: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        telephone: string;
        adresse: string;
        password: string;
    };
    destinataire: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        telephone: string;
        adresse: string;
        password: string;
    };
    typeProduit: string; // Alimentaire, Chimique, Materiel
    souTypeProduit?: string; // Pour Materiel: Fragile ou Incassable
    libelleProduit: string; // Libellé du produit
    degreToxicite?: number; // Pour Chimique: 1-5
    typeCargaison: string;
    dateEnregistrement: string;
    notes: string;
    cargaisonId: number;
}

const API_BASE_URL = 'http://localhost:3000';

// Variables globales
let colisData: ColisAPIResponse[] = [];
let filteredColis: ColisAPIResponse[] = [];

// Éléments DOM
let tableBody: HTMLElement;
let etatFilter: HTMLSelectElement;
let typeProduitFilter: HTMLSelectElement;
let expediteurFilter: HTMLInputElement;
let destinataireFilter: HTMLInputElement;
let codeFilter: HTMLInputElement;

/**
 * Fonctions utilitaires
 */

// Fonction pour afficher les messages à l'utilisateur
function afficherMessage(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // Créer un élément de notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${getMessageClasses(type)}`;
    notification.textContent = message;
    
    // Ajouter à la page
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Obtenir les classes CSS selon le type de message
function getMessageClasses(type: string): string {
    switch (type) {
        case 'success': return 'bg-green-100 text-green-800 border border-green-300';
        case 'error': return 'bg-red-100 text-red-800 border border-red-300';
        case 'warning': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        case 'info': return 'bg-blue-100 text-blue-800 border border-blue-300';
        default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
}

/**
 * Fonctions de gestion des états des colis
 */

// Marquer un colis comme récupéré
async function marquerCommeRecupere(id: number): Promise<void> {
    try {
        await marquerColisRecupere(id);
        await chargerColis(); // Recharger la liste
        afficherMessage('Colis marqué comme récupéré avec succès', 'success');
    } catch (error) {
        console.error('Erreur lors de la récupération du colis:', error);
        afficherMessage('Erreur lors de la récupération du colis', 'error');
    }
}

// Marquer un colis comme perdu
async function marquerCommePerdu(id: number): Promise<void> {
    const raison = prompt('Veuillez indiquer la raison de la perte :');
    if (raison) {
        try {
            await marquerColisPerdu(id, raison);
            await chargerColis(); // Recharger la liste
            afficherMessage('Colis marqué comme perdu', 'warning');
        } catch (error) {
            console.error('Erreur lors du marquage du colis comme perdu:', error);
            afficherMessage('Erreur lors du marquage du colis comme perdu', 'error');
        }
    }
}

// Archiver un colis manuellement
async function archiverColisManuel(id: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir archiver ce colis ?')) {
        try {
            await archiverColis(id);
            await chargerColis(); // Recharger la liste
            afficherMessage('Colis archivé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'archivage du colis:', error);
            afficherMessage('Erreur lors de l\'archivage du colis', 'error');
        }
    }
}

// Changer l'état d'un colis
async function changerEtatColisAction(id: number): Promise<void> {
    const etatsDisponibles = [
        'En attente',
        'En cours',
        'En transit', 
        'Livré',
        'Récupéré',
        'Perdu',
        'Archivé'
    ];
    
    const choix = prompt(`Choisissez un nouvel état :\n${etatsDisponibles.map((e, i) => `${i + 1}. ${e}`).join('\n')}`);
    
    if (choix) {
        const index = parseInt(choix) - 1;
        if (index >= 0 && index < etatsDisponibles.length) {
            const nouvelEtat = etatsDisponibles[index]!; // Assertion non-null car on vérifie l'index
            try {
                await changerEtatColis(id, nouvelEtat);
                await chargerColis(); // Recharger la liste
                afficherMessage(`État du colis changé vers "${nouvelEtat}"`, 'success');
            } catch (error) {
                console.error('Erreur lors du changement d\'état:', error);
                afficherMessage('Erreur lors du changement d\'état', 'error');
            }
        } else {
            afficherMessage('Choix invalide', 'error');
        }
    }
}

/**
 * Récupère un colis par son code
 */
export async function obtenirColisParCode(code: string): Promise<ColisAPIResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/colis?code=${code}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis.length > 0 ? colis[0] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération du colis:', error);
        throw error;
    }
}

/**
 * Récupère les colis par état
 */
export async function obtenirColisParEtat(etat: string): Promise<ColisAPIResponse[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/colis?etat=${etat}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis;
    } catch (error) {
        console.error('Erreur lors de la récupération des colis par état:', error);
        throw error;
    }
}

/**
 * Récupère les colis par cargaison
 */
export async function obtenirColisParCargaison(cargaisonId: number): Promise<ColisAPIResponse[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/colis?cargaisonId=${cargaisonId}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis;
    } catch (error) {
        console.error('Erreur lors de la récupération des colis par cargaison:', error);
        throw error;
    }
}

// Obtenir l'icône selon le type de produit
export function obtenirIconeTypeProduit(typeProduit: string, souType?: string): string {
    switch (typeProduit) {
        case 'Alimentaire': return 'utensils';
        case 'Chimique': return 'flask-conical';
        case 'Materiel':
            return souType === 'Fragile' ? 'package-x' : 'package-check';
        default: return 'package';
    }
}

// Obtenir le label du type de produit
export function obtenirLabelTypeProduit(typeProduit: string, souType?: string): string {
    switch (typeProduit) {
        case 'Alimentaire': return 'Alimentaire';
        case 'Chimique': return 'Chimique';
        case 'Materiel':
            return souType === 'Fragile' ? 'Matériel Fragile' : 'Matériel Incassable';
        default: return typeProduit;
    }
}

// Obtenir la couleur selon le type de produit
export function obtenirCouleurTypeProduit(typeProduit: string, souType?: string): string {
    switch (typeProduit) {
        case 'Alimentaire': return 'bg-green-100 text-green-800';
        case 'Chimique': return 'bg-red-100 text-red-800';
        case 'Materiel':
            return souType === 'Fragile' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Obtenir le label de l'état
export function obtenirLabelEtatColis(etat: string): string {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'En attente';
        case 'en cours': return 'En cours';
        case 'en transit': return 'En transit';
        case 'livré': return 'Livré';
        default: return etat;
    }
}

// Obtenir la couleur selon l'état
export function obtenirCouleurEtatColis(etat: string): string {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'bg-yellow-100 text-yellow-800';
        case 'en cours': return 'bg-blue-100 text-blue-800';
        case 'en transit': return 'bg-green-100 text-green-800';
        case 'livré': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Vérifier si un colis respecte les règles de transport
export function verifierReglesTransport(coli: ColisAPIResponse): { valide: boolean, message: string } {
    // Règle: Les produits fragiles ne doivent JAMAIS passer par voie maritime
    if (coli.typeProduit === 'Materiel' && 
        coli.souTypeProduit === 'Fragile' && 
        coli.typeCargaison.toLowerCase() === 'maritime') {
        return {
            valide: false,
            message: "❌ VIOLATION: Les produits fragiles ne peuvent pas être transportés par voie maritime!"
        };
    }
    
    // Règle: Les produits incassables peuvent transiter 1-9 jours par maritime
    if (coli.typeProduit === 'Materiel' && 
        coli.souTypeProduit === 'Incassable' && 
        coli.typeCargaison.toLowerCase() === 'maritime') {
        return {
            valide: true,
            message: "✅ Transport maritime autorisé (1-9 jours)"
        };
    }
    
    return { valide: true, message: "✅ Règles de transport respectées" };
}

// Obtenir l'indicateur de toxicité
export function obtenirIndicateurToxicite(degre?: number): string {
    if (!degre) return '';
    
    const couleurs = ['green', 'yellow', 'orange', 'red', 'red'];
    const couleur = couleurs[degre - 1] || 'gray';
    
    return `<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${couleur}-100 text-${couleur}-800">
        <i data-lucide="alert-triangle" class="w-3 h-3 mr-1"></i>
        Toxicité: ${degre}/5
    </span>`;
}

// Formater le poids
export function formaterPoids(poids: number): string {
    return `${poids} kg`;
}

// Formater la date
export function formaterDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialiser les éléments DOM
function initialiserElementsDOM(): void {
    tableBody = document.querySelector('#colis-table-body') as HTMLElement;
    etatFilter = document.querySelector('#etat-filter') as HTMLSelectElement;
    typeProduitFilter = document.querySelector('#type-produit-filter') as HTMLSelectElement;
    expediteurFilter = document.querySelector('#expediteur-filter') as HTMLInputElement;
    destinataireFilter = document.querySelector('#destinataire-filter') as HTMLInputElement;
    codeFilter = document.querySelector('#code-filter') as HTMLInputElement;
}

// Afficher les colis dans le tableau
export function afficherColis(colis: ColisAPIResponse[]): void {
    if (!tableBody) return;

    if (colis.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                    <i data-lucide="package" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium">Aucun colis trouvé</p>
                    <p class="text-sm">Aucun colis ne correspond aux critères de recherche.</p>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = colis.map(col => `
        <tr class="hover:bg-gray-50 cursor-pointer" onclick="voirDetailsColis(${col.id})">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${col.code}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenirCouleurTypeProduit(col.typeProduit)}">
                    <i data-lucide="${obtenirIconeTypeProduit(col.typeProduit)}" class="w-3 h-3 mr-1"></i>
                    ${obtenirLabelTypeProduit(col.typeProduit)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formaterPoids(col.poids)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>${col.expediteur.nom} ${col.expediteur.prenom}</div>
                <div class="text-xs text-gray-500">${col.expediteur.telephone}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>${col.destinataire.nom} ${col.destinataire.prenom}</div>
                <div class="text-xs text-gray-500">${col.destinataire.telephone}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenirCouleurEtatColis(col.etat)}">
                    ${obtenirLabelEtatColis(col.etat)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formaterDate(col.dateEnregistrement)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-1 justify-end">
                    <button onclick="event.stopPropagation(); voirDetailsColis(${col.id})" 
                            class="text-indigo-600 hover:text-indigo-900 p-1" title="Voir détails">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <button onclick="event.stopPropagation(); changerEtatColisAction(${col.id})" 
                            class="text-blue-600 hover:text-blue-900 p-1" title="Changer état">
                        <i data-lucide="settings" class="w-4 h-4"></i>
                    </button>
                    ${col.etat !== 'Récupéré' ? `
                    <button onclick="event.stopPropagation(); marquerCommeRecupere(${col.id})" 
                            class="text-green-600 hover:text-green-900 p-1" title="Marquer comme récupéré">
                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                    </button>
                    ` : ''}
                    ${col.etat !== 'Perdu' ? `
                    <button onclick="event.stopPropagation(); marquerCommePerdu(${col.id})" 
                            class="text-red-600 hover:text-red-900 p-1" title="Marquer comme perdu">
                        <i data-lucide="x-circle" class="w-4 h-4"></i>
                    </button>
                    ` : ''}
                    ${col.etat !== 'Archivé' ? `
                    <button onclick="event.stopPropagation(); archiverColisManuel(${col.id})" 
                            class="text-gray-600 hover:text-gray-900 p-1" title="Archiver">
                        <i data-lucide="archive" class="w-4 h-4"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
                </div>
            </td>
        </tr>
    `).join('');

    // Réinitialiser les icônes Lucide
    if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
    }
}

// Filtrer les colis
export function filtrerColis(): void {
    const etatValue = etatFilter?.value || '';
    const typeProduitValue = typeProduitFilter?.value || '';
    const expediteurValue = expediteurFilter?.value.toLowerCase() || '';
    const destinataireValue = destinataireFilter?.value.toLowerCase() || '';
    const codeValue = codeFilter?.value.toLowerCase() || '';

    filteredColis = colisData.filter(col => {
        const etatMatch = etatValue === '' || etatValue === 'tous' || col.etat.toLowerCase() === etatValue.toLowerCase();
        const typeProduitMatch = typeProduitValue === '' || typeProduitValue === 'tous' || col.typeProduit.toLowerCase() === typeProduitValue.toLowerCase();
        const expediteurMatch = expediteurValue === '' || 
            `${col.expediteur.nom} ${col.expediteur.prenom}`.toLowerCase().includes(expediteurValue);
        const destinataireMatch = destinataireValue === '' || 
            `${col.destinataire.nom} ${col.destinataire.prenom}`.toLowerCase().includes(destinataireValue);
        const codeMatch = codeValue === '' || col.code.toLowerCase().includes(codeValue);

        return etatMatch && typeProduitMatch && expediteurMatch && destinataireMatch && codeMatch;
    });

    afficherColis(filteredColis);
}

// Filtrer par état en utilisant l'API
export async function filtrerParEtat(etat: string): Promise<void> {
    try {
        afficherChargement();
        if (etat === 'tous' || etat === '') {
            colisData = await obtenirTousColis();
        } else {
            colisData = await obtenirColisParEtat(etat);
        }
        filteredColis = [...colisData];
        afficherColis(filteredColis);
    } catch (error) {
        console.error('Erreur lors du filtrage par état:', error);
        afficherErreur('Erreur lors du filtrage par état.');
    }
}

// Initialiser les événements
function initialiserEvenements(): void {
    if (etatFilter) {
        etatFilter.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            filtrerParEtat(target.value);
        });
    }
    if (typeProduitFilter) {
        typeProduitFilter.addEventListener('change', filtrerColis);
    }
    if (expediteurFilter) {
        expediteurFilter.addEventListener('input', filtrerColis);
    }
    if (destinataireFilter) {
        destinataireFilter.addEventListener('input', filtrerColis);
    }
    if (codeFilter) {
        codeFilter.addEventListener('input', filtrerColis);
    }
}

// Charger les colis
async function chargerColis(): Promise<void> {
    try {
        afficherChargement();
        colisData = await obtenirTousColis();
        filteredColis = [...colisData];
        afficherColis(filteredColis);
    } catch (error) {
        console.error('Erreur lors du chargement des colis:', error);
        afficherErreur('Erreur lors du chargement des colis. Vérifiez que json-server est démarré.');
    }
}

// Afficher l'état de chargement
function afficherChargement(): void {
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="px-6 py-12 text-center">
                <div class="flex items-center justify-center space-x-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p class="text-gray-600">Chargement des colis...</p>
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
            <td colspan="8" class="px-6 py-12 text-center text-red-500">
                <i data-lucide="alert-circle" class="w-12 h-12 mx-auto mb-4 text-red-300"></i>
                <p class="text-lg font-medium">Erreur</p>
                <p class="text-sm">${message}</p>
            </td>
        </tr>
    `;
}

// Fonctions globales pour les actions
function voirDetailsColis(id: number): void {
    console.log('Voir détails colis:', id);
    // TODO: Implémenter la vue détaillée
    window.location.href = `/colis/details/${id}`;
}

function modifierColis(id: number): void {
    console.log('Modifier colis:', id);
    // TODO: Implémenter la modification
    window.location.href = `/colis/modifier/${id}`;
}

// Fonction pour rafraîchir les données
export async function rafraichirColis(): Promise<void> {
    await chargerColis();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initialiserElementsDOM();
    initialiserEvenements();
    chargerColis();
});

// Rendre les fonctions globales accessibles
(window as any).voirDetailsColis = voirDetailsColis;
(window as any).modifierColis = modifierColis;
(window as any).rafraichirColis = rafraichirColis;
(window as any).marquerCommeRecupere = marquerCommeRecupere;
(window as any).marquerCommePerdu = marquerCommePerdu;
(window as any).archiverColisManuel = archiverColisManuel;
(window as any).changerEtatColisAction = changerEtatColisAction;

// Export des fonctions principales
export {
    chargerColis,
    voirDetailsColis,
    modifierColis
};
