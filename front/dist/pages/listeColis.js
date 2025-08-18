import { Colis } from "../models/Colis.js";
const API_BASE_URL = 'http://localhost:3000';
// Variables globales
let colisData = [];
let filteredColis = [];
// Éléments DOM
let tableBody;
let etatFilter;
let typeProduitFilter;
let expediteurFilter;
let destinataireFilter;
let codeFilter;
/**
 * Récupère tous les colis depuis l'API
 */
export async function obtenirTousLesColis() {
    try {
        const response = await fetch(`${API_BASE_URL}/colis`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des colis:', error);
        throw error;
    }
}
/**
 * Récupère un colis par son code
 */
export async function obtenirColisParCode(code) {
    try {
        const response = await fetch(`${API_BASE_URL}/colis?code=${code}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis.length > 0 ? colis[0] : null;
    }
    catch (error) {
        console.error('Erreur lors de la récupération du colis:', error);
        throw error;
    }
}
/**
 * Récupère les colis par état
 */
export async function obtenirColisParEtat(etat) {
    try {
        const response = await fetch(`${API_BASE_URL}/colis?etat=${etat}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des colis par état:', error);
        throw error;
    }
}
/**
 * Récupère les colis par cargaison
 */
export async function obtenirColisParCargaison(cargaisonId) {
    try {
        const response = await fetch(`${API_BASE_URL}/colis?cargaisonId=${cargaisonId}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const colis = await response.json();
        return colis;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des colis par cargaison:', error);
        throw error;
    }
}
// Obtenir l'icône selon le type de produit
export function obtenirIconeTypeProduit(typeProduit, souType) {
    switch (typeProduit) {
        case 'Alimentaire': return 'utensils';
        case 'Chimique': return 'flask-conical';
        case 'Materiel':
            return souType === 'Fragile' ? 'package-x' : 'package-check';
        default: return 'package';
    }
}
// Obtenir le label du type de produit
export function obtenirLabelTypeProduit(typeProduit, souType) {
    switch (typeProduit) {
        case 'Alimentaire': return 'Alimentaire';
        case 'Chimique': return 'Chimique';
        case 'Materiel':
            return souType === 'Fragile' ? 'Matériel Fragile' : 'Matériel Incassable';
        default: return typeProduit;
    }
}
// Obtenir la couleur selon le type de produit
export function obtenirCouleurTypeProduit(typeProduit, souType) {
    switch (typeProduit) {
        case 'Alimentaire': return 'bg-green-100 text-green-800';
        case 'Chimique': return 'bg-red-100 text-red-800';
        case 'Materiel':
            return souType === 'Fragile' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
// Obtenir le label de l'état
export function obtenirLabelEtatColis(etat) {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'En attente';
        case 'en cours': return 'En cours';
        case 'en transit': return 'En transit';
        case 'livré': return 'Livré';
        default: return etat;
    }
}
// Obtenir la couleur selon l'état
export function obtenirCouleurEtatColis(etat) {
    switch (etat.toLowerCase()) {
        case 'en attente': return 'bg-yellow-100 text-yellow-800';
        case 'en cours': return 'bg-blue-100 text-blue-800';
        case 'en transit': return 'bg-green-100 text-green-800';
        case 'livré': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
// Vérifier si un colis respecte les règles de transport
export function verifierReglesTransport(coli) {
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
export function obtenirIndicateurToxicite(degre) {
    if (!degre)
        return '';
    const couleurs = ['green', 'yellow', 'orange', 'red', 'red'];
    const couleur = couleurs[degre - 1] || 'gray';
    return `<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${couleur}-100 text-${couleur}-800">
        <i data-lucide="alert-triangle" class="w-3 h-3 mr-1"></i>
        Toxicité: ${degre}/5
    </span>`;
}
// Formater le poids
export function formaterPoids(poids) {
    return `${poids} kg`;
}
// Formater la date
export function formaterDate(dateString) {
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
function initialiserElementsDOM() {
    tableBody = document.querySelector('#colis-table-body');
    etatFilter = document.querySelector('#etat-filter');
    typeProduitFilter = document.querySelector('#type-produit-filter');
    expediteurFilter = document.querySelector('#expediteur-filter');
    destinataireFilter = document.querySelector('#destinataire-filter');
    codeFilter = document.querySelector('#code-filter');
}
// Afficher les colis dans le tableau
export function afficherColis(colis) {
    if (!tableBody)
        return;
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
                <div class="flex space-x-2">
                    <button onclick="event.stopPropagation(); voirDetailsColis(${col.id})" class="text-indigo-600 hover:text-indigo-900">Voir</button>
                    <button onclick="event.stopPropagation(); modifierColis(${col.id})" class="text-gray-600 hover:text-gray-900">Modifier</button>
                </div>
            </td>
        </tr>
    `).join('');
    // Réinitialiser les icônes Lucide
    if (typeof window.lucide !== 'undefined') {
        window.lucide.createIcons();
    }
}
// Filtrer les colis
export function filtrerColis() {
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
export async function filtrerParEtat(etat) {
    try {
        afficherChargement();
        if (etat === 'tous' || etat === '') {
            colisData = await obtenirTousLesColis();
        }
        else {
            colisData = await obtenirColisParEtat(etat);
        }
        filteredColis = [...colisData];
        afficherColis(filteredColis);
    }
    catch (error) {
        console.error('Erreur lors du filtrage par état:', error);
        afficherErreur('Erreur lors du filtrage par état.');
    }
}
// Initialiser les événements
function initialiserEvenements() {
    if (etatFilter) {
        etatFilter.addEventListener('change', (e) => {
            const target = e.target;
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
async function chargerColis() {
    try {
        afficherChargement();
        colisData = await obtenirTousLesColis();
        filteredColis = [...colisData];
        afficherColis(filteredColis);
    }
    catch (error) {
        console.error('Erreur lors du chargement des colis:', error);
        afficherErreur('Erreur lors du chargement des colis. Vérifiez que json-server est démarré.');
    }
}
// Afficher l'état de chargement
function afficherChargement() {
    if (!tableBody)
        return;
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
function afficherErreur(message) {
    if (!tableBody)
        return;
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
function voirDetailsColis(id) {
    console.log('Voir détails colis:', id);
    // TODO: Implémenter la vue détaillée
    window.location.href = `/colis/details/${id}`;
}
function modifierColis(id) {
    console.log('Modifier colis:', id);
    // TODO: Implémenter la modification
    window.location.href = `/colis/modifier/${id}`;
}
// Fonction pour rafraîchir les données
export async function rafraichirColis() {
    await chargerColis();
}
// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initialiserElementsDOM();
    initialiserEvenements();
    chargerColis();
});
// Rendre les fonctions globales accessibles
window.voirDetailsColis = voirDetailsColis;
window.modifierColis = modifierColis;
window.rafraichirColis = rafraichirColis;
// Export des fonctions principales
export { chargerColis, voirDetailsColis, modifierColis };
//# sourceMappingURL=listeColis.js.map