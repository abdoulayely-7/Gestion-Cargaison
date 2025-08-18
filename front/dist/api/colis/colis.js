import { ColisEtat } from "../../enums/ColisEtat.js";
import { ColisType } from "../../enums/ColisType.js";
import { CargaisonType } from "../../enums/CargaisonType.js";
import { CargaisonEtatAvancement } from "../../enums/CargaisonEtatAvancement.js";
import { Colis } from "../../models/Colis.js";
import { Cargaison } from "../../models/Cargaison.js";
const BASE_URL = 'http://localhost:3000';
/**
 * Récupère tous les colis depuis l'API
 */
export async function obtenirTousColis() {
    try {
        const response = await fetch(`${BASE_URL}/colis`);
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
export async function rechercherParCode(code) {
    try {
        const response = await fetch(`${BASE_URL}/colis?code=${code}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const colis = await response.json();
        return colis.length > 0 ? colis[0] : null;
    }
    catch (error) {
        console.error('Erreur lors de la recherche de colis:', error);
        throw error;
    }
}
export async function obtenirCargaison(cargaisonId) {
    try {
        const response = await fetch(`${BASE_URL}/cargaisons/${cargaisonId}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la cargaison:', error);
        throw error;
    }
}
export function obtenirProgressionEtat(etatCargaison) {
    switch (etatCargaison) {
        case 'EN_ATTENTE':
            return { step: 1, message: 'Colis enregistré et en attente de traitement' };
        case 'EN_COURS':
            return { step: 2, message: 'En cours de transport - Arrivée prévue dans 2-3 jours' };
        case 'TRANSPORT':
            return { step: 3, message: 'Colis en transit vers sa destination' };
        case 'LIVRE':
            return { step: 4, message: 'Colis livré avec succès' };
        default:
            return { step: 1, message: 'État inconnu' };
    }
}
export function obtenirIconeTransport(type) {
    switch (type) {
        case 'AERIEN': return 'plane';
        case 'MARITIME': return 'ship';
        case 'ROUTIER': return 'truck';
        default: return 'package';
    }
}
export function obtenirLabelTypeProduit(type) {
    switch (type) {
        case 'ALIMENTAIRE': return 'Produit Alimentaire';
        case 'CHIMIQUE': return 'Produit Chimique';
        case 'MATERIEL_FRAGILE': return 'Matériel Fragile';
        case 'MATERIEL_INCASSABLE': return 'Matériel Incassable';
        default: return type;
    }
}
export function obtenirLabelTransport(type) {
    switch (type) {
        case 'AERIEN': return 'Aérien';
        case 'MARITIME': return 'Maritime';
        case 'ROUTIER': return 'Routier';
        default: return type;
    }
}
export async function obtenirCoordonnees(address) {
    const coordinates = {};
    return coordinates[address] || null;
}
export function simulerPositionActuelle(departure, arrival, etat) {
    // Simulation de position basée sur l'état
    let progress = 0;
    switch (etat) {
        case 'EN_ATTENTE':
            progress = 0;
            break;
        case 'EN_COURS':
            progress = 0.3; // 30% du trajet
            break;
        case 'TRANSPORT':
            progress = 0.7; // 70% du trajet
            break;
        case 'LIVRE':
            progress = 1;
            break;
        default:
            progress = 0;
    }
    const lat = departure.lat + (arrival.lat - departure.lat) * progress;
    const lng = departure.lng + (arrival.lng - departure.lng) * progress;
    return { lat, lng };
}
// Convertir les données API vers le modèle Colis
export function convertirReponseAPIVersColis(apiResponse) {
    // Créer un objet User pour l'expéditeur et le destinataire
    const expediteur = {
        id: 0, // ID temporaire
        nom: apiResponse.expediteur.nom,
        prenom: apiResponse.expediteur.prenom,
        email: '', // Non disponible dans l'API
        password: '', // Non applicable
        telephone: apiResponse.expediteur.telephone,
        adresse: apiResponse.expediteur.adresse
    };
    const destinataire = {
        id: 0, // ID temporaire
        nom: apiResponse.destinataire.nom,
        prenom: apiResponse.destinataire.prenom,
        email: '', // Non disponible dans l'API
        password: '', // Non applicable
        telephone: apiResponse.destinataire.telephone,
        adresse: apiResponse.destinataire.adresse
    };
    const colis = new Colis(apiResponse.etat, apiResponse.poids, expediteur, destinataire, apiResponse.typeProduit, '', apiResponse.dateEnregistrement, apiResponse.dateLivraisonPrev);
    // Définir les propriétés calculées
    colis.id = apiResponse.id;
    colis.code = apiResponse.code;
    return colis;
}
// Convertir les données API vers le modèle Cargaison
export function convertirReponseAPIVersCargaison(apiResponse) {
    const cargaison = new Cargaison(0, // poidsMax - à définir selon les besoins
    [], // colis - sera rempli séparément
    apiResponse.type, // Cast vers CargaisonType
    apiResponse.lieuDepart, apiResponse.lieuArrivee, apiResponse.distance, apiResponse.etat, // Cast vers CargaisonEtatAvancement
    apiResponse.dateDepart, apiResponse.dateArrivee);
    // Définir les propriétés calculées
    cargaison.id = apiResponse.id;
    return cargaison;
}
export async function rechercherModeleColisModel(code) {
    const apiResponse = await rechercherParCode(code);
    return apiResponse ? convertirReponseAPIVersColis(apiResponse) : null;
}
export async function obtenirModeleCargaison(cargaisonId) {
    const apiResponse = await obtenirCargaison(cargaisonId);
    return apiResponse ? convertirReponseAPIVersCargaison(apiResponse) : null;
}
export async function obtenirColisAvecCargaison(code) {
    try {
        const colisApi = await rechercherParCode(code);
        if (!colisApi)
            return null;
        const cargaisonApi = await obtenirCargaison(colisApi.cargaisonId);
        if (!cargaisonApi)
            return null;
        const colis = convertirReponseAPIVersColis(colisApi);
        const cargaison = convertirReponseAPIVersCargaison(cargaisonApi);
        return { colis, cargaison };
    }
    catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
    }
}
//# sourceMappingURL=colis.js.map