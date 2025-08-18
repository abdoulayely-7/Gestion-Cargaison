import { Cargaison } from '../../models/Cargaison.js';
const API_BASE_URL = 'http://localhost:3000';
/**
 * Récupère toutes les cargaisons depuis l'API
 */
export async function obtenirToutesCargaisons() {
    try {
        const response = await fetch(`${API_BASE_URL}/cargaisons`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cargaisons = await response.json();
        return cargaisons;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des cargaisons:', error);
        throw error;
    }
}
/**
 * Récupère une cargaison par son ID
 */
export async function obtenirCargaisonParId(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/cargaisons/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cargaison = await response.json();
        return cargaison;
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la cargaison:', error);
        throw error;
    }
}
/**
 * Récupère les cargaisons par type
 */
export async function obtenirCargaisonsParType(type) {
    try {
        const response = await fetch(`${API_BASE_URL}/cargaisons?type=${type}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cargaisons = await response.json();
        return cargaisons;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des cargaisons par type:', error);
        throw error;
    }
}
/**
 * Récupère les cargaisons par état d'avancement
 */
export async function obtenirCargaisonsParEtat(etat) {
    try {
        const response = await fetch(`${API_BASE_URL}/cargaisons?etatAvancement=${etat}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cargaisons = await response.json();
        return cargaisons;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des cargaisons par état:', error);
        throw error;
    }
}
/**
 * Crée une nouvelle cargaison
 */
// export async function creerCargaison(cargaison: Omit<Cargaison, 'id'>): Promise<Cargaison> {
//     try {
//         const response = await fetch(`${API_BASE_URL}/cargaisons`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(cargaison),
//         });
//         if (!response.ok) {
//             throw new Error(`Erreur HTTP: ${response.status}`);
//         }
//         const nouvelleCargaison = await response.json();
//         return nouvelleCargaison;
//     } catch (error) {
//         console.error('Erreur lors de la création de la cargaison:', error);
//         throw error;
//     }
// }
/**
 * Met à jour une cargaison existante
 */
export async function mettreAJourCargaison(id, cargaison) {
    try {
        const response = await fetch(`${API_BASE_URL}/cargaisons/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cargaison),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cargaisonMiseAJour = await response.json();
        return cargaisonMiseAJour;
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la cargaison:', error);
        throw error;
    }
}
/**
 * Supprime une cargaison
 */
export async function supprimerCargaison(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/cargaisons/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la cargaison:', error);
        throw error;
    }
}
/**
 * Fonction utilitaire pour formater les coordonnées
 */
export function formaterCoordonnees(lieuDepart, lieuArrivee) {
    return {
        depart: lieuDepart,
        arrivee: lieuArrivee
    };
}
/**
 * Fonction utilitaire pour calculer le pourcentage d'avancement
 */
export function calculerPourcentageAvancement(etatAvancement) {
    switch (etatAvancement.toLowerCase()) {
        case 'en attente':
            return 10;
        case 'en cours':
            return 50;
        case 'en transit':
            return 75;
        case 'livré':
            return 100;
        default:
            return 0;
    }
}
/**
 * Fonction utilitaire pour générer un numéro de cargaison
 */
export function genererNumeroCargaison(type) {
    const prefixe = type.substring(0, 3).toUpperCase();
    const timestamp = Date.now();
    return `${prefixe}${timestamp}`;
}
//# sourceMappingURL=cargaison.js.map