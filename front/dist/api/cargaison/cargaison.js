import { API_URI } from "../../config/environnement.js";
// Récupérer toutes les cargaisons
export async function getAll() {
    const res = await fetch(`${API_URI}/cargaisons?_embed=colis`);
    return res.json();
}
// Créer une cargaison avec un premier colis obligatoire
export async function createCargaison(cargaison, premierColis) {
    // 1️⃣ Ajouter le premier colis à la cargaison pour calculer le prix
    cargaison.ajouterColis(premierColis);
    // 2️⃣ Créer la cargaison sans les colis
    const resCarg = await fetch(`${API_URI}/cargaisons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...cargaison,
            colis: [],
            prixTotalCargaison: cargaison.prixTotalCargaison
        }),
    });
    const newCargaison = await resCarg.json();
    // 3️⃣ Créer le colis avec le lien vers la cargaison
    const resColis = await fetch(`${API_URI}/colis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...premierColis, cargaisonId: newCargaison.id }),
    });
    const newColis = await resColis.json();
    // 4️⃣ Mettre à jour la cargaison avec l’ID du colis
    const resUpdate = await fetch(`${API_URI}/cargaisons/${newCargaison.id}`, {
        method: "PATCH", // PATCH pour ne mettre à jour que le champ colis
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            colis: [newColis.id] // tableau avec juste l’ID
        }),
    });
    const cargaisonFinale = await resUpdate.json();
    return cargaisonFinale;
}
// Mettre à jour une cargaison
export async function update(cargaison) {
    const res = await fetch(`${API_URI}/cargaisons/${cargaison.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cargaison),
    });
    return res.json();
}
export async function obtenirToutesCargaisons() {
    try {
        const response = await fetch(`${API_URI}/cargaisons`);
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
        const response = await fetch(`${API_URI}/cargaisons/${id}`);
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
        const response = await fetch(`${API_URI}/cargaisons?type=${type}`);
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
        const response = await fetch(`${API_URI}/cargaisons?etatAvancement=${etat}`);
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
export async function mettreAJourCargaison(id, cargaison) {
    try {
        const response = await fetch(`${API_URI}/cargaisons/${id}`, {
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
        const response = await fetch(`${API_URI}/cargaisons/${id}`, {
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
 * Ferme une cargaison (change l'état global à "Fermé")
 */
export async function fermerCargaison(id) {
    try {
        const response = await fetch(`${API_URI}/cargaisons/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ etatGlobal: 'Fermé' }),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cargaisonMiseAJour = await response.json();
        return cargaisonMiseAJour;
    }
    catch (error) {
        console.error('Erreur lors de la fermeture de la cargaison:', error);
        throw error;
    }
}
/**
 * Rouvre une cargaison (change l'état global à "Ouvert")
 * Seulement possible si l'état d'avancement est "En attente"
 */
export async function rouvrirCargaison(id) {
    try {
        // Vérifier d'abord l'état d'avancement de la cargaison
        const cargaison = await obtenirCargaisonParId(id);
        if (!cargaison) {
            throw new Error('Cargaison non trouvée');
        }
        if (cargaison.etatAvancement.toLowerCase() !== 'en attente') {
            throw new Error('Une cargaison ne peut être rouverte que si son état d\'avancement est "En attente"');
        }
        const response = await fetch(`${API_URI}/cargaisons/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ etatGlobal: 'Ouvert' }),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const cargaisonMiseAJour = await response.json();
        return cargaisonMiseAJour;
    }
    catch (error) {
        console.error('Erreur lors de la réouverture de la cargaison:', error);
        throw error;
    }
}
/**
 * Vérifie si une cargaison peut être rouverte
 */
export function peutEtreRouverte(cargaison) {
    return cargaison.etatGlobal?.toLowerCase() === 'fermé' &&
        cargaison.etatAvancement?.toLowerCase() === 'en attente';
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